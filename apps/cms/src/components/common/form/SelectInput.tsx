import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
}

function SelectInput<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  options,
  error,
  helperText,
  register,
}: SelectInputProps<TFieldValues>) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className={`input ${error ? "border-red-500" : ""}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default SelectInput;
