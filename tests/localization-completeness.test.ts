import fs from 'fs';
import path from 'path';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function flattenKeys(obj: JsonObject, prefix = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as JsonObject, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

describe('localization completeness', () => {
  const localizationDir = path.join(process.cwd(), 'src', 'localization');
  const en = JSON.parse(
    fs.readFileSync(path.join(localizationDir, 'en.json'), 'utf8')
  ) as JsonObject;
  const enKeys = flattenKeys(en);

  const localeFiles = fs
    .readdirSync(localizationDir)
    .filter((file) => file.endsWith('.json') && file !== 'en.json');

  it('all locale files include every key from en.json', () => {
    const failures: string[] = [];

    for (const file of localeFiles) {
      const localeData = JSON.parse(
        fs.readFileSync(path.join(localizationDir, file), 'utf8')
      ) as JsonObject;
      const localeKeys = new Set(flattenKeys(localeData));
      const missing = enKeys.filter((key) => !localeKeys.has(key));

      if (missing.length > 0) {
        failures.push(`${file}: ${missing.length} missing -> ${missing.join(', ')}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
