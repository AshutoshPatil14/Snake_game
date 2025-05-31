import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { scoreService } from '../services/scoreService';

const ScoreContainer = styled.div`
  background-color: #1a1c20;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
`;

const ScoreTitle = styled.h2`
  color: #4CAF50;
  text-align: center;
  margin-bottom: 15px;
`;

const ScoreList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ScoreItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #30363d;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerName = styled.span`
  color: #e1e4e8;
`;

const ScoreValue = styled.span`
  color: #4CAF50;
  font-weight: bold;
`;

interface Score {
  _id: string;
  playerName: string;
  score: number;
  createdAt: string;
}

const HighScores: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const highScores = await scoreService.getHighScores();
        setScores(highScores);
      } catch (error) {
        console.error('Failed to fetch high scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <ScoreContainer>
        <ScoreTitle>Loading high scores...</ScoreTitle>
      </ScoreContainer>
    );
  }

  return (
    <ScoreContainer>
      <ScoreTitle>High Scores</ScoreTitle>
      <ScoreList>
        {scores.map((score, index) => (
          <ScoreItem key={score._id}>
            <PlayerName>{index + 1}. {score.playerName}</PlayerName>
            <ScoreValue>{score.score}</ScoreValue>
          </ScoreItem>
        ))}
      </ScoreList>
    </ScoreContainer>
  );
};

export default HighScores;