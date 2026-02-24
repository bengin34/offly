import fs from 'fs';
import path from 'path';

const metadataRoot = path.join(process.cwd(), 'fastlane', 'metadata');
const locales = fs
  .readdirSync(metadataRoot)
  .filter((entry) => fs.statSync(path.join(metadataRoot, entry)).isDirectory())
  .sort();

const requiredFiles = [
  'name.txt',
  'subtitle.txt',
  'keywords.txt',
  'promotional_text.txt',
  'description.txt',
  'release_notes.txt',
  'privacy_url.txt',
  'support_url.txt',
];

const charLimits: Record<string, number> = {
  'name.txt': 30,
  'subtitle.txt': 30,
  'keywords.txt': 100,
  'promotional_text.txt': 170,
  'description.txt': 4000,
  'release_notes.txt': 4000,
};

function read(locale: string, file: string): string {
  return fs.readFileSync(path.join(metadataRoot, locale, file), 'utf8').trim();
}

describe('App Store metadata quality gates', () => {
  it('has all required files per locale', () => {
    const missing: string[] = [];

    for (const locale of locales) {
      for (const file of requiredFiles) {
        const target = path.join(metadataRoot, locale, file);
        if (!fs.existsSync(target)) missing.push(`${locale}/${file}`);
      }
    }

    expect(missing).toEqual([]);
  });

  it('respects Apple character limits for metadata fields', () => {
    const violations: string[] = [];

    for (const locale of locales) {
      for (const [file, limit] of Object.entries(charLimits)) {
        const value = read(locale, file);
        const charCount = [...value].length;
        if (charCount > limit) {
          violations.push(`${locale}/${file}: ${charCount}/${limit}`);
        }
        if (file === 'keywords.txt') {
          const byteCount = Buffer.byteLength(value, 'utf8');
          if (byteCount > 100) {
            violations.push(`${locale}/${file}: ${byteCount}/100 bytes`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('uses Offly URLs for privacy and support links', () => {
    const violations: string[] = [];

    for (const locale of locales) {
      const privacyUrl = read(locale, 'privacy_url.txt');
      const supportUrl = read(locale, 'support_url.txt');

      if (!privacyUrl.startsWith('https://qrodesk.com/offly/')) {
        violations.push(`${locale}/privacy_url.txt -> ${privacyUrl}`);
      }
      if (!supportUrl.startsWith('https://qrodesk.com/offly/')) {
        violations.push(`${locale}/support_url.txt -> ${supportUrl}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('keeps keyword fields comma-separated and duplicate-free', () => {
    const violations: string[] = [];

    for (const locale of locales) {
      const raw = read(locale, 'keywords.txt');
      const terms = raw.split(',').map((t) => t.trim()).filter(Boolean);
      const normalized = terms.map((t) => t.toLocaleLowerCase());

      if (/,\\s/.test(raw)) {
        violations.push(`${locale}/keywords.txt contains spaces after commas`);
      }

      const dup = normalized.filter((value, index) => normalized.indexOf(value) !== index);
      if (dup.length > 0) {
        violations.push(`${locale}/keywords.txt duplicate terms: ${[...new Set(dup)].join(',')}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
