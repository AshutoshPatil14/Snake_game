import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ScoreboardProps {
  currentScore: number;
}

interface Score {
  _id: string;
  score: number;
  playerName: string;
  createdAt: string;
}

const ScoreboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  min-width: 300px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const ScoreList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ScoreItem = styled.li<{ isCurrentScore?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: ${({ isCurrentScore }) =>
    isCurrentScore ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const PlayerName = styled.span`
  color: #fff;
  font-weight: 500;
`;

const ScoreValue = styled.span`
  color: #4CAF50;
  font-weight: 600;
`;

const LoadingMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 1rem;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
  padding: 1rem;
`;

const Scoreboard: React.FC<ScoreboardProps> = ({ currentScore }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchScores = async () => {
    try {
      const response = await axios.get<Score[]>(
        `${process.env.REACT_APP_API_URL}/api/scores`
      );
      setScores(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load scores');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    // Refresh scores every 30 seconds
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentScore > 0) {
      const saveScore = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/scores`, {
            score: currentScore,
            playerName: 'Player' // Could be enhanced with a name input
          });
          fetchScores(); // Refresh scores after saving
        } catch (err) {
          console.error('Failed to save score:', err);
        }
      };
      saveScore();
    }
  }, [currentScore]);

  if (loading) {
    return (
      <ScoreboardContainer>
        <Title>High Scores</Title>
        <LoadingMessage>Loading scores...</LoadingMessage>
      </ScoreboardContainer>
    );
  }

  if (error) {
    return (
      <ScoreboardContainer>
        <Title>High Scores</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </ScoreboardContainer>
    );
  }

  return (
    <ScoreboardContainer>
      <Title>High Scores</Title>
      <ScoreList>
        {scores.map((score) => (
          <ScoreItem
            key={score._id}
            isCurrentScore={score.score === currentScore}
          >
            <PlayerName>{score.playerName}</PlayerName>
            <ScoreValue>{score.score}</ScoreValue>
          </ScoreItem>
        ))}
      </ScoreList>
    </ScoreboardContainer>
  );
};

export default Scoreboard;