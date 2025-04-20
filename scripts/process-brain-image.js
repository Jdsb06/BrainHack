const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function processBrainImage() {
  try {
    // Read the original brain image
    const inputImage = path.join(__dirname, '../public/brain.png');
    const outputDir = path.join(__dirname, '../public');

    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Get image metadata
    const metadata = await sharp(inputImage).metadata();
    const halfWidth = Math.floor(metadata.width / 2);

    // Extract left brain (grayscale)
    await sharp(inputImage)
      .extract({ left: 0, top: 0, width: halfWidth, height: metadata.height })
      .grayscale()
      .toFile(path.join(outputDir, 'brain-left.png'));

    // Extract right brain (colorful)
    await sharp(inputImage)
      .extract({ left: halfWidth, top: 0, width: halfWidth, height: metadata.height })
      .toFile(path.join(outputDir, 'brain-right.png'));

    console.log('Brain image processing completed successfully!');
  } catch (error) {
    console.error('Error processing brain image:', error);
  }
}

processBrainImage(); 