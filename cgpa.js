export function calculateCGPA(levelsData) {
    let totalCredits = 0;
    let totalWeightedScore = 0;
    let logs = [];  // Collecting logs to show in the popup

    // Iterate over each level and its courses
    levelsData.forEach(level => {
        const courses = level.courses;
        let sgpaCredits = 0;
        let sgpaWeightedScore = 0;

        // Iterate over each course in the level
        courses.forEach(course => {
            const data = course[0];
            const credit = data.syllabusCourse?.credit || 0.0;
            const weightage = data.forcedGrade?.weightage || 0.0;

            // Exclude courses with weightage of 0
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
        logs.push(`SGPA for Level ${level.levelId}: ${sgpa.toFixed(2)}`);
    });

    // Calculate CGPA
    const cgpa = totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
    logs.push(`Total Weighted Score: ${totalWeightedScore}`);
    logs.push(`Total Credits: ${totalCredits}`);
    logs.push(`Calculated CGPA: ${cgpa.toFixed(2)}`);

    return { cgpa, logs };
}
