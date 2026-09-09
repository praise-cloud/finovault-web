import { describe, expect, it } from 'vitest';
import { snakeToCamel } from '../helpers';

describe('snakeToCamel', () => {
  it('converts flat snake_case keys to camelCase', () => {
    expect(snakeToCamel({ user_name: 'A', created_at: '2024-01-01' })).toEqual({
      userName: 'A',
      createdAt: '2024-01-01',
    });
  });

  it('recursively converts nested object keys', () => {
    const input = {
      user_profile: {
      full_name: 'B',
      address_info: {
        postal_code: '12345',
      },
    },
  };
    const result = snakeToCamel(input);
    expect(result).toEqual({
      userProfile: {
        fullName: 'B',
        addressInfo: {
          postalCode: '12345',
        },
      },
    });
  });

  it('converts keys inside arrays of objects', () => {
    const input = [
      { goal_id: 1, target_amount: 100 },
      { goal_id: 2, target_amount: 200 },
    ];
    expect(snakeToCamel(input)).toEqual([
      { goalId: 1, targetAmount: 100 },
      { goalId: 2, targetAmount: 200 },
    ]);
  });

  it('leaves already-camelCase keys untouched', () => {
    const input = { alreadyGood: 1, snake_case: 2 };
    expect(snakeToCamel(input)).toEqual({ alreadyGood: 1, snakeCase: 2 });
  });

  it('passes through null unchanged', () => {
    expect(snakeToCamel(null)).toBeNull();
  });

  it('passes through undefined unchanged', () => {
    expect(snakeToCamel(undefined)).toBeUndefined();
  });

  it('passes through primitives unchanged', () => {
    expect(snakeToCamel(42)).toBe(42);
    expect(snakeToCamel('hello')).toBe('hello');
    expect(snakeToCamel(true)).toBe(true);
  });

  it('handles empty object', () => {
    expect(snakeToCamel({})).toEqual({});
  });

  it('handles empty array', () => {
    expect(snakeToCamel([])).toEqual([]);
  });
});
