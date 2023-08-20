import React from 'react';
import './index.scss';
import { ReactComponent as ItpLogo } from '@images/ItpLogo.svg';
import TopBar from '../topBar';

export default function Header() {
  return (
    <div className="header">
      <TopBar />
      <div className="logo-box">
        <h1 className="name">iGT</h1>
      </div>
    </div>
  );
}
