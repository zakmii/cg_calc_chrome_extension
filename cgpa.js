function getSelfGrowthCredits(courseCode, credit) {
    if (courseCode.includes('MSC481')) {
        return credit;
    }
    return 0;
}

function getCommunityWorkCredits(courseCode, credit) {
    if (courseCode.includes('MSC491')) {
        return credit;
    }
    return 0;
}

function getOnlineCourseCredits(classType, credit) {
    if (classType.includes('Outside Institute')) {
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
            const courseCode = data.syllabusCourse?.courseClassType?.course?.code || '';
            const courseName = data.syllabusCourse?.courseClassType?.course?.name || '';
            const classType = data.syllabusCourse?.courseClassType?.classType?.code || '';

            totalDegreeCredits += credit;

            selfGrowthCredits += getSelfGrowthCredits(courseCode, credit);
            communityWorkCredits += getCommunityWorkCredits(courseCode, credit);
            onlineCourseCredits += getOnlineCourseCredits(classType, credit);
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
    const cgpa = totalCredits > 0 ? totalWeightedScore / totalCredits : 0;
    logs.push('--------------------------------------');
    logs.push(`Self Growth Credits: ${selfGrowthCredits}`);
    logs.push(`Community Work Credits: ${communityWorkCredits}`);
    logs.push('--------------------------------------');
    logs.push(`TA Ship Credits: ${taShipCredits}`);
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
