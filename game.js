class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.gridSize = 20;
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.bonusFood = null;
        this.bonusFoodTimer = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameLoop = null;
        this.isGameOver = false;
        this.particles = [];
        this.lastFrameTime = 0;
        this.frameInterval = 1000/10; // Reduced to 10 FPS for slower movement
        this.accumulator = 0;
        this.isPaused = false;

        this.startButton = document.getElementById('startButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.exitButton = document.getElementById('exitButton');
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.exitButton.addEventListener('click', () => this.exitGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Initialize the game board
        this.displayHighScore();
        this.pauseButton.style.display = 'none';
    }

    startGame() {
        // Reset game state
        this.snake = [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.isGameOver = false;
        this.particles = [];
        this.bonusFood = null;
        this.accumulator = 0;
        if (this.bonusFoodTimer) clearTimeout(this.bonusFoodTimer);
        this.updateScore();
        this.scheduleBonusFood();
        
        // Generate initial food position
        this.generateFood();

        // Clear previous game loop if exists
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);

        // Start game loop
        this.lastFrameTime = performance.now();
        this.frame = this.frame.bind(this);
        this.gameLoop = requestAnimationFrame(this.frame);
    }

    frame(timestamp) {
        if (this.isGameOver || this.isPaused) return;

        // Calculate time delta
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.accumulator += deltaTime;

        // Update game logic at fixed time steps
        while (this.accumulator >= this.frameInterval) {
            this.update();
            this.accumulator -= this.frameInterval;
        }

        // Always render at maximum frame rate
        this.draw();

        // Request next frame
        this.gameLoop = requestAnimationFrame(this.frame);
    }

    update() {
        if (this.isGameOver) return;

        // Update direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver();
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            this.createParticles(head.x * this.gridSize, head.y * this.gridSize, '#FF5252');
        } else if (this.bonusFood && head.x === this.bonusFood.x && head.y === this.bonusFood.y) {
            this.score += 50;
            this.updateScore();
            this.createParticles(head.x * this.gridSize, head.y * this.gridSize, '#FFD700');
            this.bonusFood = null;
            this.scheduleBonusFood();
        } else {
            this.snake.pop();
        }

        // Removed draw call as it's now handled in gameLoop
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        this.updateParticles();
        this.drawParticles();

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#4CAF50' : '#2E7D32';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#FF5252';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // Draw bonus food if exists
        if (this.bonusFood) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(
                (this.bonusFood.x * this.gridSize) + this.gridSize/2,
                (this.bonusFood.y * this.gridSize) + this.gridSize/2,
                this.gridSize/2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    generateFood() {
        while (true) {
            const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
            const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
            
            // Check if food spawns on snake
            if (!this.snake.some(segment => segment.x === x && segment.y === y)) {
                this.food = { x, y };
                break;
            }
        }
    }

    handleKeyPress(event) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };

        const newDirection = keyMap[event.key];
        
        if (event.key.toLowerCase() === 'p' || event.key === 'Escape') {
            this.togglePause();
            return;
        }
        
        if (!newDirection) return;

        // Prevent 180-degree turns
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + this.gridSize / 2,
                y: y + this.gridSize / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                alpha: 1,
                color: color
            });
        }
    }

    updateParticles() {
        const deltaTime = 1 / 60; // Assume 60 FPS for particle updates
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * deltaTime * 60;
            particle.y += particle.vy * deltaTime * 60;
            particle.alpha -= 0.02;
            return particle.alpha > 0;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    scheduleBonusFood() {
        this.bonusFoodTimer = setTimeout(() => {
            const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
            const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
            this.bonusFood = { x, y };

            // Make bonus food disappear after 5 seconds
            setTimeout(() => {
                this.bonusFood = null;
                this.scheduleBonusFood();
            }, 5000);
        }, Math.random() * 10000 + 5000); // Random time between 5-15 seconds
    }

    exitGame() {
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);
        if (this.bonusFoodTimer) clearTimeout(this.bonusFoodTimer);
        this.isGameOver = true;
        this.isPaused = false;
        this.pauseButton.style.display = 'none';
        this.pauseButton.textContent = 'Pause';
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.score = 0;
        this.updateScore();
    }

    gameOver() {
        this.isGameOver = true;
        if (this.gameLoop) cancelAnimationFrame(this.gameLoop);

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.displayHighScore();
        }

        // Display game over message
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(
            `Score: ${this.score}`,
            this.canvas.width / 2,
            this.canvas.height / 2 + 40
        );
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    displayHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// Initialize game when window loads
window.onload = () => {
    new SnakeGame();
};