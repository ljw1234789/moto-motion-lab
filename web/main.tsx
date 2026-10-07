import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import './styles.css';

// Resolve Remotion's public assets against the current Pages subdirectory.
window.remotion_staticBase=new URL('.',document.baseURI).pathname.replace(/\/$/,'');
createRoot(document.getElementById('root')!).render(<App/>);
