const fs = require("fs");
const path = require("path");

console.log("🔄 Updating app icons...");

// Kiểm tra các file icon cần thiết
const iconsPath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "res"
);
const assetsPath = path.join(__dirname, "..", "assets", "images");

// Copy ic_launcher thành adaptive icon components
const copyIcons = () => {
  const sizes = ["hdpi", "mdpi", "xhdpi", "xxhdpi", "xxxhdpi"];

  sizes.forEach((size) => {
    const sourceDir = path.join(iconsPath, `mipmap-${size}`);
    const targetDir = path.join(assetsPath);

    // Kiểm tra xem có file ic_launcher.png không
    const sourceLauncher = path.join(sourceDir, "ic_launcher.png");
    if (fs.existsSync(sourceLauncher)) {
      console.log(`✅ Found icon for ${size}`);
    }
  });

  // Copy icon chính từ mipmap-xxxhdpi (độ phân giải cao nhất)
  const mainIconSource = path.join(
    iconsPath,
    "mipmap-xxxhdpi",
    "ic_launcher.png"
  );
  const mainIconTarget = path.join(assetsPath, "icon.png");

  if (fs.existsSync(mainIconSource)) {
    fs.copyFileSync(mainIconSource, mainIconTarget);
    console.log("✅ Updated main icon.png");
  }

  // Tạo foreground, background, monochrome cho adaptive icon
  const foregroundTarget = path.join(assetsPath, "android-icon-foreground.png");
  const backgroundTarget = path.join(assetsPath, "android-icon-background.png");
  const monochromeTarget = path.join(assetsPath, "android-icon-monochrome.png");

  // Copy ic_launcher làm foreground
  if (fs.existsSync(mainIconSource)) {
    fs.copyFileSync(mainIconSource, foregroundTarget);
    fs.copyFileSync(mainIconSource, monochromeTarget);
    console.log("✅ Updated adaptive icon components");
  }

  // Tạo background trắng đơn giản (nếu chưa có)
  console.log(
    '✅ Icon update completed! Run "npx expo prebuild --clean" to apply changes.'
  );
};

copyIcons();
