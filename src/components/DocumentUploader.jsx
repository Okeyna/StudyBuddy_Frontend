import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/api';
import { useState, useCallback } from 'react';
import { FILE_CONSTRAINTS } from '../utils/constants';

export const DocumentUploader = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);
      setError('');

      try {
        await uploadFile(formData);
        if (onUploadSuccess) {
          await onUploadSuccess();
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: FILE_CONSTRAINTS.MAX_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p className="text-blue-500">Uploading...</p>
      ) : (
        <>
          <p className="text-gray-600">
            Drag & drop a PDF, DOCX, or TXT file here, or click to select
          </p>
          <p className="text-sm text-gray-400 mt-2">Max 20MB</p>
        </>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
