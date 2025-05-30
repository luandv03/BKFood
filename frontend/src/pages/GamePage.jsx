import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaCheck, FaGamepad } from "react-icons/fa";
import FlappyBird from "../components/games/FlappyBird";
import Game2048 from "../components/games/Game2048";
import CandyCrush from "../components/games/CandyCrush";
import WoodBlockPuzzle from "../components/games/WoodBlockPuzzle";
import "./GamePage.css";

const GamePage = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameInfo, setGameInfo] = useState({
        remainingTime: 3000, // 50 minutes in seconds
        reward: "Món ăn đặc biệt",
        points: 0,
    });
    
    // Popup states
    const [showPointsPopup, setShowPointsPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showContinuePopup, setShowContinuePopup] = useState(false);
    const [showOrderDonePopup, setShowOrderDonePopup] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    // Handle score updates from games
    const handleScoreUpdate = (score) => {
        setGameInfo(prev => ({
            ...prev,
            points: score
        }));
    };

    // Handle game over from games
    const handleGameOver = (score) => {
        setFinalScore(score);
        setTimeout(() => {
            setShowPointsPopup(true);
        }, 1000);
    };

    // Handle points accumulation
    const handleAccumulatePoints = () => {
        setShowPointsPopup(false);
        setShowSuccessPopup(true);

        setTimeout(() => {
            setShowSuccessPopup(false);
            if (gameInfo.remainingTime <= 0) {
                setShowOrderDonePopup(true);
            } else {
                setShowContinuePopup(true);
            }
        }, 2000);
    };

    // Decline points accumulation
    const handleDeclinePoints = () => {
        setShowPointsPopup(false);
        setShowContinuePopup(true);
    };

    // Handle continue playing choice
    const handleContinuePlaying = () => {
        setShowContinuePopup(false);
        // Reset to game selector
        setSelectedGame(null);
    };

    // Handle quit game
    const handleQuitGame = () => {
        setShowContinuePopup(false);
        navigate(-1);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleBack = () => {
        if (selectedGame) {
            setSelectedGame(null);
        } else {
            navigate(-1);
        }
    };

    const gameOptions = [
        {
            id: 'flappy',
            name: 'Flappy Bird',
            emoji: '🐦',
            description: 'Điều khiển chú chim bay qua các ống nước',
            difficulty: 'Dễ',
            color: '#71c5cf'
        },
        {
            id: '2048',
            name: '2048',
            emoji: '🔢',
            description: 'Ghép các số để tạo thành 2048',
            difficulty: 'Trung bình',
            color: '#edc22e'
        },
        {
            id: 'candy',
            name: 'Candy Crush',
            emoji: '🍭',
            description: 'Ghép 3 kẹo để ghi điểm và vượt qua level',
            difficulty: 'Trung bình',
            color: '#ff6b6b'
        },
        {
            id: 'wood',
            name: 'Wood Block Puzzle',
            emoji: '🧩',
            description: 'Đặt khối gỗ và lấp đầy hàng cột để xóa',
            difficulty: 'Khó',
            color: '#8B4513'
        }
    ];

    const renderGame = () => {
        switch (selectedGame) {
            case 'flappy':
                return <FlappyBird onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} />;
            case '2048':
                return <Game2048 onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} />;
            case 'candy':
                return <CandyCrush onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} />;
            case 'wood':
                return <WoodBlockPuzzle onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} />;
            default:
                return null;
        }
    };

    return (
        <div className="game-page">
            <div className="game-header">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft />
                </button>
                <h1 className="game-title">
                    {selectedGame ? gameOptions.find(g => g.id === selectedGame)?.name : 'Chọn trò chơi'}
                </h1>
            </div>

            <div className="game-info-bar">
                <div className="game-info-item">
                    <span className="info-label">Thời gian còn lại:</span>
                    <span className="info-value">
                        {formatTime(gameInfo.remainingTime)}
                    </span>
                </div>
                <div className="game-info-item">
                    <span className="info-label">Phần thưởng:</span>
                    <span className="info-value reward">{gameInfo.reward}</span>
                </div>
            </div>

            <div className="game-container">
                {!selectedGame ? (
                    <div className="game-selector">
                        <div className="selector-header">
                            <FaGamepad className="selector-icon" />
                            <h2>Chọn trò chơi yêu thích</h2>
                            <p>Chơi game trong lúc chờ đơn hàng được chuẩn bị!</p>
                        </div>
                        
                        <div className="games-grid">
                            {gameOptions.map(game => (
                                <div 
                                    key={game.id}
                                    className="game-card"
                                    onClick={() => setSelectedGame(game.id)}
                                    style={{ borderLeft: `4px solid ${game.color}` }}
                                >
                                    <div className="game-card-emoji">{game.emoji}</div>
                                    <div className="game-card-content">
                                        <h3>{game.name}</h3>
                                        <p>{game.description}</p>
                                        <span className="game-difficulty">{game.difficulty}</span>
                                    </div>
                                    <div className="game-card-arrow">
                                        <FaArrowLeft />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="game-tips">
                            <h3>💡 Mẹo chơi game</h3>
                            <ul>
                                <li>Chơi game để tích điểm thưởng</li>
                                <li>Càng chơi lâu càng có nhiều điểm</li>
                                <li>Sử dụng điểm để đổi voucher giảm giá</li>
                                <li>Thử thách bản thân với độ khó tăng dần</li>
                            </ul>
                        </div>
                    </div>
                ) : renderGame()}
            </div>

            {/* Points Accumulation Popup */}
            {showPointsPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Tích điểm thưởng</h2>
                        <p>
                            Bạn có muốn tích {finalScore} điểm vào tài khoản
                            thưởng không?
                        </p>
                        <div className="popup-actions">
                            <button
                                className="popup-button cancel"
                                onClick={handleDeclinePoints}
                            >
                                <FaTimes /> Không
                            </button>
                            <button
                                className="popup-button confirm"
                                onClick={handleAccumulatePoints}
                            >
                                <FaCheck /> Có
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content success">
                        <FaCheck className="success-icon" />
                        <h2>Thành công!</h2>
                        <p>Bạn đã tích điểm thành công.</p>
                    </div>
                </div>
            )}

            {/* Continue Playing Popup */}
            {showContinuePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Tiếp tục chơi?</h2>
                        <p>Bạn có muốn chơi game khác không?</p>
                        <div className="popup-actions">
                            <button
                                className="popup-button cancel"
                                onClick={handleQuitGame}
                            >
                                <FaTimes /> Thoát
                            </button>
                            <button
                                className="popup-button confirm"
                                onClick={handleContinuePlaying}
                            >
                                <FaCheck /> Chọn game khác
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Done Popup */}
            {showOrderDonePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Món ăn đã hoàn thành!</h2>
                        <p>
                            Nhà hàng đã chuẩn bị xong món ăn cho bạn, hãy tới
                            thưởng thức ngay thôi nào.
                        </p>
                        <div className="popup-actions">
                            <button
                                className="popup-button confirm"
                                onClick={() => {
                                    setShowOrderDonePopup(false);
                                    navigate(-1);
                                }}
                            >
                                <FaCheck /> Thoát
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamePage;
