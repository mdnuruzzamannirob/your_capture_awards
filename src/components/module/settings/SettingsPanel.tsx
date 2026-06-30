'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
  ChangePasswordFormData,
  DeleteAccountFormData,
  UpdateProfileFormData,
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from '@/lib/schemas/userSchema';
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateUserMutation,
} from '@/store/apis/userApi';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/utils/logout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, Path, UseFormRegister, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const inputFieldClassName =
  'h-11 rounded-md border-border bg-surface-secondary/80 px-4 text-sm text-foreground placeholder:text-placeholder-foreground shadow-none focus-visible:border-primary focus-visible:ring-0';

const cardClassName = 'rounded-2xl border border-border bg-surface/90 p-5 md:p-6';

function getErrorMessage(error: unknown) {
  const err = error as {
    data?: {
      message?: string;
      errorSources?: Array<{ details?: string }>;
    };
    message?: string;
  };

  return (
    err?.data?.message ||
    err?.data?.errorSources?.[0]?.details ||
    err?.message ||
    'Something went wrong.'
  );
}

function SettingsSkeleton() {
  return (
    <section className="margin container py-8">
      <div className="flex gap-3">
        <Skeleton className="bg-surface-secondary h-12 w-32 rounded-md" />
        <Skeleton className="bg-surface-secondary h-12 w-32 rounded-md" />
        <Skeleton className="bg-surface-secondary h-12 w-40 rounded-md" />
      </div>

      <div className="border-border bg-surface/90 mt-8 rounded-2xl border p-5 md:p-6">
        <Skeleton className="bg-surface-secondary h-6 w-28 rounded-md" />
        <Skeleton className="bg-surface-secondary mt-3 h-4 w-96 max-w-full rounded-md" />
        <Skeleton className="bg-surface-secondary mt-8 h-11 w-full rounded-md" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Skeleton className="bg-surface-secondary h-11 w-full rounded-md" />
          <Skeleton className="bg-surface-secondary h-11 w-full rounded-md" />
        </div>
        <Skeleton className="bg-surface-secondary mt-4 h-11 w-full rounded-md" />
        <div className="mt-8 flex justify-end">
          <Skeleton className="bg-surface-secondary h-11 w-40 rounded-md" />
        </div>
      </div>
    </section>
  );
}

function PasswordField<TFieldValues extends FieldValues>({
  label,
  error,
  show,
  onToggle,
  register,
  name,
  placeholder,
  autoComplete,
  disabled,
}: {
  label: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  register: UseFormRegister<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Input
          id={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${inputFieldClassName} pr-11`}
          {...register(name)}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggle}
          disabled={disabled}
          className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Toggle ${label.toLowerCase()}`}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}

const SettingsPanel = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [updateUser, { isLoading: isProfileSaving }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isPasswordSaving }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleteLoading }] = useDeleteAccountMutation();

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { firstName: '', lastName: '', location: '' },
  });

  const securityForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const deleteForm = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      location: user.location ?? '',
    });
  }, [profileForm, user]);

  useEffect(() => {
    if (!mounted) return;
    if (isLoading) return;
    if (isAuthenticated) return;
    router.replace('/signin');
  }, [isAuthenticated, isLoading, mounted, router]);

  const onProfileSubmit = async (data: UpdateProfileFormData) => {
    try {
      const response = await updateUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        location: data.location.trim(),
      }).unwrap();

      toast.success(response.message || 'Profile updated successfully.');
    } catch (error) {
      toast.error('Unable to update your profile.', {
        description: getErrorMessage(error),
      });
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      const response = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success(response.message || 'Password changed successfully.');
      securityForm.reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error('Unable to change password.', {
        description: getErrorMessage(error),
      });
    }
  };

  const onDeleteSubmit = async (data: DeleteAccountFormData) => {
    const confirmed = window.confirm(
      'This action will permanently delete your account and cannot be undone. Continue?',
    );

    if (!confirmed) return;

    try {
      const response = await deleteAccount({
        password: data.password,
      }).unwrap();

      toast.success(response.message || 'Account deleted successfully.');
      logout(dispatch);
      router.replace('/signin');
    } catch (error) {
      toast.error('Unable to delete your account.', {
        description: getErrorMessage(error),
      });
    }
  };

  if (!mounted || (isLoading && !user)) {
    return <SettingsSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <section className="margin container py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="inline-flex h-auto gap-3 bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="border-border bg-surface-secondary data-[state=active]:border-primary data-[state=active]:bg-primary h-12 rounded-md border px-10 text-foreground transition-colors data-[state=active]:text-primary-foreground"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="border-border bg-surface-secondary data-[state=active]:border-primary data-[state=active]:bg-primary h-12 rounded-md border px-10 text-foreground transition-colors data-[state=active]:text-primary-foreground"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="delete"
            className="border-border bg-surface-secondary data-[state=active]:border-primary data-[state=active]:bg-primary h-12 rounded-md border px-10 text-foreground transition-colors data-[state=active]:text-primary-foreground"
          >
            Delete Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-8">
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className={cardClassName}>
              <div className="mb-5 space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Update the name and location visible on your account.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className={inputFieldClassName}
                    {...profileForm.register('firstName')}
                    disabled={isProfileSaving}
                  />
                  {profileForm.formState.errors.firstName ? (
                    <p className="text-destructive text-xs">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className={inputFieldClassName}
                    {...profileForm.register('lastName')}
                    disabled={isProfileSaving}
                  />
                  {profileForm.formState.errors.lastName ? (
                    <p className="text-destructive text-xs">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-foreground">
                  Location
                </label>
                <Input
                  id="location"
                  placeholder="Enter your location"
                  className={inputFieldClassName}
                  {...profileForm.register('location')}
                  disabled={isProfileSaving}
                />
                {profileForm.formState.errors.location ? (
                  <p className="text-destructive text-xs">
                    {profileForm.formState.errors.location.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isProfileSaving}
                  className="border-primary bg-primary hover:bg-primary/90 h-11 rounded-md border px-8 text-primary-foreground"
                >
                  {isProfileSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security" className="mt-8">
          <form onSubmit={securityForm.handleSubmit(onPasswordSubmit)}>
            <div className={cardClassName}>
              <div className="mb-5 space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Use a new password that is hard to guess and unique to this account.
                </p>
              </div>

              <div className="space-y-4">
                <PasswordField
                  label="Current password"
                  error={securityForm.formState.errors.oldPassword?.message}
                  show={showOldPassword}
                  onToggle={() => setShowOldPassword((prev) => !prev)}
                  register={securityForm.register}
                  name="oldPassword"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  disabled={isPasswordSaving}
                />

                <PasswordField
                  label="New password"
                  error={securityForm.formState.errors.newPassword?.message}
                  show={showNewPassword}
                  onToggle={() => setShowNewPassword((prev) => !prev)}
                  register={securityForm.register}
                  name="newPassword"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={isPasswordSaving}
                />

                <PasswordField
                  label="Confirm password"
                  error={securityForm.formState.errors.confirmPassword?.message}
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  register={securityForm.register}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={isPasswordSaving}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPasswordSaving}
                  className="border-primary bg-primary hover:bg-primary/90 h-11 rounded-md border px-8 text-background"
                >
                  {isPasswordSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Change password'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="delete" className="mt-8">
          <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)}>
            <div className={cardClassName}>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This removes your profile, access, and all account-owned data that the backend
                  deletes with your account.
                </p>
              </div>

              <div className="border-border bg-surface-tertiary/50 rounded-2xl border p-4 text-sm text-muted-foreground">
                <p>Before continuing, remember that account deletion is permanent.</p>
                <p className="mt-2">
                  You will need to create a new account if you want to return later.
                </p>
                <p className="mt-2">Enter your password below to confirm the request.</p>
              </div>

              <div className="mt-4">
                <PasswordField
                  label="Password"
                  error={deleteForm.formState.errors.password?.message}
                  show={showDeletePassword}
                  onToggle={() => setShowDeletePassword((prev) => !prev)}
                  register={deleteForm.register}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isDeleteLoading}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isDeleteLoading}
                  variant="destructive"
                  className="h-11 rounded-md border border-destructive bg-destructive px-8 text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleteLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete account'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SettingsPanel;
