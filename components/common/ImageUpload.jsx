import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ImageUpload = ({
  onUpload,
  isUploading = false,
  maxFiles = 1,
  maxSize = 5242880, // 5MB
  accept = 'image/*',
  className = ''
}) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  }, [maxFiles, maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [accept]: []
    },
    maxFiles,
    maxSize,
    disabled: isUploading
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors duration-200
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isUploading ? (
            <p className="text-sm text-gray-500">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-gray-500">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
              >
                Choose Files
              </Button>
              <p className="text-sm text-gray-500">
                or drag and drop
                {maxFiles > 1 ? ` up to ${maxFiles} files` : ''}
              </p>
              <p className="text-xs text-gray-400">
                Maximum file size: 5MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;