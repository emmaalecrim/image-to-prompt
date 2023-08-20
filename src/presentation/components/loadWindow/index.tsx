import React from 'react';
import Loading from '@assets/images/loadingAnim.gif';
import './index.scss';

export default function LoadingWindow() {
  return (
    <div className="loading">
      <div className="body">
        <img src={Loading} alt="loading..." />
        <h1>loading...</h1>
      </div>
    </div>
  );
}
