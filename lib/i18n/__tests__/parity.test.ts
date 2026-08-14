import en from '../en.json';
import fr from '../fr.json';

type TranslationTree = Record<string, unknown>;

function flattenKeys(obj: TranslationTree, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? flattenKeys(value as TranslationTree, path)
      : [path];
  });
}

describe('i18n translations', () => {
  it('has a French key for every English key', () => {
    const enKeys = flattenKeys(en);
    const frKeys = new Set(flattenKeys(fr));
    const missing = enKeys.filter((key) => !frKeys.has(key));
    expect(missing).toEqual([]);
  });

  it('keeps English as a superset of French', () => {
    const frKeys = flattenKeys(fr);
    const enKeys = new Set(flattenKeys(en));
    const extra = frKeys.filter((key) => !enKeys.has(key));
    expect(extra).toEqual([]);
  });
});