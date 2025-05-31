import React from 'react';
import styled from 'styled-components';

interface GameControlsProps {
  onStart: () => void;
  onPause: () => void;
  isGameOver: boolean;
  isPaused: boolean;
  score: number;
}

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return '#4CAF50';
      case 'secondary':
        return '#2196F3';
      case 'danger':
        return '#f44336';
      default:
        return '#4CAF50';
    }
  }};
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    background: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return '#45a049';
      case 'secondary':
        return '#1976D2';
      case 'danger':
        return '#d32f2f';
      default:
        return '#45a049';
    }
  }};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ScoreDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
`;

const GameOverMessage = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #f44336;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(244, 67, 54, 0.3);
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Instructions = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #fff;
  text-align: center;

  p {
    margin: 0.5rem 0;
  }
`;

export const GameControls: React.FC<GameControlsProps> = ({
  onStart,
  onPause,
  isGameOver,
  isPaused,
  score
}) => {
  return (
    <ControlsContainer>
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      
      {isGameOver && (
        <GameOverMessage>Game Over!</GameOverMessage>
      )}

      <Controls>
        {isGameOver ? (
          <Button onClick={onStart} variant="primary">
            New Game
          </Button>
        ) : (
          <Button
            onClick={onPause}
            variant="secondary"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </Controls>

      <Instructions>
        <p>Use Arrow Keys or WASD to move</p>
        <p>P or ESC to pause</p>
        <p>Collect red food for 10 points</p>
        <p>Golden bonus food for 50 points!</p>
      </Instructions>
    </ControlsContainer>
  );
};