import React from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background-color: #1a1c20;
  border: 2px solid #30363d;
  border-radius: 4px;
  padding: 10px;
  margin: 20px auto;
`;

const Cell = styled.div<{ isSnake?: boolean; isFood?: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ isSnake, isFood }) =>
    isSnake ? '#4CAF50' : isFood ? '#FF5252' : '#282c34'};
  border-radius: 2px;
  transition: background-color 0.2s ease;
`;

interface GameBoardProps {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const board = Array(20).fill(null).map(() => Array(20).fill(null));

  // Place snake on board
  snake.forEach(segment => {
    if (segment.x >= 0 && segment.x < 20 && segment.y >= 0 && segment.y < 20) {
      board[segment.y][segment.x] = 'snake';
    }
  });

  // Place food on board
  if (food.x >= 0 && food.x < 20 && food.y >= 0 && food.y < 20) {
    board[food.y][food.x] = 'food';
  }

  return (
    <BoardContainer>
      {board.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            isSnake={cell === 'snake'}
            isFood={cell === 'food'}
          />
        ))
      )}
    </BoardContainer>
  );
};

export default GameBoard;