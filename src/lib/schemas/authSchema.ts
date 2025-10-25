import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name is too short.'),
    lastName: z.string().min(2, 'Last name is too short.'),
    email: z.string().email('Enter a valid email address.'),
    phone: z.string().min(11, 'Enter a valid phone number.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z.string().min(6, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type SigninFormData = z.infer<typeof signinSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AuthFormData = SigninFormData | SignupFormData;
