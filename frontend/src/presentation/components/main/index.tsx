import React, { useEffect, useState } from 'react';
import DragDropFile from '@components/dragDropFile';
import InputWindow from '@components/inputWindow';
import LoadingWindow from '@components/loadWindow';
import './index.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { ESteps, apiUrl } from './constant';
import ResultList from '../resultList';

export interface IImageObject {
  image?: Blob;
  IGM?: string;
}

const addGeneration = async (data: FormData) =>
  axios.post(`${apiUrl}add-generation`, data);
const iterateGeneration = async (
  prompt: string,
  id: string,
  generation: string
) =>
  axios.post(
    `${apiUrl}iterate-generation`,
    { prompt, id, generation },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
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
    if (!imageObject.image) {
      setCurrentStep(ESteps.START);
      return;
    }
    const formData = new FormData();
    formData.append('file', imageObject.image);
    await addGeneration(formData).then((response) => {
      console.log('response: ', response);
      setCurrentStep(ESteps.OUTPUT);
    });
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
  const renderResultList = <ResultList originalImage={imageObject.image!} />;
  return (
    <div className="main">
      {currentStep === ESteps.START && renderStart}
      {currentStep === ESteps.LOAD && renderLoad}
      {currentStep === ESteps.OUTPUT && renderResultList}
    </div>
  );
}
