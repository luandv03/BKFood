import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaCheck } from "react-icons/fa";
import "./Games.css";

const Game2048 = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [gameInfo, setGameInfo] = useState({
        remainingTime: 3000, // 5 minutes in seconds
        reward: "Món ăn đặc biệt",
        points: 0,
    });
    // Popup states
    const [showPointsPopup, setShowPointsPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showContinuePopup, setShowContinuePopup] = useState(false);
    const [showOrderDonePopup, setShowOrderDonePopup] = useState(false);

    const SIZE = 4;

    // Initialize board
    const initBoard = useCallback(() => {
        let newBoard = Array(SIZE)
            .fill()
            .map(() => Array(SIZE).fill(0));
        addRandomTile(newBoard);
        addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setGameInfo((prev) => ({ ...prev, points: 0 }));
    }, []);

    // Add a new random tile (2 or 4) to an empty cell
    const addRandomTile = (boardState) => {
        const emptyCells = [];

        // Find all empty cells
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (boardState[i][j] === 0) {
                    emptyCells.push({ i, j });
                }
            }
        }

        if (emptyCells.length === 0) return false;

        // Choose a random empty cell
        const { i, j } =
            emptyCells[Math.floor(Math.random() * emptyCells.length)];

        // Place a 2 (90% chance) or 4 (10% chance)
        boardState[i][j] = Math.random() < 0.9 ? 2 : 4;

        return true;
    };

    // Handler for keyboard events
    const handleKeyDown = useCallback(
        (e) => {
            if (gameOver) return;

            let moved = false;
            const newBoard = [...board.map((row) => [...row])];
            let newScore = score;

            // Process different directions
            switch (e.key) {
                case "ArrowUp":
                    moved = moveUp(newBoard, newScore);
                    break;
                case "ArrowDown":
                    moved = moveDown(newBoard, newScore);
                    break;
                case "ArrowLeft":
                    moved = moveLeft(newBoard, newScore);
                    break;
                case "ArrowRight":
                    moved = moveRight(newBoard, newScore);
                    break;
                default:
                    return;
            }

            if (moved) {
                addRandomTile(newBoard);
                setBoard(newBoard);
                if (checkGameOver(newBoard)) {
                    setGameOver(true);
                    setFinalScore(score);
                    setTimeout(() => {
                        setShowPointsPopup(true);
                    }, 1000);
                }
            }
        },
        [board, score, gameOver, onGameOver]
    );

    // Move functions for each direction
    const moveUp = (boardState, currentScore) => {
        let moved = false;
        for (let j = 0; j < SIZE; j++) {
            for (let i = 1; i < SIZE; i++) {
                if (boardState[i][j] !== 0) {
                    let row = i;
                    while (row > 0) {
                        // Move to empty cell
                        if (boardState[row - 1][j] === 0) {
                            boardState[row - 1][j] = boardState[row][j];
                            boardState[row][j] = 0;
                            row--;
                            moved = true;
                        }
                        // Merge with same value
                        else if (
                            boardState[row - 1][j] === boardState[row][j]
                        ) {
                            boardState[row - 1][j] *= 2;
                            boardState[row][j] = 0;
                            setScore(currentScore + boardState[row - 1][j]);
                            setGameInfo((prev) => ({
                                ...prev,
                                points: prev.points + boardState[row - 1][j],
                            }));
                            moved = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    };

    const moveDown = (boardState, currentScore) => {
        let moved = false;
        for (let j = 0; j < SIZE; j++) {
            for (let i = SIZE - 2; i >= 0; i--) {
                if (boardState[i][j] !== 0) {
                    let row = i;
                    while (row < SIZE - 1) {
                        if (boardState[row + 1][j] === 0) {
                            boardState[row + 1][j] = boardState[row][j];
                            boardState[row][j] = 0;
                            row++;
                            moved = true;
                        } else if (
                            boardState[row + 1][j] === boardState[row][j]
                        ) {
                            boardState[row + 1][j] *= 2;
                            boardState[row][j] = 0;
                            setScore(currentScore + boardState[row + 1][j]);
                            setGameInfo((prev) => ({
                                ...prev,
                                points: prev.points + boardState[row + 1][j],
                            }));
                            moved = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    };

    const moveLeft = (boardState, currentScore) => {
        let moved = false;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 1; j < SIZE; j++) {
                if (boardState[i][j] !== 0) {
                    let col = j;
                    while (col > 0) {
                        if (boardState[i][col - 1] === 0) {
                            boardState[i][col - 1] = boardState[i][col];
                            boardState[i][col] = 0;
                            col--;
                            moved = true;
                        } else if (
                            boardState[i][col - 1] === boardState[i][col]
                        ) {
                            boardState[i][col - 1] *= 2;
                            boardState[i][col] = 0;
                            setScore(currentScore + boardState[i][col - 1]);
                            setGameInfo((prev) => ({
                                ...prev,
                                points: prev.points + boardState[i][col - 1],
                            }));
                            moved = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    };

    const moveRight = (boardState, currentScore) => {
        let moved = false;
        for (let i = 0; i < SIZE; i++) {
            for (let j = SIZE - 2; j >= 0; j--) {
                if (boardState[i][j] !== 0) {
                    let col = j;
                    while (col < SIZE - 1) {
                        if (boardState[i][col + 1] === 0) {
                            boardState[i][col + 1] = boardState[i][col];
                            boardState[i][col] = 0;
                            col++;
                            moved = true;
                        } else if (
                            boardState[i][col + 1] === boardState[i][col]
                        ) {
                            boardState[i][col + 1] *= 2;
                            boardState[i][col] = 0;
                            setScore(currentScore + boardState[i][col + 1]);
                            setGameInfo((prev) => ({
                                ...prev,
                                points: prev.points + boardState[i][col + 1],
                            }));
                            moved = true;
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return moved;
    };

    // Check if game is over (no moves possible)
    const checkGameOver = (boardState) => {
        // Check for empty cells
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (boardState[i][j] === 0) return false;
            }
        }

        // Check for possible merges horizontally
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE - 1; j++) {
                if (boardState[i][j] === boardState[i][j + 1]) return false;
            }
        }

        // Check for possible merges vertically
        for (let i = 0; i < SIZE - 1; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (boardState[i][j] === boardState[i + 1][j]) return false;
            }
        }

        return true;
    };

    // Set up event listeners and initialize board
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    // Handle points accumulation
    const handleAccumulatePoints = () => {
        setShowPointsPopup(false);
        // Show success message
        setShowSuccessPopup(true);

        setTimeout(() => {
            setShowSuccessPopup(false);

            if (gameInfo.remainingTime <= 0) {
                setShowOrderDonePopup(true);
            } else {
                // If time is still remaining, show continue playing prompt
                setShowContinuePopup(true);
            }
        }, 2000);
    };

    // Decline points accumulation
    const handleDeclinePoints = () => {
        setShowPointsPopup(false);
        // Skip to continue playing prompt
        setShowContinuePopup(true);
    };

    // Handle continue playing choice
    const handleContinuePlaying = () => {
        setShowContinuePopup(false);
        setGameOver(false);
        // Reset game
        setGameStarted(false);
        setCountdown(3); // Shorter countdown for restart
    };

    // Handle quit game
    const handleQuitGame = () => {
        setShowContinuePopup(false);
        // Return to previous screen
        navigate(-1);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Update countdown timer
    useEffect(() => {
        if (countdown > 0 && !gameStarted) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
                if (countdown === 1) {
                    setGameStarted(true);
                    initBoard();
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, gameStarted, initBoard]);

    // Update game remaining time
    useEffect(() => {
        if (gameStarted) {
            const timer = setInterval(() => {
                setGameInfo((prev) => ({
                    ...prev,
                    remainingTime: prev.remainingTime - 1,
                }));
            }, 1000);

            // Check order timeout and game over
            if (gameInfo.remainingTime <= 0) {
                clearInterval(timer);
                if (!gameOver) {
                    setShowOrderDonePopup(true);
                }
            }

            return () => clearInterval(timer);
        }
    }, [gameStarted, gameInfo.remainingTime, gameOver]);

    // Handle touch events for mobile
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setTouchStart({
            x: touch.clientX,
            y: touch.clientY,
        });
    };

    const handleTouchEnd = (e) => {
        if (gameOver) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 50) {
                // Right
                handleKeyDown({ key: "ArrowRight" });
            } else if (deltaX < -50) {
                // Left
                handleKeyDown({ key: "ArrowLeft" });
            }
        } else {
            // Vertical swipe
            if (deltaY > 50) {
                // Down
                handleKeyDown({ key: "ArrowDown" });
            } else if (deltaY < -50) {
                // Up
                handleKeyDown({ key: "ArrowUp" });
            }
        }
    };

    // Get cell background color based on value
    const getCellColor = (value) => {
        switch (value) {
            case 0:
                return "#cdc1b4";
            case 2:
                return "#eee4da";
            case 4:
                return "#ede0c8";
            case 8:
                return "#f2b179";
            case 16:
                return "#f59563";
            case 32:
                return "#f67c5f";
            case 64:
                return "#f65e3b";
            case 128:
                return "#edcf72";
            case 256:
                return "#edcc61";
            case 512:
                return "#edc850";
            case 1024:
                return "#edc53f";
            case 2048:
                return "#edc22e";
            default:
                return "#3c3a32";
        }
    };

    // Get cell text color based on value
    const getTextColor = (value) => {
        return value <= 4 ? "#776e65" : "#f9f6f2";
    };

    return (
        <div
            className="game-2048"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="game-2048-header">
                <h3 className="game-2048-score">Điểm: {score}</h3>
                <button className="game-2048-restart" onClick={initBoard}>
                    Chơi lại
                </button>
            </div>

            <div className="game-2048-grid">
                {board.map((row, i) =>
                    row.map((cell, j) => (
                        <div
                            key={`${i}-${j}`}
                            className="game-2048-cell"
                            style={{
                                backgroundColor: getCellColor(cell),
                                color: getTextColor(cell),
                            }}
                        >
                            {cell !== 0 && cell}
                        </div>
                    ))
                )}
            </div>

            {gameOver && (
                <div className="game-2048-game-over">
                    <h2>Game Over!</h2>
                    <p>Điểm của bạn: {score}</p>
                    <button onClick={initBoard}>Chơi lại</button>
                </div>
            )}

            <div className="game-2048-instructions">
                <p>
                    Sử dụng phím mũi tên để di chuyển. Trên điện thoại, vuốt màn
                    hình.
                </p>
            </div>

            {showPointsPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Tính năng mới!</h2>
                        <p>
                            Bạn có muốn nhận{" "}
                            <strong>{gameInfo.points} điểm</strong> vào tài
                            khoản của mình không?
                        </p>
                        <div className="popup-buttons">
                            <button
                                onClick={handleAccumulatePoints}
                                className="popup-button"
                            >
                                <FaCheck /> Có
                            </button>
                            <button
                                onClick={handleDeclinePoints}
                                className="popup-button"
                            >
                                <FaTimes /> Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup success-popup">
                        <h2>Thành công!</h2>
                        <p>Bạn đã nhận được {gameInfo.points} điểm.</p>
                    </div>
                </div>
            )}

            {showContinuePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Tiếp tục chơi?</h2>
                        <p>Bạn có muốn tiếp tục chơi không?</p>
                        <div className="popup-buttons">
                            <button
                                onClick={handleContinuePlaying}
                                className="popup-button"
                            >
                                <FaCheck /> Có
                            </button>
                            <button
                                onClick={handleQuitGame}
                                className="popup-button"
                            >
                                <FaTimes /> Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showOrderDonePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Đơn hàng đã hoàn thành!</h2>
                        <p>Cảm ơn bạn đã chơi trò chơi.</p>
                        <button
                            onClick={() => setShowOrderDonePopup(false)}
                            className="popup-button"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game2048;
