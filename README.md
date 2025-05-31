# Snake Game - MERN Stack

A modern implementation of the classic Snake game built with the MERN (MongoDB, Express.js, React, Node.js) stack and deployed on Vercel.

## Features

- Responsive game interface with modern design
- Real-time score tracking
- Global high score leaderboard
- Bonus food system
- Particle effects
- Pause/Resume functionality
- Mobile-friendly controls

## Tech Stack

- **Frontend**: React with TypeScript, Styled Components
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Vercel account

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd snake-game-mern
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both root and client directories
   - Update the MongoDB URI and other configuration values

4. Start the development servers:
   ```bash
   # Start backend server (from root directory)
   npm run dev

   # Start frontend server (from client directory)
   cd client
   npm start
   ```

## Deployment

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Create a new project on Vercel
   - Import your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `client/build`
     - Install Command: `npm install`

3. Set up environment variables in Vercel:
   - Add all required environment variables from `.env`

4. Deploy:
   - Vercel will automatically deploy your application
   - Any future pushes to the main branch will trigger automatic deployments

## Game Controls

- Arrow keys or WASD: Move snake
- P or ESC: Pause/Resume game
- Regular food (red): 10 points
- Bonus food (golden): 50 points

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.