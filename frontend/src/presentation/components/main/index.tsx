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

export interface IResultListData {
  generation: number;
  _additional: {
    certainty: number;
    distance: number;
  };
  description: string;
  url: string;
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
    { headers: { 'Content-Type': 'application/json' } }
  );
export default function Main() {
  const [imageObject, setImageObject] = useState<IImageObject>({
    IGM: 'DALL-E-2',
  });
  const [currentStep, setCurrentStep] = useState<ESteps>(ESteps.START);
  const [resultListData, setResultListData] = useState<IResultListData[]>([]);
  const [isActiveButton, setIsActiveButton] = useState<boolean>(false);
  const useSetImageValue = (value: Blob) => {
    if (value) {
      console.log('setting value:', value);
      console.trace();
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
      if ((response.status = 200)) {
        const { data } = response;
        sessionStorage.setItem('image', data.url);
        iterateGeneration(data.prompt, data.id, 1).then(
          (iterateGenerationResponse) => {
            console.log('response:', iterateGenerationResponse);
            setResultListData(iterateGenerationResponse.data);
            setCurrentStep(ESteps.OUTPUT);
          }
        );
      } else {
        setCurrentStep(ESteps.START);
      }
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
  const renderResultList = <ResultList resultListData={resultListData!} />;
  return (
    <div className="main">
      {currentStep === ESteps.START && renderStart}
      {currentStep === ESteps.LOAD && renderLoad}
      {currentStep === ESteps.OUTPUT && renderResultList}
    </div>
  );
}
