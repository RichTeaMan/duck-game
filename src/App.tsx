import React from 'react';
import './App.css';
import * as Game from './game/gameRunner'

Game.setupGame();

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="centred-content">
        <div id="game-section">
          <div id="game-container" />
        </div>
      </div>
      <div id="footer">
        <a className="App-link" href="https://github.com/RichTeaMan/duck-game" target="_blank" rel="noopener noreferrer">Source Code</a>
      </div>
    </div>
  );
}

export default App;
