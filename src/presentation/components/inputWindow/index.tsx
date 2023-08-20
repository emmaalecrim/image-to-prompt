import React, { useEffect, useState } from 'react';
import './index.scss';
import { IImageObject } from '@components/main';
import TopBar from '../topBar';

interface ISelfProps {
  buttonCallback: any;
  isActive: boolean;
}
export default function InputWindow({ buttonCallback, isActive }: ISelfProps) {
  return (
    <div className="input-window">
      <div className="box">
        <TopBar />
        <div className="body">
          <div className="list">
            <div className="row">
              <div className="col right">
                <h2>Image Generator Model Type</h2>
              </div>
              <div className="col left">
                <h2>Dall-E 2</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => (isActive ? buttonCallback() : null)}
        role="button"
        onKeyDown={buttonCallback}
        className="button"
        tabIndex={0}
      >
        <h1>Start</h1>
      </div>
    </div>
  );
}
