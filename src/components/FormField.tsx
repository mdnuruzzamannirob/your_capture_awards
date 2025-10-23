'use client';

import { cn } from '@/utils/cn';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<TFormValues extends FieldValues> {
  label: string;
  id: Path<TFormValues>;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register?: UseFormRegister<TFormValues>;
  error?: string;
}

function FormField<TFormValues extends FieldValues>({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  register,
  error,
}: InputProps<TFormValues>) {
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
          'focus:ring-primary h-[50px] w-full rounded-sm border px-3 text-sm shadow-2xs outline-none focus:border-transparent focus:ring-2',
          error && 'border-destructive focus:ring-destructive',
        )}
      />
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  );
}

export default FormField;
