import prisma from "./utils/prisma.js";

async function main() {
  const count = await prisma.product.count();
  const DEMO_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: "demo@example.com",
      name: "Demo User",
      password: "hashedpassword",
    },
  });

  await prisma.reservation.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.inventoryLog.deleteMany({});
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      { name: "Apple MacBook Pro M3", stock: 5 },
      { name: "Sony PlayStation 5 Pro", stock: 2 },
      { name: "Samsung Galaxy S24 Ultra", stock: 10 },
      { name: "Dyson V15 Detect Absolute", stock: 1 },
      { name: "iPhone 16 Pro Max", stock: 8 },
      { name: 'iPad Pro 12.9"', stock: 3 },
      { name: "Apple Watch Ultra 2", stock: 6 },
      { name: "AirPods Pro Max", stock: 4 },
      { name: "Dell XPS 13", stock: 7 },
      { name: "HP Spectre x360", stock: 5 },
      { name: "Lenovo ThinkPad X1", stock: 9 },
      { name: "ASUS ROG Laptop", stock: 2 },
      { name: "Canon EOS R6 Mark II", stock: 3 },
      { name: "Sony A7R V Camera", stock: 2 },
      { name: "Nikon Z9 Pro", stock: 1 },
      { name: "GoPro Hero 12 Black", stock: 8 },
      { name: "DJI Air 3S Drone", stock: 4 },
      { name: "Anker PowerBank 737", stock: 15 },
      { name: "Samsung 4K Monitor", stock: 6 },
      { name: "LG UltraWide Monitor", stock: 5 },
      { name: "BenQ Gaming Monitor", stock: 7 },
      { name: "Corsair Gaming Keyboard", stock: 10 },
      { name: "Logitech MX Master 3S", stock: 12 },
      { name: "SteelSeries Arctis Nova", stock: 8 },
      { name: "Sony WH-1000XM5", stock: 6 },
      { name: "Bose QuietComfort Ultra", stock: 4 },
      { name: "Samsung 990 Pro SSD 4TB", stock: 11 },
      { name: "WD Black SN850X", stock: 9 },
      { name: "Crucial P5 Plus", stock: 13 },
      { name: "SK Hynix Platinum P41", stock: 7 },
    ],
  });
  console.log("30 products added!");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
