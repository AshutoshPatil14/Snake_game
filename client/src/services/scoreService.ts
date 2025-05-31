import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface Score {
  score: number;
  playerName: string;
  createdAt: string;
  _id: string;
}

export const scoreService = {
  getHighScores: async (): Promise<Score[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/scores`);
      return response.data;
    } catch (error) {
      console.error('Error fetching high scores:', error);
      return [];
    }
  },

  submitScore: async (score: number, playerName: string = 'Anonymous'): Promise<Score | null> => {
    try {
      const response = await axios.post(`${API_URL}/api/scores`, {
        score,
        playerName
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting score:', error);
      return null;
    }
  }
};