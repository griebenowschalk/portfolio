import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";

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
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type="number"
        {...register(name, { valueAsNumber: true })}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={cn(error ? "border-destructive" : "")}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default NumberInput;
