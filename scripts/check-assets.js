const fs = require('node:fs');
const path = require('node:path');

const requiredAssets = [
  'assets/nova-mark.png',
  'assets/nova-logo-full.png',
  'assets/nova-mountain-hero.png',
  'assets/keep-climbing-mountain-tee-front.jpg',
  'assets/keep-climbing-mountain-tee-back.jpg',
  'assets/keep-climbing-mountain-tee-folded.jpg',
  'assets/keep-climbing-mountain-tee-styled.jpg',
  'assets/mountains-wait-tee-front.jpg',
  'assets/mountains-wait-tee-back.jpg',
  'assets/mountains-wait-tee-folded.jpg',
  'assets/mountains-wait-tee-styled.jpg',
  'assets/nova-reset-tee-front.jpg',
  'assets/nova-reset-tee-back.jpg',
  'assets/nova-reset-tee-folded.jpg',
  'assets/nova-reset-tee-styled.jpg',
];

const projectRoot = path.resolve(__dirname, '..');
const missingAssets = requiredAssets.filter((assetPath) => (
  !fs.existsSync(path.join(projectRoot, assetPath))
));

if (missingAssets.length) {
  console.error('\nMissing required storefront image assets:');
  missingAssets.forEach((assetPath) => console.error(`- ${assetPath}`));
  console.error('\nUpload/commit these files to GitHub, then redeploy. Do not upload node_modules/ or dist/.\n');
  process.exit(1);
}

console.log('All required storefront image assets are present.');
