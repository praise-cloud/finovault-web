import { loginSchema, signupSchema, passwordStrength, otpSchema } from '../validation';

describe('signupSchema', () => {
  it('accepts a valid signup', () => {
    const result = signupSchema.safeParse({
      fullName: 'Amina Diallo',
      email: 'amina@example.com',
      password: 'Vault123!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a weak password', () => {
    const result = signupSchema.safeParse({
      fullName: 'Amina Diallo',
      email: 'amina@example.com',
      password: 'weakpass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = signupSchema.safeParse({
      fullName: 'Amina Diallo',
      email: 'not-an-email',
      password: 'Vault123!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a too-short name', () => {
    const result = signupSchema.safeParse({
      fullName: 'A',
      email: 'amina@example.com',
      password: 'Vault123!',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });

  it('rejects an empty email', () => {
    expect(loginSchema.safeParse({ email: '', password: 'x' }).success).toBe(false);
  });
});

describe('otpSchema', () => {
  it('accepts a 6-digit code', () => {
    expect(otpSchema.safeParse({ code: '123456' }).success).toBe(true);
  });

  it('rejects codes that are not 6 digits', () => {
    expect(otpSchema.safeParse({ code: '12345' }).success).toBe(false);
    expect(otpSchema.safeParse({ code: '1234567' }).success).toBe(false);
  });
});

describe('passwordStrength', () => {
  it('scores length, case and variety', () => {
    expect(passwordStrength('short')).toBe(0);
    expect(passwordStrength('longenough')).toBe(1);
    expect(passwordStrength('LongEnough')).toBe(2);
    expect(passwordStrength('LongEnough1')).toBe(3);
    expect(passwordStrength('LongEnough1!')).toBe(4);
  });
});