'use client';

import { cn } from '@/utils/cn';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<TFormValues extends FieldValues> {
  label: string;
  id: Path<TFormValues>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register?: UseFormRegister<TFormValues>;
  errors?: FieldErrors<TFormValues>;
}

function FormField<TFormValues extends FieldValues>({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  register,
  errors,
}: InputProps<TFormValues>) {
  const errorMessage = errors?.[id]?.message as string | undefined;

  return (
    <div className="mb-4">
      <label htmlFor={id as string} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id as string}
        type={type}
        placeholder={placeholder}
        required={required}
        {...(register ? register(id) : {})}
        className={cn(
          'focus:ring-primary h-[50px] w-full rounded-sm border border-neutral-200 px-3 text-sm shadow-2xs outline-none focus:border-transparent focus:ring-2',
          errorMessage && 'border-destructive focus:ring-destructive',
        )}
      />
      {errorMessage && <p className="text-destructive mt-1 text-xs">{errorMessage}</p>}
    </div>
  );
}

export default FormField;
