import React from 'react';
import './App.css';
import * as Game from './game/gameRunner'

Game.setupGame();

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Duck Pond-ering</h1>
      <div className="centred-content">
        <div id="game-section">
          <div id="game-container" />
        </div>
      </div>
      <p>A pond with some hungry and slightly melancholy ducks. Built for <a className="App-link" href="https://itch.io/jam/untitled-game-jam-37" target="_blank" rel="noopener noreferrer">Untitled Game Jam</a>.</p>
      Instructions for your pond:
      <ul>
        <li>Press on the water to feed the ducks</li>
        <li>Press on the nest for a duck to lay eggs.</li>
        <li>Press on a duck for duck facts.</li>
      </ul>
      <div id="footer">
        Duck Pond-ering 2020 - <a className="App-link" href="https://github.com/RichTeaMan/duck-game" target="_blank" rel="noopener noreferrer">Source Code</a>
      </div>
    </div>
  );
}

export default App;
