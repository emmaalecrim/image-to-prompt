/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import './index.scss';
import { useDropzone } from 'react-dropzone';

interface ISelfProps {
  callback: (value: Blob) => void;
}
export default function DragDropFile({ callback }: ISelfProps) {
  const [fileState, setFilesState] = useState<any>();
  const handleFile = (file: any[]) => {
    setFilesState(file[0]);
    callback(file[0]);
  };
  const renderPreview = fileState != null && (
    <div className="drag-drop--preview" key={fileState.name}>
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
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
    },
  });

  const renderDropZone = (
    <div
      {...getRootProps()}
      className="drag-drop--window"
      id="form-file-upload"
    >
      <input {...getInputProps()} type="file" id="add-image-dropzone" />
      <div>
        <p className="drap-drop--text paragraph">
          Drag and drop to <ins className="underline">upload</ins>!
        </p>
      </div>
    </div>
  );

  return (
    <div className="drag-drop">
      {fileState ? renderPreview : renderDropZone}
    </div>
  );
}
