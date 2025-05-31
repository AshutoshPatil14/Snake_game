import React, { useCallback } from 'react';
import styled from 'styled-components';
import GameBoard from './components/GameBoard';
import HighScores from './components/HighScores';
import { useGameLogic } from './hooks/useGameLogic';
import { scoreService } from './services/scoreService';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #282c34;
  color: white;
  padding: 20px;
`;

const GameContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #4CAF50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ScoreBoard = styled.div`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const GameOverlay = styled.div`
  position: relative;
`;

const GameMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 1;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

const Controls = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: #888;
`;

const Input = styled.input`
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  background-color: #1a1c20;
  color: white;
  width: 200px;

  &:focus {
    outline: none;
    border-color: #45a049;
  }
`;

const App: React.FC = () => {
  const { snake, food, score, isGameOver, isPaused, resetGame, togglePause } = useGameLogic();
  const [playerName, setPlayerName] = React.useState('');
  const [scoreSubmitted, setScoreSubmitted] = React.useState(false);

  const handleSubmitScore = useCallback(async () => {
    if (score > 0 && !scoreSubmitted) {
      const name = playerName.trim() || 'Anonymous';
      await scoreService.submitScore(score, name);
      setScoreSubmitted(true);
    }
  }, [score, playerName, scoreSubmitted]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
    setScoreSubmitted(false);
    setPlayerName('');
  }, [resetGame]);

  return (
    <AppContainer>
      <GlobalStyles />
      <Title>Snake Game</Title>
      
      <GameContainer>
        <div>
          <ScoreBoard>Score: {score}</ScoreBoard>
          
          <GameOverlay>
            <GameBoard snake={snake} food={food} />
            {(isGameOver || isPaused) && (
              <GameMessage>
                {isGameOver ? (
                  <>
                    <h2>Game Over!</h2>
                    <p>Final Score: {score}</p>
                    {!scoreSubmitted && score > 0 && (
                      <>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          maxLength={20}
                        />
                        <Button onClick={handleSubmitScore}>Submit Score</Button>
                      </>
                    )}
                    <Button onClick={handlePlayAgain}>Play Again</Button>
                  </>
                ) : (
                  <>
                    <h2>Paused</h2>
                    <Button onClick={togglePause}>Resume</Button>
                  </>
                )}
              </GameMessage>
            )}
          </GameOverlay>

          <Controls>
            <p>Use arrow keys to move</p>
            <p>Space to pause</p>
            <p>Enter to restart when game over</p>
          </Controls>
        </div>
        
        <HighScores />
      </GameContainer>
    </AppContainer>
  );
};

export default App;