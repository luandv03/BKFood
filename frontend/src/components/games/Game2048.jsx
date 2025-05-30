import { useState, useEffect, useCallback } from "react";
import "./Game2048.css";

const Game2048 = ({ onScoreUpdate, onGameOver }) => {
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    // Initialize empty grid
    const initGrid = () => {
        const newGrid = Array(4).fill().map(() => Array(4).fill(0));
        return newGrid;
    };

    // Add random tile (2 or 4)
    const addRandomTile = (grid) => {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const newGrid = grid.map(row => [...row]);
            newGrid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
            return newGrid;
        }
        return grid;
    };

    // Initialize game
    const initGame = () => {
        let newGrid = initGrid();
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
        setWon(false);
    };

    // Move logic
    const moveLeft = (grid) => {
        const newGrid = grid.map(row => [...row]);
        let moved = false;
        let scoreIncrease = 0;

        for (let i = 0; i < 4; i++) {
            const row = newGrid[i].filter(val => val !== 0);
            
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    scoreIncrease += row[j];
                    row[j + 1] = 0;
                    if (row[j] === 2048) setWon(true);
                }
            }
            
            const newRow = row.filter(val => val !== 0);
            while (newRow.length < 4) {
                newRow.push(0);
            }
            
            if (JSON.stringify(newGrid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            newGrid[i] = newRow;
        }

        return { grid: newGrid, moved, scoreIncrease };
    };

    const moveRight = (grid) => {
        const rotatedGrid = grid.map(row => [...row].reverse());
        const { grid: movedGrid, moved, scoreIncrease } = moveLeft(rotatedGrid);
        return {
            grid: movedGrid.map(row => [...row].reverse()),
            moved,
            scoreIncrease
        };
    };

    const moveUp = (grid) => {
        const transposedGrid = grid[0].map((_, i) => grid.map(row => row[i]));
        const { grid: movedGrid, moved, scoreIncrease } = moveLeft(transposedGrid);
        return {
            grid: movedGrid[0].map((_, i) => movedGrid.map(row => row[i])),
            moved,
            scoreIncrease
        };
    };

    const moveDown = (grid) => {
        const transposedGrid = grid[0].map((_, i) => grid.map(row => row[i]));
        const rotatedGrid = transposedGrid.map(row => [...row].reverse());
        const { grid: movedGrid, moved, scoreIncrease } = moveLeft(rotatedGrid);
        const rotatedBack = movedGrid.map(row => [...row].reverse());
        return {
            grid: rotatedBack[0].map((_, i) => rotatedBack.map(row => row[i])),
            moved,
            scoreIncrease
        };
    };

    // Check if game is over
    const isGameOver = (grid) => {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = grid[i][j];
                if (
                    (j < 3 && current === grid[i][j + 1]) ||
                    (i < 3 && current === grid[i + 1][j])
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    // Handle moves
    const handleMove = useCallback((direction) => {
        if (gameOver) return;

        let moveResult;
        switch (direction) {
            case 'left':
                moveResult = moveLeft(grid);
                break;
            case 'right':
                moveResult = moveRight(grid);
                break;
            case 'up':
                moveResult = moveUp(grid);
                break;
            case 'down':
                moveResult = moveDown(grid);
                break;
            default:
                return;
        }

        if (moveResult.moved) {
            const newGrid = addRandomTile(moveResult.grid);
            const newScore = score + moveResult.scoreIncrease;
            
            setGrid(newGrid);
            setScore(newScore);
            onScoreUpdate?.(newScore);

            if (isGameOver(newGrid)) {
                setGameOver(true);
                onGameOver?.(newScore);
            }
        }
    }, [grid, score, gameOver, onScoreUpdate, onGameOver]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    handleMove('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleMove('right');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    handleMove('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    handleMove('down');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleMove]);

    // Touch controls
    const [touchStart, setTouchStart] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleTouchEnd = (e) => {
        if (!touchStart) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                handleMove(deltaX > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
                handleMove(deltaY > 0 ? 'down' : 'up');
            }
        }

        setTouchStart(null);
    };

    // Initialize game on mount
    useEffect(() => {
        initGame();
    }, []);

    const getTileClass = (value) => {
        if (value === 0) return 'tile-empty';
        return `tile-${value}`;
    };

    return (
        <div className="game-2048">
            <div className="game-2048-header">
                <div className="score-display">
                    <span className="score-label">Điểm:</span>
                    <span className="score-value">{score}</span>
                </div>
                <button className="new-game-btn" onClick={initGame}>
                    Chơi lại
                </button>
            </div>

            <div className="game-instructions">
                <p>Vuốt hoặc dùng phím mũi tên để di chuyển. Ghép các số giống nhau để tạo 2048!</p>
            </div>

            <div 
                className="game-2048-grid"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {grid.map((row, i) => 
                    row.map((cell, j) => (
                        <div 
                            key={`${i}-${j}`} 
                            className={`game-2048-tile ${getTileClass(cell)}`}
                        >
                            {cell !== 0 && cell}
                        </div>
                    ))
                )}
            </div>

            {won && !gameOver && (
                <div className="game-2048-overlay">
                    <div className="game-2048-message win">
                        <h2>🎉 Chúc mừng!</h2>
                        <p>Bạn đã đạt 2048!</p>
                        <button onClick={() => setWon(false)}>Tiếp tục chơi</button>
                    </div>
                </div>
            )}

            {gameOver && (
                <div className="game-2048-overlay">
                    <div className="game-2048-message game-over">
                        <h2>Game Over!</h2>
                        <p>Điểm cuối: {score}</p>
                        <button onClick={initGame}>Chơi lại</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game2048; 