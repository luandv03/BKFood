import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaCheck } from "react-icons/fa";
import "./FlappyBird.css";

const FlappyBird = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [gameInfo, setGameInfo] = useState({
        remainingTime: 300, // 5 minutes in seconds
        reward: "Món ăn đặc biệt",
        points: 0,
    });
    // New states for popups
    const [showPointsPopup, setShowPointsPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showContinuePopup, setShowContinuePopup] = useState(false);
    const [showOrderDonePopup, setShowOrderDonePopup] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

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

                // if (gameOver) {
                //     // Handle game over due to time
                //     // alert(
                //     //     "Hết thời gian! Bạn đã đạt " +
                //     //         gameInfo.points +
                //     //         " điểm."
                //     // );
                //     setShowOrderDonePopup(true);
                // }
            }

            return () => clearInterval(timer);
        }
    }, [gameStarted, gameInfo.remainingTime]);

    // Modified initGame function to handle game over properly
    const initGame = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to match parent container
        const container = canvas.parentNode;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Game variables
        let bird = {
            x: canvas.width / 4,
            y: canvas.height / 2,
            size: 30,
            velocity: 0,
            gravity: 0.5,
            jump: -8,
            alive: true,
        };

        let pipes = [];
        let score = 0;
        let frames = 0;

        // Game loop
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background (sky)
            ctx.fillStyle = "#71c5cf";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw clouds
            ctx.fillStyle = "#ffffff";
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(100 + i * 30, 80, 20, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw city skyline
            ctx.fillStyle = "#8ee2a8";
            ctx.fillRect(0, canvas.height - 80, canvas.width, 30);

            ctx.fillStyle = "#6fe687";
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.arc(i, canvas.height - 80, 20, 0, Math.PI);
            }
            ctx.fill();

            // Draw ground
            ctx.fillStyle = "#ded895";
            ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

            // Update and draw bird
            if (bird.alive) {
                bird.velocity += bird.gravity;
                bird.y += bird.velocity;

                // Bird collision with ground or ceiling
                if (
                    bird.y >= canvas.height - 50 - bird.size / 2 ||
                    bird.y <= bird.size / 2
                ) {
                    bird.alive = false;
                }

                // Draw bird
                ctx.fillStyle = "#e74c3c";
                ctx.beginPath();
                ctx.arc(bird.x, bird.y, bird.size / 2, 0, Math.PI * 2);
                ctx.fill();

                // Bird wing
                ctx.fillStyle = "#c0392b";
                ctx.beginPath();
                ctx.ellipse(
                    bird.x - 5,
                    bird.y + 5,
                    10,
                    5,
                    Math.sin(frames / 5) / 4,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            // Generate pipes
            if (frames % 100 === 0) {
                let pipeGap = 150;
                let pipeHeight =
                    Math.floor(
                        Math.random() * (canvas.height - pipeGap - 200)
                    ) + 50;

                pipes.push({
                    x: canvas.width,
                    y: 0,
                    width: 60,
                    height: pipeHeight,
                    passed: false,
                });

                pipes.push({
                    x: canvas.width,
                    y: pipeHeight + pipeGap,
                    width: 60,
                    height: canvas.height - pipeHeight - pipeGap,
                    passed: false,
                });
            }

            // Update and draw pipes
            for (let i = 0; i < pipes.length; i++) {
                let pipe = pipes[i];

                if (bird.alive) {
                    pipe.x -= 2;
                }

                // Remove pipes that are off screen
                if (pipe.x + pipe.width < 0) {
                    pipes.splice(i, 1);
                    i--;
                    continue;
                }

                // Score when passing pipe
                if (
                    bird.alive &&
                    !pipe.passed &&
                    pipe.x + pipe.width < bird.x
                ) {
                    if (i % 2 === 0) {
                        // Only count top pipes
                        score++;
                        setGameInfo((prev) => ({
                            ...prev,
                            points: score,
                        }));
                    }
                    pipe.passed = true;
                }

                // Check collision
                if (
                    bird.x + bird.size / 2 > pipe.x &&
                    bird.x - bird.size / 2 < pipe.x + pipe.width &&
                    bird.y - bird.size / 2 < pipe.y + pipe.height &&
                    bird.y + bird.size / 2 > pipe.y
                ) {
                    bird.alive = false;
                }

                // Draw pipe
                ctx.fillStyle = "#2ecc71";
                ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

                // Pipe cap
                ctx.fillStyle = "#27ae60";
                ctx.fillRect(pipe.x - 5, pipe.y, pipe.width + 10, 20);
                if (i % 2 === 1) {
                    // Bottom pipe
                    ctx.fillRect(pipe.x - 5, pipe.y, pipe.width + 10, 20);
                } else {
                    // Top pipe
                    ctx.fillRect(
                        pipe.x - 5,
                        pipe.height - 20,
                        pipe.width + 10,
                        20
                    );
                }
            }

            // Draw score
            ctx.fillStyle = "#fff";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Điểm: " + score, canvas.width / 2, 50);

            if (!bird.alive) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#fff";
                ctx.font = "30px Arial";
                ctx.fillText(
                    "Game Over!",
                    canvas.width / 2,
                    canvas.height / 2 - 50
                );
                ctx.fillText(
                    "Điểm của bạn: " + score,
                    canvas.width / 2,
                    canvas.height / 2
                );

                // Show the points accumulation popup instead of game restart instruction
                if (!gameOver) {
                    setGameOver(true);
                    setFinalScore(score);
                    setTimeout(() => {
                        setShowPointsPopup(true);
                    }, 1000);
                }

                return; // Stop game loop if bird is dead
            }

            frames++;
            requestAnimationFrame(gameLoop);
        }

        // Start game loop
        gameLoop();

        // Handle tap/click to jump - modified to work with popups
        function handleJump() {
            if (bird.alive) {
                bird.velocity = bird.jump;
            }
            // Removed the else block for game restart as we now handle it through popups
        }

        // Event listeners
        canvas.addEventListener("click", handleJump);
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleJump();
        });

        // Clean up event listeners on unmount
        return () => {
            canvas.removeEventListener("click", handleJump);
            canvas.removeEventListener("touchstart", handleJump);
        };
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
        // navigate(-1);
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
        <div className="game-page">
            <div className="game-header">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft />
                </button>
                <h1 className="game-title">Flappy Bird</h1>
            </div>

            {!gameStarted && (
                <div className="game-countdown">
                    <h2>{countdown}</h2>
                    <p>Trò chơi sẽ bắt đầu sau {countdown} giây</p>
                </div>
            )}

            <div className="game-info-bar">
                <div className="game-info-item">
                    <span className="info-label">Thời gian còn lại:</span>
                    <span className="info-value">
                        {formatTime(gameInfo.remainingTime)}
                    </span>
                </div>
                <div className="game-info-item">
                    <span className="info-label">1 x Món ăn đặc biệt:</span>
                    <span className="info-value reward">{gameInfo.reward}</span>
                </div>
            </div>

            <div className="game-container">
                <canvas ref={canvasRef} className="game-canvas"></canvas>
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
                        <p>Bạn có muốn chơi lại không?</p>
                        <div className="popup-actions">
                            <button
                                className="popup-button cancel"
                                onClick={handleQuitGame}
                            >
                                <FaTimes /> Không
                            </button>
                            <button
                                className="popup-button confirm"
                                onClick={handleContinuePlaying}
                            >
                                <FaCheck /> Có
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
                                    navigate(-1); // Navigate back to previous screen
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

export default FlappyBird;
