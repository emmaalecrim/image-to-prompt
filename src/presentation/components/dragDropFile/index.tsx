import React from 'react';
import './index.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDropzone } from 'react-dropzone';

export default function DragDropFile() {
  // triggers when file is selected with click
  const handleChange = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      // at least one file has been selected so do something
      // handleFiles(e.target.files);
    }
  };

  const { getInputProps, getRootProps } = useDropzone<>({
    multiple: true,
    noClick: false,
  });
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...getRootProps()} id="form-file-upload" className="drag-drop-window">
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps()}
        type="file"
        id="add-image-dropzone"
      />
      <div>
        <p className="paragraph">Drag and drop your file here or</p>
      </div>
    </div>
  );
}
