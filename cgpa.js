function checkSelfGrowth(courseCode) {
    return courseCode.includes('MSC481');
}

function checkCommunityWork(courseCode) {
    return courseCode.includes('MSC491');
}

function getOnlineCourseCredits(courseName, credit) {
    if (courseName.includes('Distance Course')) {
        return credit;
    }
    return 0;
}

function getTaShipCredits(courseName, credit) {
    if (courseName.includes('Teaching Assistantship')) {
        return credit;
    }
    return 0;
}

const GradePoints = {
    'F': 2,
    'I': 0,
    'W': 0,
    'Withdrawn': 0,
    'X': 0
};

export function calculateCGPA(levelsData) {
    let totalCredits = 0;
    let totalDegreeCredits = 0;
    let totalWeightedScore = 0;
    let selfGrowthCredits = 0;
    let communityWorkCredits = 0;
    let onlineCourseCredits = 0;
    let taShipCredits = 0;
    let logs = [];  // Collecting logs to show in the popup

    // Iterate over each level and its courses
    levelsData.forEach(level => {
        const courses = level.courses;
        const semesterName = level.semesterName;
        let sgpaCredits = 0;
        let sgpaWeightedScore = 0;

        // Iterate over each course in the level
        courses.forEach(course => {
            const data = course[0];
            const credit = data.syllabusCourse?.credit || 0.0;
            const weightage = data.forcedGrade?.weightage || 0.0;
            const grade = data.forcedGrade?.code || '';
            const courseCode = data.syllabusCourse?.courseClassType?.course?.code || '';
            const courseName = data.syllabusCourse?.courseClassType?.course?.name || '';

            if (grade in GradePoints) {
                return;
            }

            totalDegreeCredits += credit;

            if(checkSelfGrowth(courseCode)) {
                selfGrowthCredits += credit;
                return;
            }
            if(checkCommunityWork(courseCode)) {
                communityWorkCredits += credit;
                return;
            }
            onlineCourseCredits += getOnlineCourseCredits(courseName, credit);
            taShipCredits += getTaShipCredits(courseName, credit);

            if (weightage === 0) {
                return;
            }

            sgpaCredits += credit;
            sgpaWeightedScore += credit * weightage;

            totalCredits += credit;
            totalWeightedScore += credit * weightage;
        });

        // Calculate SGPA for the level
        const sgpa = sgpaCredits > 0 ? sgpaWeightedScore / sgpaCredits : 0;
        logs.push(`SGPA for ${semesterName}: ${sgpa.toFixed(2)}`);
    });
    
    // Calculate CGPA
    totalDegreeCredits = totalDegreeCredits - taShipCredits - onlineCourseCredits + Math.min(8, taShipCredits + onlineCourseCredits);
    selfGrowthCredits= Math.min(2,selfGrowthCredits);
    communityWorkCredits= Math.min(2,communityWorkCredits);
    
    const cgpa = totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
    logs.push('--------------------------------------');
    logs.push(`Self Growth Credits: ${selfGrowthCredits}`);
    logs.push(`Community Work Credits: ${communityWorkCredits}`);
    logs.push('--------------------------------------');
    logs.push(`TAship Credits: ${taShipCredits}`);
    logs.push(`Online Course Credits: ${onlineCourseCredits}`);
    logs.push('--------------------------------------');
    logs.push(`Total Weighted Score: ${totalWeightedScore}`);
    logs.push(`Total Credits: ${totalCredits}`);
    logs.push(`Total Degree Credits: ${totalDegreeCredits - selfGrowthCredits - communityWorkCredits} + ${selfGrowthCredits + communityWorkCredits} (SG+CW) `);
    logs.push('--------------------------------------');
    logs.push(`NOTE: Dropping of the lowest grade is not considered in this calculation.`);

    logs = logs.map(log => {
        if (log.includes('Total') || log.includes('NOTE')) {
            return `<b>${log}</b>`;
        }
        return log;
    });

    return { cgpa, logs };
}
