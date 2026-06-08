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

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  location: z.string().trim().max(120, 'Location must be 120 characters or less.'),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Old password must be at least 6 characters long.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long.'),
    confirmPassword: z.string().min(6, 'Confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete your account.'),
});

export type ForgotFormData = z.infer<typeof forgotPassSchema>;
export type ConfirmFormData = z.infer<typeof resetPassSchema>;
export type VerifyFormData = z.infer<typeof verificationSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
