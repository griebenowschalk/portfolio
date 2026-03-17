import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface SelectInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  error?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
  value?: string;
}

function SelectInput<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  options,
  error,
  helperText,
  register,
  value,
}: SelectInputProps<TFieldValues>) {
  const { onChange, onBlur, ref } = register(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={value ?? ""}
        onValueChange={(val) =>
          onChange({
            target: { name, value: val },
          } as unknown as React.ChangeEvent<HTMLSelectElement>)
        }
      >
        <SelectTrigger
          id={name}
          ref={ref}
          onBlur={onBlur}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default SelectInput;
