import { useState, useEffect, useCallback } from "react";
import "./WoodBlockPuzzle.css";

const WoodBlockPuzzle = ({ onScoreUpdate, onGameOver }) => {
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [nextBlocks, setNextBlocks] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [hoverCell, setHoverCell] = useState(null);

    const gridSize = 10;

    // Block shapes (each block is represented as an array of coordinates)
    const blockShapes = [
        // Single block
        [[0, 0]],
        // 2x1
        [[0, 0], [1, 0]],
        // 1x2  
        [[0, 0], [0, 1]],
        // 3x1
        [[0, 0], [1, 0], [2, 0]],
        // 1x3
        [[0, 0], [0, 1], [0, 2]],
        // L-shape
        [[0, 0], [1, 0], [1, 1]],
        // L-shape flipped
        [[0, 0], [0, 1], [1, 0]],
        // Square 2x2
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        // T-shape
        [[0, 0], [0, 1], [0, 2], [1, 1]],
        // Plus shape
        [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]
    ];

    // Initialize empty grid
    const initGrid = () => {
        return Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    };

    // Generate random blocks
    const generateBlocks = () => {
        const blocks = [];
        for (let i = 0; i < 3; i++) {
            const shape = blockShapes[Math.floor(Math.random() * blockShapes.length)];
            blocks.push({
                id: Date.now() + i,
                shape: shape,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
        return blocks;
    };

    // Initialize game
    const initGame = () => {
        setGrid(initGrid());
        setScore(0);
        setGameOver(false);
        setNextBlocks(generateBlocks());
        setSelectedBlock(null);
    };

    // Check if block can be placed at position
    const canPlaceBlock = (grid, block, startRow, startCol) => {
        for (const [dRow, dCol] of block.shape) {
            const newRow = startRow + dRow;
            const newCol = startCol + dCol;
            
            if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
                return false;
            }
            
            if (grid[newRow][newCol]) {
                return false;
            }
        }
        return true;
    };

    // Place block on grid
    const placeBlock = (grid, block, startRow, startCol) => {
        const newGrid = grid.map(row => [...row]);
        
        for (const [dRow, dCol] of block.shape) {
            const newRow = startRow + dRow;
            const newCol = startCol + dCol;
            newGrid[newRow][newCol] = true;
        }
        
        return newGrid;
    };

    // Check and clear complete lines
    const clearCompleteLines = (grid) => {
        let newGrid = grid.map(row => [...row]);
        let linesCleared = 0;
        
        // Check rows
        for (let i = 0; i < gridSize; i++) {
            if (newGrid[i].every(cell => cell)) {
                newGrid[i] = Array(gridSize).fill(false);
                linesCleared++;
            }
        }
        
        // Check columns
        for (let j = 0; j < gridSize; j++) {
            if (newGrid.every(row => row[j])) {
                for (let i = 0; i < gridSize; i++) {
                    newGrid[i][j] = false;
                }
                linesCleared++;
            }
        }
        
        return { newGrid, linesCleared };
    };

    // Handle block placement
    const handleBlockPlacement = (blockIndex, row, col) => {
        const block = nextBlocks[blockIndex];
        if (!block || !canPlaceBlock(grid, block, row, col)) {
            return;
        }

        // Place the block
        let newGrid = placeBlock(grid, block, row, col);
        
        // Clear complete lines
        const { newGrid: clearedGrid, linesCleared } = clearCompleteLines(newGrid);
        
        // Calculate score
        const blockScore = block.shape.length * 10;
        const lineScore = linesCleared * 100;
        const newScore = score + blockScore + lineScore;
        
        // Update state
        setGrid(clearedGrid);
        setScore(newScore);
        onScoreUpdate?.(newScore);
        
        // Remove used block and generate new one if needed
        const newBlocks = [...nextBlocks];
        newBlocks.splice(blockIndex, 1);
        
        if (newBlocks.length === 0) {
            newBlocks.push(...generateBlocks());
        }
        
        setNextBlocks(newBlocks);
        setSelectedBlock(null);
        
        // Check game over
        checkGameOver(clearedGrid, newBlocks);
    };

    // Check if any block can be placed
    const checkGameOver = (currentGrid, currentBlocks) => {
        for (const block of currentBlocks) {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (canPlaceBlock(currentGrid, block, i, j)) {
                        return; // Game can continue
                    }
                }
            }
        }
        
        // No valid moves
        setGameOver(true);
        onGameOver?.(score);
    };

    // Handle grid cell click
    const handleCellClick = (row, col) => {
        if (!selectedBlock || gameOver) return;
        
        const blockIndex = nextBlocks.findIndex(block => block.id === selectedBlock.id);
        if (blockIndex !== -1) {
            handleBlockPlacement(blockIndex, row, col);
        }
    };

    // Get cell class for styling
    const getCellClass = (row, col) => {
        let className = "wood-cell";
        
        if (grid[row][col]) {
            className += " filled";
        }
        
        // Preview placement if block is selected and hovering
        if (selectedBlock && hoverCell && canPlaceBlock(grid, selectedBlock, hoverCell.row, hoverCell.col)) {
            // Check if this cell is part of the preview
            const isPreviewCell = selectedBlock.shape.some(([dRow, dCol]) => {
                return hoverCell.row + dRow === row && hoverCell.col + dCol === col;
            });
            if (isPreviewCell) {
                className += " preview-cell";
            }
        }
        
        return className;
    };

    // Get block size for display
    const getBlockSize = (shape) => {
        const maxRow = Math.max(...shape.map(([r, c]) => r));
        const maxCol = Math.max(...shape.map(([r, c]) => c));
        return { width: maxCol + 1, height: maxRow + 1 };
    };

    // Initialize game on mount
    useEffect(() => {
        initGame();
    }, []);

    return (
        <div className="wood-puzzle">
            <div className="wood-header">
                <div className="score-display">
                    <span className="score-label">Điểm:</span>
                    <span className="score-value">{score}</span>
                </div>
                <button className="new-game-btn" onClick={initGame}>
                    Chơi lại
                </button>
            </div>

            <div className="game-instructions">
                <p>Chọn khối gỗ và đặt vào bàn. Lấp đầy hàng hoặc cột để xóa!</p>
            </div>

            <div className="wood-grid">
                {grid.map((row, i) =>
                    row.map((cell, j) => (
                        <div
                            key={`${i}-${j}`}
                            className={getCellClass(i, j)}
                            onClick={() => handleCellClick(i, j)}
                            onMouseEnter={() => setHoverCell({ row: i, col: j })}
                            onMouseLeave={() => setHoverCell(null)}
                        >
                        </div>
                    ))
                )}
            </div>

            <div className="blocks-container">
                <h3>Khối gỗ có sẵn:</h3>
                <div className="blocks-grid">
                    {nextBlocks.map((block, index) => {
                        const size = getBlockSize(block.shape);
                        return (
                            <div
                                key={block.id}
                                className={`block-preview ${selectedBlock?.id === block.id ? 'selected' : ''}`}
                                onClick={() => setSelectedBlock(selectedBlock?.id === block.id ? null : block)}
                                style={{
                                    gridTemplateColumns: `repeat(${size.width}, 1fr)`,
                                    gridTemplateRows: `repeat(${size.height}, 1fr)`
                                }}
                            >
                                {Array(size.height).fill().map((_, row) =>
                                    Array(size.width).fill().map((_, col) => {
                                        const isBlockCell = block.shape.some(([r, c]) => r === row && c === col);
                                        return (
                                            <div
                                                key={`${row}-${col}`}
                                                className={`block-cell ${isBlockCell ? 'filled' : 'empty'}`}
                                                style={{
                                                    backgroundColor: isBlockCell ? block.color : 'transparent'
                                                }}
                                            />
                                        );
                                    })
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {gameOver && (
                <div className="wood-overlay">
                    <div className="wood-message">
                        <h2>Game Over!</h2>
                        <p>Điểm cuối: {score}</p>
                        <p>Không còn nước đi hợp lệ!</p>
                        <button onClick={initGame}>Chơi lại</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WoodBlockPuzzle; 