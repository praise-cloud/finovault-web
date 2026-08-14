import { z } from 'zod';

const email = z.string().email('A valid email is required.');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Add at least one uppercase letter.')
  .regex(/[a-z]/, 'Add at least one lowercase letter.')
  .regex(/[0-9]/, 'Add at least one number.');

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name.'),
  email,
  password,
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email.').email('A valid email is required.'),
  password: z.string().min(1, 'Enter your password.'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'Enter the 6-digit code.'),
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type OtpValues = z.infer<typeof otpSchema>;

export function passwordStrength(value: string): number {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}