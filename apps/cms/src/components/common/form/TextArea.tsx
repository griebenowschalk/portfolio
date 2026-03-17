import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { cn } from "../../../lib/utils";

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
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(error ? "border-destructive" : "")}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default TextArea;
