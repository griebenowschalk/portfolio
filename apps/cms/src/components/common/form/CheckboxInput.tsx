import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface CheckboxInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  error?: string;
  register: UseFormRegister<TFieldValues>;
}

function CheckboxInput<TFieldValues extends FieldValues>({
  name,
  label,
  error,
  register,
}: CheckboxInputProps<TFieldValues>) {
  return (
    <div>
      <div className="flex items-center">
        <input {...register(name)} type="checkbox" className="mr-2 w-4 h-4" />
        <label className="text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default CheckboxInput;
