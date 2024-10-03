// src/App.js
import React from 'react';
import Canvas from './Components/Canvas'
import Header from './Components/Header'
import Footer from './Components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Canvas />
      <Footer />
    </div>
  );
}

export default App;
