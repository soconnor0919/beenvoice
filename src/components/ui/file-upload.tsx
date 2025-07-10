"use client";

import * as React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "~/lib/utils";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./button";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  status?: "success" | "error" | "pending";
  error?: string;
}

function FilePreview({ file, onRemove, status = "pending", error }: FilePreviewProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      getStatusColor()
    )}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function FileUpload({
  onFilesSelected,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  disabled = false,
  placeholder = "Drag & drop files here, or click to select",
  description
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle accepted files
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesSelected(newFiles);

    // Handle rejected files
    const newErrors: Record<string, string> = { ...errors };
    rejectedFiles.forEach(({ file, errors }) => {
      const errorMessage = errors.map((e: any) => {
        if (e.code === 'file-too-large') {
          return `File is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
        }
        if (e.code === 'file-invalid-type') {
          return 'File type not supported';
        }
        if (e.code === 'too-many-files') {
          return `Too many files. Max is ${maxFiles}`;
        }
        return e.message;
      }).join(', ');
      newErrors[file.name] = errorMessage;
    });
    setErrors(newErrors);
  }, [files, onFilesSelected, errors, maxFiles, maxSize]);

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    onFilesSelected(newFiles);
    
    const newErrors = { ...errors };
    delete newErrors[fileToRemove.name];
    setErrors(newErrors);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    disabled
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          "hover:border-emerald-400 hover:bg-emerald-50/50",
          isDragActive && "border-emerald-400 bg-emerald-50/50",
          isDragReject && "border-red-400 bg-red-50/50",
          disabled && "opacity-50 cursor-not-allowed",
          "bg-white/80 backdrop-blur-sm"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-3 rounded-full transition-colors",
            isDragActive ? "bg-emerald-100" : "bg-gray-100",
            isDragReject && "bg-red-100"
          )}>
            <Upload className={cn(
              "h-6 w-6 transition-colors",
              isDragActive ? "text-emerald-600" : "text-gray-400",
              isDragReject && "text-red-600"
            )} />
          </div>
          <div className="space-y-2">
            <p className={cn(
              "text-lg font-medium transition-colors",
              isDragActive ? "text-emerald-600" : "text-gray-900",
              isDragReject && "text-red-600"
            )}>
              {isDragActive 
                ? isDragReject 
                  ? "File type not supported" 
                  : "Drop files here"
                : placeholder
              }
            </p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            <p className="text-xs text-gray-400">
              Max {maxFiles} file{maxFiles !== 1 ? 's' : ''} • {(maxSize / 1024 / 1024).toFixed(1)}MB each
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(file)}
                status={errors[file.name] ? "error" : "success"}
                error={errors[file.name]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Upload Errors</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([fileName, error]) => (
              <li key={fileName} className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span><strong>{fileName}:</strong> {error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 