import React, { useEffect, useState } from 'react';
import DragDropFile from '@components/dragDropFile';
import InputWindow from '@components/inputWindow';
import './index.scss';

export interface IImageObject {
  image?: Blob;
  IGM?: string;
}
export default function Main() {
  const [imageObject, setImageObject] = useState<IImageObject>({
    IGM: 'DALL-E-2',
  });
  const [isActiveButton, setIsActiveButton] = useState<boolean>(false);
  const useSetImageValue = (value: Blob) => {
    if (value) {
      setImageObject({
        ...imageObject,
        image: value,
      });
    }
  };
  const startCallback = () => {
    console.log('startCallback was called');
  };
  useEffect(() => {
    if (imageObject?.image && imageObject.IGM) {
      setIsActiveButton(true);
    } else {
      setIsActiveButton(false);
    }
  }, [imageObject]);

  useEffect(() => {}, [isActiveButton]);
  return (
    <div className="main">
      <DragDropFile callback={useSetImageValue} />
      <InputWindow buttonCallback={startCallback} isActive={isActiveButton} />
    </div>
  );
}
