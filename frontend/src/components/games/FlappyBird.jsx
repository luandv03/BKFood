import { useState, useEffect, useRef } from "react";
import "./FlappyBird.css";

const FlappyBird = ({ onScoreUpdate, onGameOver }) => {
    const canvasRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

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
        let gameScore = 0;
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
                        gameScore++;
                        setScore(gameScore);
                        onScoreUpdate?.(gameScore);
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
            ctx.fillText("Điểm: " + gameScore, canvas.width / 2, 50);

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
                    "Điểm của bạn: " + gameScore,
                    canvas.width / 2,
                    canvas.height / 2
                );

                if (!gameOver) {
                    setGameOver(true);
                    onGameOver?.(gameScore);
                }

                return; // Stop game loop if bird is dead
            }

            frames++;
            requestAnimationFrame(gameLoop);
        }

        // Start game loop
        gameLoop();

        // Handle tap/click to jump
        function handleJump() {
            if (bird.alive) {
                bird.velocity = bird.jump;
            }
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

    const restartGame = () => {
        setGameOver(false);
        setGameStarted(false);
        setCountdown(3);
        setScore(0);
    };

    return (
        <div className="flappy-bird">
            {!gameStarted && (
                <div className="flappy-countdown">
                    <h2>{countdown}</h2>
                    <p>Trò chơi sẽ bắt đầu sau {countdown} giây</p>
                </div>
            )}

            <div className="flappy-score-display">
                <span className="score-label">Điểm:</span>
                <span className="score-value">{score}</span>
            </div>

            <div className="flappy-instructions">
                <p>Nhấn hoặc chạm để chim bay lên. Tránh các ống nước!</p>
            </div>

            <div className="flappy-container">
                <canvas ref={canvasRef} className="flappy-canvas"></canvas>
            </div>

            {gameOver && (
                <div className="flappy-overlay">
                    <div className="flappy-message">
                        <h2>Game Over!</h2>
                        <p>Điểm của bạn: {score}</p>
                        <button onClick={restartGame}>Chơi lại</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlappyBird; 