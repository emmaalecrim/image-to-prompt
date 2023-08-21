import React from 'react';
import './index.scss';
import TopBar from '../topBar';

export default function Header() {
  return (
    <div className="header">
      <TopBar />
      <div className="logo-box">
        <h1 className="name">iGT</h1>
      </div>
      <p className="description">
        Image Generator Tester. Generate diffusion images and more!{' '}
      </p>
    </div>
  );
}
