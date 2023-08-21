// React Imports
import React from 'react';
// Component Imports
import Main from '@components/main';
import Header from './components/header';
// Assets Imports
import '@assets/fonts/PressStart2P-Regular.ttf';
import '@sass/main.scss';
import './App.scss';
/**
 *
 *  Constains:
 * - Header: Component present throughout the app, contains app logo
 * - Main: Component responsible for the flow of the entire app
 */
export default function App() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}
