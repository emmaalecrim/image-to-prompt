/* eslint-disable no-underscore-dangle */
import React from 'react';
import TopBar from '../topBar';
import './index.scss';
import { IResultListData } from '../main';

const dummyData = [
  {
    id: 0,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png',
    distance: 23.789,
    generation: 1,
  },
  {
    id: 1,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png',
    distance: 543.123,
    generation: 1,
  },
  {
    id: 2,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png',
    distance: 235.345,
    generation: 1,
  },
  {
    id: 3,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png',
    distance: 235.679,
    generation: 1,
  },
];
interface ISelfProps {
  resultListData: IResultListData[];
}

export default function ResultList({ resultListData }: ISelfProps) {
  const currentImage = sessionStorage.getItem('image');
  const renderList = resultListData.map((item) => {
    return (
      <div className="row">
        <img src={item.url} alt="image" />
        <div className="details">
          <TopBar />
          <div className="row box">
            <div className="col">
              <p className="name">Distance</p>
              <p className="value">{item._additional.distance}</p>
            </div>
            <div className="col">
              <p className="name">Generation</p>
              <p className="value">{item.generation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="resultList">
      <div className="resultList--originalImage">
        <h1>Original Image</h1>
        <img alt="image" src={currentImage as string} />
      </div>
      <h1 className="resultList--generated-images-title">Generated Images</h1>
      {renderList}
    </div>
  );
}
