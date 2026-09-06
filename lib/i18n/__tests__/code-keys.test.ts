import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import en from '../en.json';
import fr from '../fr.json';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');

type TranslationTree = Record<string, unknown>;

function flattenKeys(obj: TranslationTree, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? flattenKeys(value as TranslationTree, path)
      : [path];
  });
}

function collectTsxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...collectTsxFiles(full));
    else if (entry.endsWith('.tsx')) files.push(full);
  }
  return files;
}

// ponytail: literal t('...')/t("...") only; template-literal keys (backticks) are dynamic
const LITERAL_KEY_RE = /\bt\((['"])([^'"`]+)\1\)/g;

function collectUsedLiteralKeys(): string[] {
  const keys = new Set<string>();
  for (const dir of ['features', 'app']) {
    for (const file of collectTsxFiles(join(projectRoot, dir))) {
      const src = readFileSync(file, 'utf8');
      for (const match of src.matchAll(LITERAL_KEY_RE)) keys.add(match[2]);
    }
  }
  return [...keys];
}

describe('i18n keys used in code', () => {
  const enKeys = new Set(flattenKeys(en));
  const frKeys = new Set(flattenKeys(fr));

  it('has every literal t() key from features/ and app/ in en.json', () => {
    const missing = collectUsedLiteralKeys().filter((key) => !enKeys.has(key));
    expect(missing).toEqual([]);
  });

  it('has every literal t() key from features/ and app/ in fr.json', () => {
    const missing = collectUsedLiteralKeys().filter((key) => !frKeys.has(key));
    expect(missing).toEqual([]);
  });
});