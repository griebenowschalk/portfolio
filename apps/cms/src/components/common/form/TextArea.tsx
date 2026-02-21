import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface TextAreaProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
}

function TextArea<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  rows = 3,
  maxLength,
  error,
  helperText,
  register,
}: TextAreaProps<TFieldValues>) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...register(name)}
        className={`input ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default TextArea;
