const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'generated-data';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a list of books
 * @param {number} numBooks - Number of books to generate
 * @returns {Array} - Array of book objects
 */
const generateBooks = (numBooks) => Array.from({ length: numBooks }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    author: faker.person.fullName(),
    genre: faker.helpers.arrayElement(['Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Non-Fiction', 'Historical']),
    publishedDate: faker.date.past({ years: 50 }).toISOString().split('T')[0],
    price: parseFloat(faker.commerce.price({ min: 5, max: 100, dec: 2 })),
}));

/**
 * Generate a list of stationery items
 * @param {number} numItems - Number of stationery items to generate
 * @returns {Array} - Array of stationery objects
 */
const generateStationery = (numItems) => Array.from({ length: numItems }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    type: faker.helpers.arrayElement(['Pen', 'Notebook', 'Eraser', 'Ruler', 'Sharpener', 'Marker']),
    brand: faker.company.name(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 20, dec: 2 })),
}));

/**
 * Generate transactions based on books and stationery
 * @param {Array} books - List of books
 * @param {Array} stationery - List of stationery items
 * @param {number} numTransactions - Number of transactions to generate
 * @returns {Array} - Array of transaction objects
 */
const generateTransactions = (books, stationery, numTransactions) => Array.from({ length: numTransactions }, () => {
    const book = faker.helpers.arrayElement(books);
    const item = faker.helpers.arrayElement(stationery);
    return {
        id: faker.string.uuid(),
        book: {
            title: book.title,
            author: book.author,
            price: book.price,
        },
        stationery: {
            name: item.name,
            type: item.type,
            price: item.price,
        },
        total: book.price + item.price,
        date: faker.date.recent().toISOString().split('T')[0],
    };
});

// Generate Data
console.log('⏳ Generating data...');
const books = generateBooks(100);
const stationery = generateStationery(100);
const transactions = generateTransactions(books, stationery, 10000);
console.log('✅ Data generation complete!');

// Save to JSON file
const outputFile = path.join(OUTPUT_DIR, `free-book-shipping-data-${Date.now()}.json`);
try {
    fs.writeFileSync(outputFile, JSON.stringify({ transactions }, null, 2));
    console.log(`✅ Data successfully saved to ${outputFile}`);
} catch (error) {
    console.error(`❌ Error writing to file:`, error.message);
}
