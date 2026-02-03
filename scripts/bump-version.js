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
const ANDROID_BUILD_GRADLE = path.join(ROOT, 'android', 'app', 'build.gradle');

// The iOS targets are discovered dynamically so the script survives renames.
const { iosInfoPlistPath: IOS_INFO_PLIST, iosProjectPbxPath: IOS_PROJECT } = resolveIosTargets();

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

function findFileRecursive(dir, filename, depth = 3) {
  if (depth < 0 || !fs.existsSync(dir)) {
    return null;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name === filename) {
      return path.join(dir, entry.name);
    }

    if (entry.isDirectory()) {
      const found = findFileRecursive(path.join(dir, entry.name), filename, depth - 1);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function resolveIosTargets() {
  const iosDir = path.join(ROOT, 'ios');
  if (!fs.existsSync(iosDir)) {
    return {
      iosInfoPlistPath: null,
      iosProjectPbxPath: null,
    };
  }

  const entries = fs.readdirSync(iosDir, { withFileTypes: true });
  const projectEntry = entries.find(
    (entry) =>
      entry.isDirectory() &&
      entry.name.endsWith('.xcodeproj') &&
      !entry.name.toLowerCase().includes('pod')
  );

  const fallbackInfo = findFileRecursive(iosDir, 'Info.plist');

  if (!projectEntry) {
    return {
      iosInfoPlistPath: fallbackInfo,
      iosProjectPbxPath: null,
    };
  }

  const projectName = projectEntry.name.replace(/\.xcodeproj$/, '');
  let infoPlistPath = path.join(iosDir, projectName, 'Info.plist');
  if (!fs.existsSync(infoPlistPath)) {
    const supportingPath = path.join(iosDir, projectName, 'Supporting', 'Info.plist');
    if (fs.existsSync(supportingPath)) {
      infoPlistPath = supportingPath;
    } else {
      infoPlistPath = findFileRecursive(path.join(iosDir, projectName), 'Info.plist') || fallbackInfo;
    }
  }

  const projectPbxPath = path.join(iosDir, projectEntry.name, 'project.pbxproj');
  const resolvedInfoPlist =
    infoPlistPath && fs.existsSync(infoPlistPath) ? infoPlistPath : null;
  const resolvedProjectPbx =
    projectPbxPath && fs.existsSync(projectPbxPath) ? projectPbxPath : null;

  return {
    iosInfoPlistPath: resolvedInfoPlist,
    iosProjectPbxPath: resolvedProjectPbx,
  };
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
function updateAppJson(newVersion, options = {}) {
  const { incrementBuilds = true, androidVersionCode } = options;
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

  if (androidVersionCode !== undefined && app.expo.android) {
    app.expo.android.versionCode = androidVersionCode;
  }

  fs.writeFileSync(APP_JSON, JSON.stringify(app, null, 2) + '\n');
  return {
    iosBuild: app.expo.ios?.buildNumber,
    androidVersion: app.expo.android?.versionCode,
    iosVersion: newVersion,
  };
}

function updateIosInfoPlist(newVersion) {
  if (!IOS_INFO_PLIST) {
    console.warn('⚠️  iOS Info.plist not found, skipping iOS version sync');
    return false;
  }

  const content = readFileSafe(IOS_INFO_PLIST);
  if (!content) {
    console.warn(`⚠️  ${IOS_INFO_PLIST} not found, skipping iOS version sync`);
    return false;
  }
  const updated = content.replace(
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)([^<]+)(<\/string>)/,
    `$1${newVersion}$3`
  );
  fs.writeFileSync(IOS_INFO_PLIST, updated);
  return true;
}

function updateIosProjectVersion(newVersion) {
  if (!IOS_PROJECT) {
    console.warn('⚠️  iOS Xcode project file not found, skipping iOS version sync');
    return false;
  }

  const content = readFileSafe(IOS_PROJECT);
  if (!content) {
    console.warn(`⚠️  ${IOS_PROJECT} not found, skipping iOS version sync`);
    return false;
  }
  const updated = content.replace(/(MARKETING_VERSION = )[\d.]+;/g, `$1${newVersion};`);
  fs.writeFileSync(IOS_PROJECT, updated);
  return true;
}

function readAndroidGradle() {
  const content = readFileSafe(ANDROID_BUILD_GRADLE);
  if (!content) return null;
  return content;
}

function getAndroidGradleVersions(content) {
  const codeMatch = content.match(/versionCode\s+(\d+)/);
  const nameMatch = content.match(/versionName\s+"([^"]+)"/);
  return {
    versionCode: codeMatch ? parseInt(codeMatch[1], 10) : null,
    versionName: nameMatch ? nameMatch[1] : null,
  };
}

function updateAndroidGradle(newVersion, newVersionCode) {
  const content = readFileSafe(ANDROID_BUILD_GRADLE);
  if (!content) throw new Error('android/app/build.gradle not found');

  const hasCode = /versionCode\s+\d+/.test(content);
  const hasName = /versionName\s+"[^"]+"/.test(content);

  if (!hasCode || !hasName) {
    throw new Error('Could not find versionCode/versionName in android/app/build.gradle');
  }

  let updated = content.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
  updated = updated.replace(/versionName\s+"[^"]+"/, `versionName "${newVersion}"`);

  fs.writeFileSync(ANDROID_BUILD_GRADLE, updated);
  return {
    versionCode: newVersionCode,
    versionName: newVersion,
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
  const androidGradle = readAndroidGradle();
  const gradleVersions = androidGradle ? getAndroidGradleVersions(androidGradle) : null;
  const currentAndroidVersion = gradleVersions?.versionCode ?? app.expo.android?.versionCode ?? 'N/A';
  const currentAndroidName = gradleVersions?.versionName ?? app.expo.android?.versionName ?? 'N/A';

  console.log(`${colors.blue}Current version:${colors.reset} ${currentVersion}`);
  console.log(`${colors.blue}iOS build:${colors.reset} ${currentIosBuild}`);
  console.log(`${colors.blue}Android versionCode (Gradle):${colors.reset} ${currentAndroidVersion}`);
  console.log(`${colors.blue}Android versionName (Gradle):${colors.reset} ${currentAndroidName}\n`);

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
  const currentAndroidVersionNumber = parseInt(currentAndroidVersion, 10);
  if (isNaN(currentAndroidVersionNumber)) {
    throw new Error('Android versionCode is missing or not a number');
  }
  const newAndroidVersion = currentAndroidVersionNumber + 1;

  console.log('');
  console.log(`${colors.blue}Preview:${colors.reset}`);
  console.log(`  Version:        ${currentVersion} → ${colors.green}${newVersion}${colors.reset}`);
  console.log(`  iOS build:      ${currentIosBuild} → ${colors.green}${newIosBuild}${colors.reset}`);
  console.log(`  Android code:   ${currentAndroidVersion} → ${colors.green}${newAndroidVersion}${colors.reset}`);
  console.log(`  Android name:   ${currentAndroidName} → ${colors.green}${newVersion}${colors.reset}\n`);

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

    const gradleBuilds = updateAndroidGradle(newVersion, newAndroidVersion);
    console.log(`${colors.green}✓${colors.reset} Updated android/app/build.gradle`);
    console.log(`  - versionCode: ${gradleBuilds.versionCode}`);
    console.log(`  - versionName: ${gradleBuilds.versionName}`);

    const builds = updateAppJson(newVersion, { incrementBuilds: true, androidVersionCode: newAndroidVersion });
    console.log(`${colors.green}✓${colors.reset} Updated app.json`);
    console.log(`  - Version: ${newVersion}`);
    console.log(`  - iOS buildNumber: ${builds.iosBuild}`);
    console.log(`  - Android versionCode: ${builds.androidVersion}`);
    if (updateIosInfoPlist(newVersion)) {
      console.log(`${colors.green}✓${colors.reset} Updated ${IOS_INFO_PLIST}`);
    }
    if (updateIosProjectVersion(newVersion)) {
      console.log(`${colors.green}✓${colors.reset} Updated ${IOS_PROJECT}`);
    }

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
