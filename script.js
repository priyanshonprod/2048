class Game {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.best = parseInt(localStorage.getItem('2048-best')) || 0;
        this.gameOver = false;
        this.tileContainer = document.getElementById('tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.initializeGame();
    }

    initializeGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.updateScore();
        this.addNewTile();
        this.addNewTile();
        this.renderGrid();
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderGrid() {
        this.tileContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    tile.style.transform = `translate(${j * 121.25}px, ${i * 121.25}px)`;
                    this.tileContainer.appendChild(tile);
                }
            }
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        if (this.score > this.best) {
            this.best = this.score;
            this.bestDisplay.textContent = this.best;
            localStorage.setItem('2048-best', this.best);
        }
    }

    move(direction) {
        let moved = false;
        const newGrid = Array(4).fill().map(() => Array(4).fill(0));
        
        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < 4; i++) {
                let row = this.grid[i].filter(cell => cell !== 0);
                if (direction === 'right') row.reverse();

                // Merge
                for (let j = 0; j < row.length - 1; j++) {
                    if (row[j] === row[j + 1]) {
                        row[j] *= 2;
                        this.score += row[j];
                        row.splice(j + 1, 1);
                        moved = true;
                    }
                }

                // Fill with zeros
                while (row.length < 4) {
                    if (direction === 'left') row.push(0);
                    else row.unshift(0);
                }

                if (direction === 'right') row.reverse();
                newGrid[i] = row;
                
                if (row.join(',') !== this.grid[i].join(',')) moved = true;
            }
        } else {
            for (let j = 0; j < 4; j++) {
                let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
                if (direction === 'down') column.reverse();

                // Merge
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i] === column[i + 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i + 1, 1);
                        moved = true;
                    }
                }

                // Fill with zeros
                while (column.length < 4) {
                    if (direction === 'up') column.push(0);
                    else column.unshift(0);
                }

                if (direction === 'down') column.reverse();
                for (let i = 0; i < 4; i++) {
                    newGrid[i][j] = column[i];
                }
                
                if (column.join(',') !== this.grid.map(row => row[j]).join(',')) moved = true;
            }
        }

        if (moved) {
            this.grid = newGrid;
            this.addNewTile();
            this.updateScore();
            this.renderGrid();
            
            if (this.isGameOver()) {
                this.gameOver = true;
                alert('Game Over!');
            }
        }
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                if ((j < 3 && current === this.grid[i][j + 1]) ||
                    (i < 3 && current === this.grid[i + 1][j])) {
                    return false;
                }
            }
        }

        return true;
    }

    handleKeyPress(event) {
        if (this.gameOver) return;

        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.move('left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.move('right');
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.move('up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.move('down');
                break;
        }
    }
}

let game;

function startNewGame() {
    if (game) {
        game.initializeGame();
    } else {
        game = new Game();
    }
}

// Start the game when the page loads
window.onload = () => {
    game = new Game();
};