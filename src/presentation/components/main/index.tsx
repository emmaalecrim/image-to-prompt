import React, { useEffect, useState } from 'react';
import DragDropFile from '@components/dragDropFile';
import InputWindow from '@components/inputWindow';
import LoadingWindow from '@components/loadWindow';
import startIGMProcess from '@useCases/startIGMProcess';
import './index.scss';
import ESteps from './constant';
import ResultList from '../resultList';

export interface IImageObject {
  image?: Blob;
  IGM?: string;
}
export default function Main() {
  const [imageObject, setImageObject] = useState<IImageObject>({
    IGM: 'DALL-E-2',
  });
  const [currentStep, setCurrentStep] = useState<ESteps>(ESteps.START);
  const [isActiveButton, setIsActiveButton] = useState<boolean>(false);
  const useSetImageValue = (value: Blob) => {
    if (value) {
      setImageObject({
        ...imageObject,
        image: value,
      });
    }
  };
  const startCallback = async () => {
    setCurrentStep(ESteps.LOAD);
    await setTimeout(() => {
      setCurrentStep(ESteps.OUTPUT);
      return true;
    }, 5000);
  };

  useEffect(() => {
    if (imageObject?.image && imageObject.IGM) {
      setIsActiveButton(true);
    } else {
      setIsActiveButton(false);
    }
  }, [imageObject]);

  useEffect(() => {}, [isActiveButton]);
  const renderStart = (
    <>
      <DragDropFile callback={useSetImageValue} />
      <InputWindow buttonCallback={startCallback} isActive={isActiveButton} />
    </>
  );
  const renderLoad = <LoadingWindow />;
  const renderResultList = <ResultList />;
  return (
    <div className="main">
      {currentStep === ESteps.START && renderStart}
      {currentStep === ESteps.LOAD && renderLoad}
      {currentStep === ESteps.OUTPUT && renderResultList}
    </div>
  );
}
