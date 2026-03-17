import React, { useState } from "react";
import { Upload, X, Trash2 } from "lucide-react";

interface FileUploadProps {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  error?: string;
  helperText?: string;
  onChange: (files: File[]) => void;
  currentImageUrl?: string;
  onRemoveCurrent?: () => void;
}

const FileUpload = ({
  name,
  label,
  accept = "image/*",
  multiple = false,
  maxFiles,
  error,
  helperText,
  onChange,
  currentImageUrl,
  onRemoveCurrent,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentRemoved, setCurrentRemoved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const limitedFiles = maxFiles
      ? selectedFiles.slice(0, maxFiles)
      : selectedFiles;
    setFiles(limitedFiles);
    onChange(limitedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const handleRemoveCurrent = () => {
    setCurrentRemoved(true);
    onRemoveCurrent?.();
  };

  const handleUndoRemove = () => {
    setCurrentRemoved(false);
    onRemoveCurrent?.(); // toggles the removed state in parent
  };

  const showCurrentPreview =
    !!currentImageUrl && !currentRemoved && files.length === 0;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Current image preview (edit mode only) */}
      {showCurrentPreview && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted p-2">
          <img
            src={currentImageUrl}
            alt="Current"
            className="h-14 w-14 shrink-0 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">Current image</p>
            <p className="text-xs text-muted-foreground">
              Upload a new file to replace it
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveCurrent}
            title="Remove image"
            className="shrink-0 rounded p-1 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Removed indicator with undo */}
      {currentRemoved && files.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <X className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive flex-1">
            Image will be removed on save
          </p>
          <button
            type="button"
            onClick={handleUndoRemove}
            className="text-xs underline text-muted-foreground hover:text-foreground"
          >
            Undo
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${name}`}
        />
        <label htmlFor={`file-upload-${name}`} className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {showCurrentPreview
              ? `Upload to replace`
              : `Click to upload ${multiple ? "files" : "a file"}`}
          </p>
        </label>
      </div>

      {/* Newly selected files */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 p-2 bg-muted rounded"
            >
              <span className="text-sm text-foreground truncate min-w-0 flex-1">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 text-destructive hover:text-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default FileUpload;
