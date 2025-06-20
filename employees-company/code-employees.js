const { faker, fakerTH } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = "generated-data";

// Configuration for the number of organization data and employee ID starting point
// ********************************************************************************************
const numberOfOrganizationData = 10;
const empStartedNumberForTesting = 1;
var employeeIdCounter = 1; // Employee ID Counter

console.log(`⏳ Generating ${numberOfOrganizationData} organization data...`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const users = Array.from({ length: numberOfOrganizationData }, (_, index) => {
    const sex = faker.helpers.arrayElement(["ชาย", "หญิง", "อื่นๆหรือไม่ระบุ"]);
    const gender = sex === "ชาย" ? "male" : sex === "หญิง" ? "female" : "other";
    
    return {
        employee_id: employeeIdCounter++, 
        employee_no: empStartedNumberForTesting + (index),
        firstname: fakerTH.person.firstName(gender),
        lastname: fakerTH.person.lastName(gender),
        birth_date: faker.date.birthdate({ min: 25, max: 60, mode: 'age' }).toISOString().split('T')[0],
        join_date: faker.date.past({ years: 10 }).toISOString().split('T')[0],
        email: `${empStartedNumberForTesting + (index + 1)}@example.com`,
        sex: sex,
        phoneNumber: fakerTH.phone.number(),
        organization: faker.helpers.arrayElement(["We love bug", "SCK", "SHR"])
    };
});


// Save to JSON file
const outputFile = path.join(OUTPUT_DIR, `employees-${Date.now()}.json`);
try {
    fs.writeFileSync(outputFile, JSON.stringify({ users }, null, 2));
    console.log(`✅ Data successfully saved to: ${outputFile}`);
} catch (error) {
    console.error(`❌ Error writing file:`, error.message);
}
