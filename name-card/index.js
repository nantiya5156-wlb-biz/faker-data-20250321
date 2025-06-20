const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { json } = require('stream/consumers');

function generateNameCards(count) {
    const nameCards = [];
    for (let i = 0; i < count; i++) {
        nameCards.push({
            id: i + 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            company: faker.company.name(),
            jobTitle: faker.person.jobTitle(),
            address: faker.location.streetAddress(),
            avatar: faker.image.avatar(),
        });
    }
    return nameCards;
}

// Generate and save data
const data = generateNameCards(100);
var jsonToFile = JSON.stringify(data);
/*
fs.writeFile('generated-data/namecard-data-' + Date.now() + '.json', jsonToFile, function (err) {
    if (err) throw err;
    console.log('✅ Faker data generated successfully in data.json');
});
*/

fs.writeFile('data.json', jsonToFile, function (err) {
    if (err) throw err;
    console.log('✅ Faker data generated successfully in data.json');
});
