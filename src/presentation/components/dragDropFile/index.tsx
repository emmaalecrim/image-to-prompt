/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import './index.scss';
import { useDropzone } from 'react-dropzone';

export default function DragDropFile() {
  const [fileState, setFilesState] = useState<any>();
  const handleFile = (file: any[]) => {
    setFilesState(file[0]);
  };
  const thumbs = fileState != null && (
    <div key={fileState.name}>
      <div>
        <img
          alt="image"
          src={fileState.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(fileState.preview);
          }}
        />
      </div>
    </div>
  );

  const { getInputProps, getRootProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      handleFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    multiple: true,
    noClick: false,
  });
  return (
    <div>
      <div
        {...getRootProps()}
        id="form-file-upload"
        className="drag-drop-window"
      >
        <input {...getInputProps()} type="file" id="add-image-dropzone" />
        <div>
          <p className="paragraph">Drag and drop your file here or</p>
        </div>
      </div>
      {thumbs}
    </div>
  );
}
