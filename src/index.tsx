import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';

const rootElement = document.getElementById('root');
if (rootElement != null) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error(
    "%cERROR: root element id  can't be found at public/index.html",
    'color:red'
  );
}
