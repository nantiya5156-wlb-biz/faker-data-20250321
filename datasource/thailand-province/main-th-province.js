// CORRECTED SCRIPT FOR THE NEW DATA SOURCE
const fs = require('fs');
const path = require('path');

const INPUT_FILENAME = 'thai_data_source.json'; // The new file you just downloaded
const OUTPUT_FILENAME = 'thailand_administrative_data_final.json';

console.log('Starting data generation from new local file...');

function generateThaiGeoData() {
    try {
        // 1. READ DATA FROM LOCAL FILE
        const inputPath = path.join(__dirname, INPUT_FILENAME);
        console.log(`Reading data from ${inputPath}...`);

        if (!fs.existsSync(inputPath)) {
            console.error(`❌ ERROR: Input file not found!`);
            console.error(`Please make sure you have downloaded and saved "${INPUT_FILENAME}" in the same directory as the script.`);
            return;
        }

        const rawFileData = fs.readFileSync(inputPath, 'utf8');
        const rawData = JSON.parse(rawFileData);
        console.log('Data read successfully.');

        // 2. PROCESS AND STRUCTURE THE DATA (with corrected key names)
        console.log('Processing and structuring data...');
        const provinces = [];

        // The outer loop remains the same
        for (const provinceData of rawData) {
            
            // FIX: Get province name from `name_th` instead of `province`
            const province = {
                province_name: provinceData.name_th,
                province_name_en: provinceData.name_en,
                districts: []
            };

            // FIX: Loop over `provinceData.amphure` instead of `provinceData.amphoe`
            for (const districtData of provinceData.amphure) {
                
                // FIX: Get district name from `name_th`
                const district = {
                    district_name: districtData.name_th,
                    district_name_en: districtData.name_en,
                    sub_districts: []
                };

                // FIX: Loop over `districtData.tambon` (this key name was correct)
                for (const subDistrictData of districtData.tambon) {
                    
                    // FIX: Get sub-district name from `name_th` and zip from `zip_code`
                    const subDistrict = {
                        sub_district_name: subDistrictData.name_th,
                        sub_district_name_en: subDistrictData.name_en,
                        zip_code: subDistrictData.zip_code
                    };
                    district.sub_districts.push(subDistrict);
                }
                province.districts.push(district);
            }
            provinces.push(province);
        }
        console.log('Data processed successfully.');

        // 3. SAVE TO JSON FILE
        const outputPath = path.join(__dirname, OUTPUT_FILENAME);
        fs.writeFileSync(outputPath, JSON.stringify(provinces, null, 2));

        console.log(`✅ Success! Data has been saved to: ${outputPath}`);

    } catch (error) {
        console.error('❌ An error occurred:', error.message);
        // This will give more detail if something else goes wrong
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

// Run the main function
generateThaiGeoData();