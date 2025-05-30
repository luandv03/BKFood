import { useState, useEffect, useCallback } from "react";
import "./CandyCrush.css";

const CandyCrush = ({ onScoreUpdate, onGameOver }) => {
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [target, setTarget] = useState(5000);

    const candyTypes = ['🍭', '🍬', '🧁', '🍪', '🎂', '🍰'];
    const gridSize = 8;

    // Initialize grid with random candies
    const initGrid = () => {
        const newGrid = [];
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                let candy;
                do {
                    candy = candyTypes[Math.floor(Math.random() * candyTypes.length)];
                } while (
                    (j >= 2 && row[j-1] === candy && row[j-2] === candy) ||
                    (i >= 2 && newGrid[i-1] && newGrid[i-1][j] === candy && 
                     newGrid[i-2] && newGrid[i-2][j] === candy)
                );
                row.push(candy);
            }
            newGrid.push(row);
        }
        return newGrid;
    };

    // Initialize game
    const initGame = () => {
        setGrid(initGrid());
        setScore(0);
        setMoves(30);
        setGameOver(false);
        setSelectedCell(null);
        setTarget(5000);
    };

    // Check for matches
    const findMatches = (grid) => {
        const matches = [];
        
        // Check horizontal matches
        for (let i = 0; i < gridSize; i++) {
            let count = 1;
            let currentCandy = grid[i][0];
            let matchStart = 0;
            
            for (let j = 1; j < gridSize; j++) {
                if (grid[i][j] === currentCandy) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let k = matchStart; k < j; k++) {
                            matches.push({ row: i, col: k });
                        }
                    }
                    currentCandy = grid[i][j];
                    count = 1;
                    matchStart = j;
                }
            }
            if (count >= 3) {
                for (let k = matchStart; k < gridSize; k++) {
                    matches.push({ row: i, col: k });
                }
            }
        }

        // Check vertical matches
        for (let j = 0; j < gridSize; j++) {
            let count = 1;
            let currentCandy = grid[0][j];
            let matchStart = 0;
            
            for (let i = 1; i < gridSize; i++) {
                if (grid[i][j] === currentCandy) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let k = matchStart; k < i; k++) {
                            matches.push({ row: k, col: j });
                        }
                    }
                    currentCandy = grid[i][j];
                    count = 1;
                    matchStart = i;
                }
            }
            if (count >= 3) {
                for (let k = matchStart; k < gridSize; k++) {
                    matches.push({ row: k, col: j });
                }
            }
        }

        return matches;
    };

    // Remove matches and drop candies
    const processMatches = (grid) => {
        const matches = findMatches(grid);
        if (matches.length === 0) return { newGrid: grid, scoreIncrease: 0 };

        const newGrid = grid.map(row => [...row]);
        let scoreIncrease = matches.length * 100;

        // Mark matched candies as null
        matches.forEach(({ row, col }) => {
            newGrid[row][col] = null;
        });

        // Drop candies down
        for (let j = 0; j < gridSize; j++) {
            let writeIndex = gridSize - 1;
            for (let i = gridSize - 1; i >= 0; i--) {
                if (newGrid[i][j] !== null) {
                    newGrid[writeIndex][j] = newGrid[i][j];
                    if (writeIndex !== i) {
                        newGrid[i][j] = null;
                    }
                    writeIndex--;
                }
            }
            
            // Fill empty spaces with new candies
            for (let i = writeIndex; i >= 0; i--) {
                newGrid[i][j] = candyTypes[Math.floor(Math.random() * candyTypes.length)];
            }
        }

        return { newGrid, scoreIncrease };
    };

    // Process all matches recursively
    const processAllMatches = (grid) => {
        let currentGrid = grid;
        let totalScore = 0;
        
        while (true) {
            const { newGrid, scoreIncrease } = processMatches(currentGrid);
            if (scoreIncrease === 0) break;
            
            currentGrid = newGrid;
            totalScore += scoreIncrease;
        }
        
        return { finalGrid: currentGrid, totalScore };
    };

    // Check if two cells are adjacent
    const areAdjacent = (cell1, cell2) => {
        const rowDiff = Math.abs(cell1.row - cell2.row);
        const colDiff = Math.abs(cell1.col - cell2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    };

    // Swap two candies
    const swapCandies = (grid, cell1, cell2) => {
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[cell1.row][cell1.col];
        newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
        newGrid[cell2.row][cell2.col] = temp;
        return newGrid;
    };

    // Handle cell click
    const handleCellClick = (row, col) => {
        if (isProcessing || gameOver) return;

        const cellPos = { row, col };

        if (!selectedCell) {
            setSelectedCell(cellPos);
        } else if (selectedCell.row === row && selectedCell.col === col) {
            setSelectedCell(null);
        } else if (areAdjacent(selectedCell, cellPos)) {
            setIsProcessing(true);
            
            const swappedGrid = swapCandies(grid, selectedCell, cellPos);
            const { finalGrid, totalScore } = processAllMatches(swappedGrid);
            
            if (totalScore > 0) {
                // Valid move
                setGrid(finalGrid);
                const newScore = score + totalScore;
                const newMoves = moves - 1;
                
                setScore(newScore);
                setMoves(newMoves);
                onScoreUpdate?.(newScore);
                
                if (newMoves === 0) {
                    setGameOver(true);
                    onGameOver?.(newScore);
                }
            } else {
                // Invalid move - no matches, don't consume move
            }
            
            setSelectedCell(null);
            setIsProcessing(false);
        } else {
            setSelectedCell(cellPos);
        }
    };

    // Initialize game on mount
    useEffect(() => {
        initGame();
    }, []);

    const getCellClass = (row, col) => {
        let className = "candy-cell";
        if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
            className += " selected";
        }
        return className;
    };

    const progressPercentage = Math.min((score / target) * 100, 100);

    return (
        <div className="candy-crush">
            <div className="candy-header">
                <div className="score-section">
                    <div className="score-display">
                        <span className="score-label">Điểm:</span>
                        <span className="score-value">{score}</span>
                    </div>
                    <div className="moves-display">
                        <span className="moves-label">Nước:</span>
                        <span className="moves-value">{moves}</span>
                    </div>
                </div>
                <button className="new-game-btn" onClick={initGame}>
                    Chơi lại
                </button>
            </div>

            <div className="target-progress">
                <div className="progress-label">Mục tiêu: {target} điểm</div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="progress-text">{Math.round(progressPercentage)}%</div>
            </div>

            <div className="game-instructions">
                <p>Nhấn 2 kẹo kề nhau để hoán đổi. Tạo hàng từ 3 kẹo trở lên!</p>
            </div>

            <div className="candy-grid">
                {grid.map((row, i) =>
                    row.map((candy, j) => (
                        <div
                            key={`${i}-${j}`}
                            className={getCellClass(i, j)}
                            onClick={() => handleCellClick(i, j)}
                        >
                            <span className="candy-emoji">{candy}</span>
                        </div>
                    ))
                )}
            </div>

            {gameOver && (
                <div className="candy-overlay">
                    <div className="candy-message">
                        <h2>{score >= target ? "🎉 Thắng rồi!" : "Game Over!"}</h2>
                        <p>Điểm cuối: {score}</p>
                        <p>Mục tiêu: {target}</p>
                        <button onClick={initGame}>Chơi lại</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandyCrush; 