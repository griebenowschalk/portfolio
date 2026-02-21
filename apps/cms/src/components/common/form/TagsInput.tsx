import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagsInputProps {
  name: string;
  label: string;
  placeholder?: string;
  suggestions?: string[];
  value: string[];
  error?: string;
  helperText?: string;
  onChange: (tags: string[]) => void;
}

const TagsInput = ({
  label,
  placeholder,
  value,
  error,
  helperText,
  onChange,
}: TagsInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="label">{label}</label>

      <div
        className={`input min-h-[42px] py-1 ${error ? "border-red-500" : ""}`}
      >
        <div className="flex flex-wrap gap-2 mb-1">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-primary-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full border-none focus:ring-0 p-0 text-sm bg-transparent"
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default TagsInput;
