import React from 'react';
import Main from '@components/main';
import TopBar from '@components/topBar';
import '@assets/fonts/PressStart2P-Regular.ttf';
import '@sass/main.scss';
import './App.scss';

export default function App() {
  return (
    <div>
      <TopBar />
      <Main />
    </div>
  );
}
