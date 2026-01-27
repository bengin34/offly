#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// File paths
const ROOT = path.join(__dirname, '..');
const PACKAGE_JSON = path.join(ROOT, 'package.json');
const APP_JSON = path.join(ROOT, 'app.json');

// Parse version string (e.g., "1.0.1" -> {major: 1, minor: 0, patch: 1})
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
  };
}

// Bump version based on type
function bumpVersion(version, type) {
  const v = parseVersion(version);

  switch (type) {
    case 'patch':
      v.patch += 1;
      break;
    case 'minor':
      v.minor += 1;
      v.patch = 0;
      break;
    case 'major':
      v.major += 1;
      v.minor = 0;
      v.patch = 0;
      break;
    default:
      throw new Error(`Invalid bump type: ${type}`);
  }

  return `${v.major}.${v.minor}.${v.patch}`;
}

// Increment build number
function incrementBuildNumber(currentBuild) {
  const buildNum = parseInt(currentBuild, 10);
  if (isNaN(buildNum)) {
    return '1';
  }
  return String(buildNum + 1);
}

// Read file safely
function readFileSafe(filepath) {
  if (!fs.existsSync(filepath)) {
    return null;
  }
  return fs.readFileSync(filepath, 'utf8');
}

// Update package.json
function updatePackageJson(newVersion) {
  const content = readFileSafe(PACKAGE_JSON);
  if (!content) throw new Error('package.json not found');

  const pkg = JSON.parse(content);
  pkg.version = newVersion;

  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + '\n');
  return true;
}

// Update app.json (version + build numbers)
function updateAppJson(newVersion, incrementBuilds = true) {
  const content = readFileSafe(APP_JSON);
  if (!content) throw new Error('app.json not found');

  const app = JSON.parse(content);
  app.expo.version = newVersion;

  if (incrementBuilds) {
    // Increment iOS buildNumber
    if (app.expo.ios?.buildNumber) {
      app.expo.ios.buildNumber = incrementBuildNumber(app.expo.ios.buildNumber);
    }

    // Increment Android versionCode
    if (app.expo.android?.versionCode) {
      app.expo.android.versionCode = parseInt(app.expo.android.versionCode, 10) + 1;
    }
  }

  fs.writeFileSync(APP_JSON, JSON.stringify(app, null, 2) + '\n');
  return {
    iosBuild: app.expo.ios?.buildNumber,
    androidVersion: app.expo.android?.versionCode,
  };
}

// Create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Ask user a question
function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main function
async function main() {
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}   Mamio Version Bump Script${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Read current version
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  const app = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
  const currentVersion = pkg.version;
  const currentIosBuild = app.expo.ios?.buildNumber || 'N/A';
  const currentAndroidVersion = app.expo.android?.versionCode || 'N/A';

  console.log(`${colors.blue}Current version:${colors.reset} ${currentVersion}`);
  console.log(`${colors.blue}iOS build:${colors.reset} ${currentIosBuild}`);
  console.log(`${colors.blue}Android versionCode:${colors.reset} ${currentAndroidVersion}\n`);

  // Calculate bump previews
  const patchVersion = bumpVersion(currentVersion, 'patch');
  const minorVersion = bumpVersion(currentVersion, 'minor');
  const majorVersion = bumpVersion(currentVersion, 'major');

  console.log('Select version bump type:');
  console.log(`  ${colors.green}(p)${colors.reset} patch  → ${patchVersion} (Bug fixes)`);
  console.log(`  ${colors.green}(m)${colors.reset} minor  → ${minorVersion} (New features)`);
  console.log(`  ${colors.green}(M)${colors.reset} major  → ${majorVersion} (Breaking changes)`);
  console.log('');

  const rl = createInterface();

  // Get bump type
  let bumpType = '';
  while (!['p', 'm', 'M'].includes(bumpType)) {
    bumpType = await ask(rl, `${colors.yellow}Choice:${colors.reset} `);

    if (!['p', 'm', 'M'].includes(bumpType)) {
      console.log(`${colors.red}Invalid choice. Please enter p, m, or M${colors.reset}`);
    }
  }

  // Map choice to bump type
  const bumpMap = { p: 'patch', m: 'minor', M: 'major' };
  const selectedBump = bumpMap[bumpType];
  const newVersion = bumpVersion(currentVersion, selectedBump);

  // Calculate new build numbers
  const newIosBuild = incrementBuildNumber(currentIosBuild);
  const newAndroidVersion = parseInt(currentAndroidVersion, 10) + 1;

  console.log('');
  console.log(`${colors.blue}Preview:${colors.reset}`);
  console.log(`  Version:        ${currentVersion} → ${colors.green}${newVersion}${colors.reset}`);
  console.log(`  iOS build:      ${currentIosBuild} → ${colors.green}${newIosBuild}${colors.reset}`);
  console.log(`  Android code:   ${currentAndroidVersion} → ${colors.green}${newAndroidVersion}${colors.reset}\n`);

  // Show files to update
  console.log('Files to update:');
  console.log(`  ${colors.green}✓${colors.reset} package.json`);
  console.log(`  ${colors.green}✓${colors.reset} app.json (version + iOS/Android builds)`);
  console.log('');

  // Ask for confirmation
  const confirm = await ask(rl, `${colors.yellow}Proceed? (y/n):${colors.reset} `);

  if (confirm.toLowerCase() !== 'y') {
    console.log(`\n${colors.red}Aborted.${colors.reset}`);
    rl.close();
    process.exit(0);
  }

  console.log('');

  // Update files
  try {
    updatePackageJson(newVersion);
    console.log(`${colors.green}✓${colors.reset} Updated package.json → ${newVersion}`);

    const builds = updateAppJson(newVersion, true);
    console.log(`${colors.green}✓${colors.reset} Updated app.json`);
    console.log(`  - Version: ${newVersion}`);
    console.log(`  - iOS buildNumber: ${builds.iosBuild}`);
    console.log(`  - Android versionCode: ${builds.androidVersion}`);

    console.log('');
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.green}✓ Version successfully updated to ${newVersion}!${colors.reset}`);
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log('');
    console.log(`${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Review changes: ${colors.yellow}git diff${colors.reset}`);
    console.log(`  2. Build iOS: ${colors.yellow}npm run ios-build${colors.reset}`);
    console.log(`  3. Build Android: ${colors.yellow}npm run android-build${colors.reset}`);
    console.log(`  4. Submit: ${colors.yellow}npm run ios-submit${colors.reset} / ${colors.yellow}npm run android-submit${colors.reset}`);
    console.log('');

  } catch (error) {
    console.log('');
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

// Run the script
main().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
