import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface DateInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
}

function DateInput<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  error,
  helperText,
  register,
}: DateInputProps<TFieldValues>) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type="date"
        className={`input ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default DateInput;
