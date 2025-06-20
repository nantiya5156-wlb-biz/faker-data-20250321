const { faker, fakerTH } = require('@faker-js/faker');
const { createRequire } = require('module');
const fs = require('fs');
const path = require('path');
const schema = require('./schema-thai-person.json');
const RandExp = require('randexp');
const thaiId = require('thaiid');

var fakeGender = null;
var fakeName = null;
var fakeLastname = null;
var fakeNameTh = null;
var fakeLastnameTh = null;
var fakeNumber = null;
thaiId: thaiId.random();

const randomValidThaiID = thaiId.random();
console.log(randomValidThaiID);

const OUTPUT_DIR = "generated-data";
// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}


//id as a parameter
function generateDataFromSchema(schema, id) {
    const data = {};
    
    //Add the id to the data object
    data.id = id;
  
    for (const property in schema.properties) 
    {
      if (schema.properties.hasOwnProperty(property)) {
        const propertySchema = schema.properties[property];
        switch (propertySchema.type) 
        {
            case 'string':
                if (propertySchema.format === 'email') 
                {
                    data[property] = faker.internet.email();
                }
                else if(propertySchema.pattern != null)
                {
                    data[property] = new RandExp(propertySchema.pattern).gen();
                }
                else if(propertySchema.enum != null)
                {
                    fakeGender = faker.helpers.arrayElement(propertySchema.enum);
                    data[property] = fakeGender;
                }
                else if(propertySchema.locale != null && (propertySchema.locale == 'th' || propertySchema.locale == 'TH'))
                {
                    data[property] = fakerTH.person.lastName(fakeGender) + " " + fakerTH.person.firstName(fakeGender);
                }
                else if(propertySchema.locale != null)
                {
                    data[property] = faker.person.firstName(fakeGender) + " " + faker.person.lastName(fakeGender);
                }
                else if(propertySchema.method != null)
                {
                    data[property] = thaiId.random();
                }
                else
                {
                    data[property] = faker.lorem.words()
                    
                }
            break;
            case 'integer':
                if((propertySchema.min != null) || (propertySchema.max != null))
                {
                    data[property] = faker.number.int({ min: propertySchema.min, max: propertySchema.max });
                }
                else
                {
                    fakeNumber = faker.number.int();
                    data[property] = fakeNumber;
                }
            break;
            case 'object':
                // Pass the id down to sub-objects if needed, or omit it
                data[property] = generateDataFromSchema(propertySchema, id);
            break;
          // Handle other data types as needed
        }
      }
    }
    return data;
}


const createFakeData = (schema, count) => {
    const fakeDataArray = [];
    for (var counter = 0; counter < count; counter++) {
        fakeDataArray.push(generateDataFromSchema(schema, counter + 1));
    }
    return fakeDataArray;
};

//**************** Generate records ****************
const randomThaiPersonData = createFakeData(schema, 10); 
console.log(randomThaiPersonData);
// ************************************************

// Save to JSON file
const outputFile = path.join(OUTPUT_DIR, `thai-person-data-${Date.now()}.json`);
try {
    fs.writeFileSync(outputFile, JSON.stringify({ randomThaiPersonData }, null, 2));
    console.log(`✅ Data successfully saved to: ${outputFile}`);
} catch (error) {
    console.error(`❌ Error writing file:`, error.message);
}