import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

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
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default TextInput;
