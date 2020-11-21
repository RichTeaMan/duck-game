import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Game from './game/gameRunner'

Game.setupGame();

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div id="game-container"/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

      </header>
        Learn <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a> and <a className="App-link" href="https://phaser.io/" target="_blank" rel="noopener noreferrer">Phaser</a>
    </div>
  );
}

export default App;
