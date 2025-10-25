import z from 'zod';

export const forgotPassSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

export const resetPassSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z.string().min(6, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const verificationSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  code: z.string().min(6, 'Code must be at least 6 characters long.'),
});

export type ForgotFormData = z.infer<typeof forgotPassSchema>;
export type ConfirmFormData = z.infer<typeof resetPassSchema>;
export type VerifyFormData = z.infer<typeof verificationSchema>;
