import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { GameControls } from './GameControls';

interface GameProps {
  onScoreUpdate: (score: number) => void;
}

const Canvas = styled.canvas`
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  background: #1a1a1a;
`;

const GameWrapper = styled.div`
  position: relative;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  border-radius: 10px;
`;

interface Position {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  alpha: number;
  color: string;
}

const Game: React.FC<GameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gridSize = 20;
  const gameSpeed = useRef(150);
  const snake = useRef<Position[]>([]);
  const direction = useRef<string>('right');
  const nextDirection = useRef<string>('right');
  const food = useRef<Position | null>(null);
  const bonusFood = useRef<Position | null>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number>();
  const lastRenderTime = useRef<number>(0);

  const createParticles = (x: number, y: number, color: string) => {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      particles.current.push({
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2,
        dx: Math.cos(angle) * 2,
        dy: Math.sin(angle) * 2,
        alpha: 1,
        color
      });
    }
  };

  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    particles.current = particles.current.filter(particle => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.alpha *= 0.95;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();

      return particle.alpha > 0.1;
    });
  };

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * (400 / gridSize)),
      y: Math.floor(Math.random() * (400 / gridSize))
    };
    food.current = newFood;
  };

  const generateBonusFood = () => {
    if (Math.random() < 0.3) {
      const newBonusFood = {
        x: Math.floor(Math.random() * (400 / gridSize)),
        y: Math.floor(Math.random() * (400 / gridSize))
      };
      bonusFood.current = newBonusFood;
      setTimeout(() => {
        bonusFood.current = null;
      }, 5000);
    }
  };

  const checkCollision = (head: Position) => {
    if (
      head.x < 0 ||
      head.x >= 400 / gridSize ||
      head.y < 0 ||
      head.y >= 400 / gridSize
    ) {
      return true;
    }

    return snake.current.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    );
  };

  const moveSnake = () => {
    const head = { ...snake.current[0] };
    direction.current = nextDirection.current;

    switch (direction.current) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    snake.current.unshift(head);

    if (
      food.current &&
      head.x === food.current.x &&
      head.y === food.current.y
    ) {
      setScore(prev => {
        const newScore = prev + 10;
        onScoreUpdate(newScore);
        return newScore;
      });
      createParticles(food.current.x, food.current.y, '255, 255, 255');
      generateFood();
      generateBonusFood();
      gameSpeed.current = Math.max(50, gameSpeed.current - 2);
    } else if (
      bonusFood.current &&
      head.x === bonusFood.current.x &&
      head.y === bonusFood.current.y
    ) {
      setScore(prev => {
        const newScore = prev + 50;
        onScoreUpdate(newScore);
        return newScore;
      });
      createParticles(bonusFood.current.x, bonusFood.current.y, '255, 215, 0');
      bonusFood.current = null;
    } else {
      snake.current.pop();
    }
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 400, 400);

    // Draw snake
    snake.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4CAF50' : '#388E3C';
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 1,
        gridSize - 1
      );
    });

    // Draw food
    if (food.current) {
      ctx.fillStyle = '#f44336';
      ctx.fillRect(
        food.current.x * gridSize,
        food.current.y * gridSize,
        gridSize - 1,
        gridSize - 1
      );
    }

    // Draw bonus food
    if (bonusFood.current) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(
        bonusFood.current.x * gridSize,
        bonusFood.current.y * gridSize,
        gridSize - 1,
        gridSize - 1
      );
    }

    // Update and draw particles
    updateParticles(ctx);
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!canvasRef.current || gameOver || isPaused) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const deltaTime = timestamp - lastRenderTime.current;

    if (deltaTime >= gameSpeed.current) {
      lastRenderTime.current = timestamp;
      moveSnake();
      draw(ctx);
    }

    animationFrame.current = requestAnimationFrame(gameLoop);
  }, [draw, gameOver, isPaused]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (key === 'p' || key === 'escape') {
      setIsPaused(prev => !prev);
      return;
    }

    const directions: { [key: string]: string } = {
      arrowup: 'up',
      arrowdown: 'down',
      arrowleft: 'left',
      arrowright: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right'
    };

    const newDirection = directions[key];
    if (!newDirection) return;

    const opposites: { [key: string]: string } = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (opposites[newDirection] !== direction.current) {
      nextDirection.current = newDirection;
    }
  }, []);

  const startGame = () => {
    snake.current = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    direction.current = 'right';
    nextDirection.current = 'right';
    generateFood();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    gameSpeed.current = 150;
    lastRenderTime.current = 0;
    onScoreUpdate(0);

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [handleKeyPress]);

  return (
    <GameWrapper>
      <Canvas ref={canvasRef} width={400} height={400} />
      <GridOverlay />
      <GameControls
        onStart={startGame}
        onPause={() => setIsPaused(prev => !prev)}
        isGameOver={gameOver}
        isPaused={isPaused}
        score={score}
      />
    </GameWrapper>
  );
};

export default Game;