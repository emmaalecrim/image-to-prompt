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
      <div className="description">
        <p>Image Generator Tester.</p>
        <p>Generate diffusion images and more!</p>
      </div>
    </div>
  );
}
