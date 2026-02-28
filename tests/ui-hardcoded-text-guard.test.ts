import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(ROOT, 'app'),
  path.join(ROOT, 'src', 'components'),
];
const FILE_EXTENSIONS = new Set(['.ts', '.tsx']);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (FILE_EXTENSIONS.has(path.extname(full))) {
      out.push(full);
    }
  }
  return out;
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split('\n').length;
}

describe('UI hardcoded text guard', () => {
  const files = TARGET_DIRS.flatMap((dir) => walk(dir));

  it('does not contain direct literal text inside <Text> nodes', () => {
    const violations: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const pattern = /<Text[^>]*>\s*([^<{]*[A-Za-z][^<{]*)\s*<\/Text>/g;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(content)) !== null) {
        const literal = match[1].trim();
        if (!literal) continue;
        if (literal === '1.0.0') continue;
        if (literal === 'PHOTO CREDITS') continue;
        if (literal === 'Some photos used in this app are provided by Freepik.') continue;

        const line = lineNumberAt(content, match.index);
        violations.push(`${path.relative(ROOT, file)}:${line} -> "${literal}"`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('does not use literal string arguments in Alert.alert', () => {
    const violations: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');

      const firstArgPattern = /Alert\.alert\(\s*(['"`])([^'"`]*[A-Za-z][^'"`]*)\1/g;
      let match: RegExpExecArray | null;
      while ((match = firstArgPattern.exec(content)) !== null) {
        if (match[2].includes('${')) continue;
        const line = lineNumberAt(content, match.index);
        violations.push(`${path.relative(ROOT, file)}:${line} first arg -> "${match[2]}"`);
      }

      const secondArgPattern = /Alert\.alert\([^\n,]+,\s*(['"`])([^'"`]*[A-Za-z][^'"`]*)\1/g;
      while ((match = secondArgPattern.exec(content)) !== null) {
        if (match[2].includes('${')) continue;
        const line = lineNumberAt(content, match.index);
        violations.push(`${path.relative(ROOT, file)}:${line} second arg -> "${match[2]}"`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('does not define static screen titles in app router', () => {
    const layoutFile = path.join(ROOT, 'app', '_layout.tsx');
    const content = fs.readFileSync(layoutFile, 'utf8');
    const matches = [...content.matchAll(/title:\s*['"][^'"]+["']/g)].map((m) => m[0]);

    expect(matches).toEqual([]);
  });
});
