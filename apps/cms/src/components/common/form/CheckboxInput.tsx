import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";

interface CheckboxInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  error?: string;
  register: UseFormRegister<TFieldValues>;
  checked?: boolean;
}

function CheckboxInput<TFieldValues extends FieldValues>({
  name,
  label,
  error,
  register,
  checked,
}: CheckboxInputProps<TFieldValues>) {
  const { onChange, onBlur, ref } = register(name);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id={name}
          ref={ref}
          checked={checked ?? false}
          onBlur={onBlur}
          onCheckedChange={(val) =>
            onChange({
              target: { name, value: val },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Label htmlFor={name} className="font-normal cursor-pointer">
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default CheckboxInput;
