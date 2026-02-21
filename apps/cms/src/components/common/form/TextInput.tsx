import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface TextInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
}

function TextInput<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  maxLength,
  error,
  helperText,
  register,
}: TextInputProps<TFieldValues>) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type="text"
        className={`input ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default TextInput;
