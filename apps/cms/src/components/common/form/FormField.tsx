import type { FormFieldProps } from "../../../config/types";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
import FileUpload from "./FileUpload";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import TagsInput from "./TagsInput";

function FormField({
  name,
  config,
  register,
  errors,
  value,
  onChange,
}: FormFieldProps) {
  const error = errors[name]?.message as string | undefined;

  // Base props common to all inputs
  const baseProps = {
    name,
    label: config.label,
    required: config.required,
    error,
    helperText: config.helperText,
    className: config.className,
  };

  // Render appropriate field based on type
  switch (config.type) {
    case "text":
    case "url":
      return (
        <TextInput
          {...baseProps}
          placeholder={config.placeholder}
          maxLength={config.maxLength}
          register={register}
        />
      );

    case "textarea":
      return (
        <TextArea
          {...baseProps}
          placeholder={config.placeholder}
          rows={config.rows || 3}
          maxLength={config.maxLength}
          register={register}
        />
      );

    case "select":
      return (
        <SelectInput
          {...baseProps}
          options={config.options}
          register={register}
        />
      );

    case "checkbox":
      return <CheckboxInput {...baseProps} register={register} />;

    case "file":
      return (
        <FileUpload
          {...baseProps}
          accept={config.accept}
          multiple={config.multiple}
          maxFiles={config.maxFiles}
          onChange={onChange as (files: File[]) => void}
        />
      );

    case "date":
      return <DateInput {...baseProps} register={register} />;

    case "number":
      return (
        <NumberInput
          {...baseProps}
          placeholder={config.placeholder}
          min={config.min}
          max={config.max}
          step={config.step}
          register={register}
        />
      );

    case "tags":
      return (
        <TagsInput
          {...baseProps}
          placeholder={config.placeholder}
          suggestions={config.suggestions}
          value={(value as string[]) || []}
          onChange={onChange as (tags: string[]) => void}
        />
      );

    default:
      return null;
  }
}

export default FormField;
