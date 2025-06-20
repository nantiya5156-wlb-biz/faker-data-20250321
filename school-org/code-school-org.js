const { faker, fakerTH } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = './schema-school-org.json';
const OUTPUT_DIR = 'generated-data';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'school-org-data.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read and parse school structure
let schoolStructure;
try {
    const rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
    schoolStructure = JSON.parse(rawData);
} catch (error) {
    console.error(`❌ Error reading ${INPUT_FILE}:`, error.message);
    process.exit(1);
}

/**
 * Generate teachers based on position and number
 * @param {string} position - Job title with hierarchy
 * @param {number} number - Number of teachers to generate
 * @returns {Array} - List of generated teacher objects
 */
const generateTeachers = (position, number) => 
    Array.from({ length: number }, () => ({
        position,
        firstname: faker.person.firstName(),
        lastname: fakerTH.person.lastName(), // Ensure Thai last names
    }));

/**
 * Recursively generate school structure
 * @param {Object} structure - School organizational structure
 * @param {string} parentPosition - Parent job position for hierarchy tracking
 * @returns {Array} - List of all teachers with positions
 */
const generateStructure = (structure, parentPosition = '') => {
    let result = [];

    for (let position in structure) {
        if (position === 'number') continue;
        
        let fullPosition = parentPosition ? `${parentPosition} -> ${position}` : position;
        let number = structure[position].number || 0;
        
        result.push(...generateTeachers(fullPosition, number));
        result.push(...generateStructure(structure[position], fullPosition));
    }

    return result;
};

// Generate the teacher data
const generatedTeachers = generateStructure(schoolStructure);

// Write data to JSON file
try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(generatedTeachers, null, 2));
    console.log(`✅ Data successfully saved to ${OUTPUT_FILE}`);
} catch (error) {
    console.error(`❌ Error writing to ${OUTPUT_FILE}:`, error.message);
}
