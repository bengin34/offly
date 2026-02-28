import fs from 'fs';
import path from 'path';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function flattenValues(obj: JsonObject, prefix = '', out: Record<string, string> = {}): Record<string, string> {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenValues(value as JsonObject, fullKey, out);
    } else if (typeof value === 'string') {
      out[fullKey] = value;
    }
  }
  return out;
}

function extractTokens(value: string): string[] {
  const matches = value.match(/\{\w+\}/g) ?? [];
  return [...new Set(matches)].sort();
}

describe('localization placeholder contract', () => {
  const localizationDir = path.join(process.cwd(), 'src', 'localization');
  const en = JSON.parse(
    fs.readFileSync(path.join(localizationDir, 'en.json'), 'utf8')
  ) as JsonObject;
  const enMap = flattenValues(en);

  const localeFiles = fs
    .readdirSync(localizationDir)
    .filter((file) => file.endsWith('.json') && file !== 'en.json');

  it('keeps interpolation tokens consistent with en.json', () => {
    const violations: string[] = [];

    for (const file of localeFiles) {
      const locale = JSON.parse(
        fs.readFileSync(path.join(localizationDir, file), 'utf8')
      ) as JsonObject;
      const localeMap = flattenValues(locale);

      for (const [key, enText] of Object.entries(enMap)) {
        const enTokens = extractTokens(enText);
        if (enTokens.length === 0) continue;

        const localeText = localeMap[key];
        if (localeText === undefined) continue;

        const localeTokens = extractTokens(localeText);
        if (enTokens.join(',') !== localeTokens.join(',')) {
          violations.push(
            `${file}:${key} expected tokens [${enTokens.join(', ')}] got [${localeTokens.join(', ')}]`
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
