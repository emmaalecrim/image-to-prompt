import React from 'react';
import './index.scss';
import { ReactComponent as SquareIcon } from '@images/squareIcon.svg';
import { ReactComponent as XIcon } from '@images/xIcon.svg';
import { ReactComponent as Underline } from '@images/underline.svg';

export default function TopBar() {
  return (
    <div className=" topBar row">
      <div className="topBar-col grow-10" />
      <div className="topBar-col logo">
        <Underline className="underline" />
      </div>
      <div className="topBar-col logo">
        <SquareIcon />
      </div>
      <div className="topBar-col logo">
        <XIcon />
      </div>
    </div>
  );
}
