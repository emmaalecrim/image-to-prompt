import React from 'react';
import Main from '@components/main';
import Header from './components/header';
import '@assets/fonts/PressStart2P-Regular.ttf';
import '@sass/main.scss';
import './App.scss';

export default function App() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}
