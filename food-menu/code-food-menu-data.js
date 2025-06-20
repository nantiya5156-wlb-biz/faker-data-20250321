const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const OUTPUT_DIR = 'generated-data';
const menuFile = 'food-beverage-sweet-menu.csv';

// Define the number of orders to generate
const numberOfOrders = 5;
// ------------------------------------

const orderTypes = ['Dine-in', 'Delivery', 'Take Away'];

const menuItems = [];
const orders = [];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Step 1: Read menu from CSV
fs.createReadStream(menuFile)
  .pipe(csv())
  .on('data', (row) => {
    menuItems.push({
      id: faker.string.uuid(),
      thaiName: row['ชื่อเมนู - ไทย'],
      englishName: row['ชื่อเมนู - อังกฤษ'],
      price: parseFloat(row['ราคาขาย (บาท)']),
      addon1: row['Add-on1']?.trim(),
      addon1Price: parseFloat(row['Price1']) || 0,
      addon2: row['Add-on2']?.trim(),
      addon2Price: parseFloat(row['Price2']) || 0
    });
  })
  .on('end', () => {
    console.log(`✅ Loaded ${menuItems.length} menu items`);

    // Step 2: Generate Orders
    for (let i = 0; i < numberOfOrders; i++) {
      const orderId = faker.string.uuid();
      const customerName = faker.person.fullName();
      const orderTime = faker.date.recent({ days: 7 }).toISOString();
      const orderType = faker.helpers.arrayElement(orderTypes);
      const itemCount = faker.number.int({ min: 1, max: 10 });

      const selectedItems = faker.helpers.shuffle(menuItems).slice(0, itemCount).map(item => {
        const quantity = faker.number.int({ min: 1, max: 3 });

        const addons = [];
        if (item.addon1 && faker.datatype.boolean()) {
          addons.push({ name: item.addon1, price: item.addon1Price });
        }
        if (item.addon2 && faker.datatype.boolean()) {
          addons.push({ name: item.addon2, price: item.addon2Price });
        }

        const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
        const itemTotal = (item.price + addonTotal) * quantity;

        return {
          id: item.id,
          thaiName: item.thaiName,
          englishName: item.englishName,
          quantity,
          unitPrice: item.price,
          addons,
          total: +itemTotal.toFixed(2)
        };
      });

      const totalPrice = selectedItems.reduce((sum, item) => sum + item.total, 0);

      orders.push({
        orderId,
        customerName,
        orderType,
        orderTime,
        items: selectedItems,
        totalPrice: +totalPrice.toFixed(2)
      });
    }

    // Step 3: Save Output
    const outputFile = path.join(OUTPUT_DIR, `food-orders-${Date.now()}.json`);
    try {
        fs.writeFileSync(outputFile, JSON.stringify(orders, null, 2), 'utf-8');
        // Log a summary table of all orders
        console.table(
            orders.map(order => ({
                OrderID: order.orderId.slice(0, 8), // Shorten for display
                Customer: order.customerName,
                Type: order.orderType,
                Time: order.orderTime.split('T')[0], // Show only date
                Items: order.items.length,
                Total: order.totalPrice
            }))
        );
        orders.forEach((order, index) => {
            console.log(`\n📦 Order ${index + 1}: ${order.customerName} (${order.orderType})`);
            console.log(`🕒 Time: ${order.orderTime}`);
            console.log(`🧾 Total: ${order.totalPrice} THB`);
            console.table(order.items.map(item => ({
                Thai: item.thaiName,
                English: item.englishName,
                Qty: item.quantity,
                Price: item.unitPrice,
                'Add-ons': item.addons.map(a => `${a.name} (+${a.price})`).join(', ') || '—',
                'Item Total': item.total
            })));
    });
    console.log(`✅ ${numberOfOrders} orders saved to: ${outputFile}`);
            } catch (error) {
            console.error(`❌ Error writing file:`, error.message);
            }
    });
