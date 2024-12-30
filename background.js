import { calculateCGPA } from './cgpa.js';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and ready.');
});

function extractLastTerm(fieldValue) {
    // Split the string by "/" and return the last element of the resulting array
    const parts = fieldValue.split('/');
    return parts[parts.length - 1];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    
    if (request.action === 'fetchData') {
        const levelsApiUrl = 'https://iiitd.nurecampus.com/NURE/spGetStudentLevels.action';
        const coursesApiUrl = 'https://iiitd.nurecampus.com/NURE/spGetRegisteredCoursesInLevel.action';
        
        console.log('Fetching data...');

        (async () => {
            try {
                // Fetching levels data
                const levelsResponse = await fetch(levelsApiUrl, {
                    method: 'GET',
                    credentials: 'include', // Include cookies
                });

                if (!levelsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${levelsResponse.status}`);
                }

                const levelsData = await levelsResponse.json();
                console.log('Levels data received:', levelsData);

                // Fetching courses data for each level
                const promises = levelsData.map(async (level) => {
                    const levelId = level.level.id;
                    const semesterName = extractLastTerm(level.level.code);
                    // Fetching courses for each level
                    const coursesResponse = await fetch(`${coursesApiUrl}?level.id=${levelId}`, {
                        method: 'GET',
                        credentials: 'include', // Include cookies
                    });

                    if (!coursesResponse.ok) {
                        throw new Error(`HTTP error fetching courses for level ${levelId}! Status: ${coursesResponse.status}`);
                    }

                    const courses = await coursesResponse.json();
                    return {
                        levelId: levelId,
                        courses: courses,
                        semesterName: semesterName,
                    };
                });

                // Await all level and course data promises
                const allLevelsData = await Promise.all(promises);
                console.log('All levels data with courses:', allLevelsData);

                // Calculate CGPA using the fetched data
                const { cgpa, logs } = calculateCGPA(allLevelsData);

                // Send CGPA and logs to the popup
                sendResponse({ success: true, cgpa, logs });
            } catch (error) {
                console.error('Error:', error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Keep the message channel open for async response
    }
});
