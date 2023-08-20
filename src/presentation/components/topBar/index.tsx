import React from 'react';
import './index.scss';
import { ReactComponent as ItpLogo } from '@images/ItpLogo.svg';

export default function TopBar() {
  return (
    <div className="topBar">
      <div className=" navBar row">
        <div className="topBar-col grow-10">
          <p>hello</p>
        </div>
        <div className="topBar-col">
          <p>hello</p>
        </div>
        <div className="topBar-col">
          <p>hello</p>
        </div>
        <div className="topBar-col">
          <p>hello</p>
        </div>
      </div>
      <div className="logo-box">
        <ItpLogo className="name" />
      </div>
    </div>
  );
}
