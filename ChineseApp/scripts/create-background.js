const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// Tạo background trắng 1024x1024
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext("2d");

// Tô màu nền trắng
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 1024, 1024);

// Lưu file
const buffer = canvas.toBuffer("image/png");
const outputPath = path.join(
  __dirname,
  "..",
  "assets",
  "images",
  "android-icon-background.png"
);

fs.writeFileSync(outputPath, buffer);
console.log("✅ Created white background for adaptive icon");
