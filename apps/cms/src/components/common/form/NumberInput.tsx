import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface NumberInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
}

function NumberInput<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  min,
  max,
  step,
  error,
  helperText,
  register,
}: NumberInputProps<TFieldValues>) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name, { valueAsNumber: true })}
        type="number"
        className={`input ${error ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default NumberInput;