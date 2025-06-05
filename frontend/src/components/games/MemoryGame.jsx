import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaCheck } from "react-icons/fa";
import "./Games.css";

const MemoryGame = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
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

    // Card symbols
    const symbols = ["🍕", "🍔", "🍟", "🌭", "🍿", "🥗", "🥪", "🌮"];

    // Initialize the game
    const initGame = () => {
        // Create pairs of cards with symbols
        const cardPairs = [...symbols, ...symbols];

        // Shuffle the cards
        const shuffledCards = cardPairs
            .map((symbol) => ({
                id: Math.random(),
                symbol,
                flipped: false,
                solved: false,
            }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setScore(0);
        setGameOver(false);
        setGameInfo((prev) => ({ ...prev, points: 0 }));
    };

    useEffect(() => {
        // Update countdown timer
        if (countdown > 0 && !gameStarted) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
                if (countdown === 1) {
                    setGameStarted(true);
                    initGame();
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, gameStarted]);

    useEffect(() => {
        // Update game remaining time
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

    // Check if the game is over
    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setGameOver(true);
            const calculatedFinalScore = Math.max(100 - moves * 5, 10);
            setScore(calculatedFinalScore);
            setFinalScore(calculatedFinalScore);
            setGameInfo((prev) => ({
                ...prev,
                points: calculatedFinalScore,
            }));
            setTimeout(() => {
                setShowPointsPopup(true);
            }, 1000);
        }
    }, [solved, cards, moves]);

    // Handle card click
    const handleCardClick = (clickedId) => {
        // Prevent clicking if two cards are already flipped or if the card is solved
        if (flipped.length === 2) return;
        if (solved.includes(clickedId)) return;
        if (flipped.includes(clickedId)) return;

        // Flip the card
        const newFlipped = [...flipped, clickedId];
        setFlipped(newFlipped);

        // If two cards are flipped, check for a match
        if (newFlipped.length === 2) {
            setMoves(moves + 1);

            const [first, second] = newFlipped;
            const firstCard = cards.find((card) => card.id === first);
            const secondCard = cards.find((card) => card.id === second);

            if (firstCard.symbol === secondCard.symbol) {
                // Cards match
                setSolved([...solved, first, second]);
                setFlipped([]);

                // Update score
                const matchPoints = 20;
                setScore((prev) => prev + matchPoints);
                setGameInfo((prev) => ({
                    ...prev,
                    points: prev.points + matchPoints,
                }));
            } else {
                // Cards don't match, flip back after a delay
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

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

    return (
        <div className="memory-game">
            <div className="memory-game-header">
                <h3 className="memory-game-score">Điểm: {score}</h3>
                <h3 className="memory-game-moves">Lượt: {moves}</h3>
                <button className="memory-game-restart" onClick={initGame}>
                    Chơi lại
                </button>
            </div>

            <div className="memory-game-board">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`memory-card ${
                            flipped.includes(card.id) ? "flipped" : ""
                        } ${solved.includes(card.id) ? "solved" : ""}`}
                        onClick={() => handleCardClick(card.id)}
                    >
                        <div className="memory-card-inner">
                            <div className="memory-card-front">?</div>
                            <div className="memory-card-back">
                                {card.symbol}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {gameOver && (
                <div className="memory-game-over">
                    <h2>Game Over!</h2>
                    <p>Bạn đã hoàn thành trong {moves} lượt</p>
                    <p>Điểm của bạn: {score}</p>
                    <button onClick={initGame}>Chơi lại</button>
                </div>
            )}

            <div className="memory-game-instructions">
                <p>Tìm và ghép các cặp thẻ giống nhau.</p>
            </div>

            {showPointsPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Điểm của bạn</h2>
                        <p>Điểm: {finalScore}</p>
                        <div className="popup-buttons">
                            <button onClick={handleAccumulatePoints}>
                                <FaCheck /> Nhận điểm
                            </button>
                            <button onClick={handleDeclinePoints}>
                                <FaTimes /> Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Thành công!</h2>
                        <p>Bạn đã nhận được {finalScore} điểm.</p>
                        <button onClick={() => setShowSuccessPopup(false)}>
                            Tiếp tục
                        </button>
                    </div>
                </div>
            )}

            {showContinuePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Chơi tiếp?</h2>
                        <p>Bạn có muốn tiếp tục chơi không?</p>
                        <div className="popup-buttons">
                            <button onClick={handleContinuePlaying}>
                                <FaCheck /> Có
                            </button>
                            <button onClick={handleQuitGame}>
                                <FaTimes /> Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showOrderDonePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Thời gian đã hết!</h2>
                        <p>Đơn hàng của bạn đã được hoàn thành.</p>
                        <button onClick={() => setShowOrderDonePopup(false)}>
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
