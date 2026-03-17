import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";

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
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type="date"
        {...register(name)}
        className={cn(error ? "border-destructive" : "")}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default DateInput;
