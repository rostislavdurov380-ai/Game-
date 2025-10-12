const dino = document.getElementById("dino");
const game = document.querySelector(".game");
const scoreSpan = document.getElementById("score-value");
const highscoreSpan = document.getElementById("highscore-value");
const Time = document.getElementById("Time");
const gameOverText = document.getElementById("game-over-text");

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let seconds = 0;
let gameOver = false;
let timer;
let cactusInterval;
let birdInterval;
let litakInterval;
highscoreSpan.textContent = highscore;

// Стрибок динозавра
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (!gameOver && !dino.classList.contains("jump")) {
            dino.classList.add("jump");
            setTimeout(() => dino.classList.remove("jump"), 600);
        } else if (gameOver) {
            startGame();
        }
    }
});
// Стрибок при дотику (для телефонів)
document.addEventListener("touchstart", () => {
    if (!gameOver && !dino.classList.contains("jump")) {
        dino.classList.add("jump");
        setTimeout(() => dino.classList.remove("jump"), 600);
    } else if (gameOver) {
        startGame();
    }
});


// Старт гри
function startGame() {
    document.querySelectorAll(".cactus").forEach(c => c.remove());
    document.querySelectorAll(".bird").forEach(b => b.remove());
  document.querySelectorAll("litak").forEach(b => b.remove());
    score = 0;
    seconds = 0;
    gameOver = false;
    scoreSpan.textContent = score;
    Time.textContent = "00:00";
    gameOverText.style.display = "none";

    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (!gameOver) {
            seconds++;
            const m = String(Math.floor(seconds / 60)).padStart(2,"0");
            const s = String(seconds % 60).padStart(2,"0");
            Time.textContent = `${m}:${s}`;
        }
    }, 1000);

    if (cactusInterval) clearInterval(cactusInterval);
    cactusInterval = setInterval(createCactus, 1500);

    if (birdInterval) clearInterval(birdInterval);
  birdInterval = setInterval(createBird, 80000);
  
   if (litakInterval) clearInterval(litakInterval);
    litakInterval = setInterval(createlitak, 50000);
}

// Створення кактусів
function createCactus() {
    if (gameOver) return;

    const cactus = document.createElement("div");
    cactus.classList.add("cactus");
    game.appendChild(cactus);

    let cactusLeft = 600;
    cactus.style.left = cactusLeft + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            return;
        }

        cactusLeft -= 5;
        cactus.style.left = cactusLeft + "px";

        const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));

        if (cactusLeft < 80 && cactusLeft > 20 && dinoBottom < 50) {
            endGame();
            return;
        }

        if (cactusLeft < -25) {
            score++;
            scoreSpan.textContent = score;
            cactus.remove();
            clearInterval(move);
        }
    }, 20);
}
function createBird() {
    if (gameOver) return;

    const bird = document.createElement("div");
    bird.classList.add("bird");
    game.appendChild(bird);

    let birdLeft = game.offsetWidth; // старт праворуч
    const birdTop = game.offsetHeight - 70; // птах летить низько, на рівні кактуса
    bird.style.top = birdTop + "px";
    bird.style.left = birdLeft + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            bird.remove();
            return;
        }

        birdLeft -= 6; // рух вліво
        bird.style.left = birdLeft + "px";

        const dinoRect = dino.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();

        // Перевірка колізії
        if (
            dinoRect.right > birdRect.left &&
            dinoRect.left < birdRect.right &&
            dinoRect.bottom > birdRect.top &&
            dinoRect.top < birdRect.bottom
        ) {
            endGame();
return;
        }

        // якщо птах вилетів за межі
        if (birdLeft < -50) {
            score++;
            scoreSpan.textContent = score;
            bird.remove();
            clearInterval(move);
        }
    }, 20);
}




// Кінець гри
function endGame() {
    gameOver = true;
    clearInterval(timer);
    clearInterval(cactusInterval);
    clearInterval(birdInterval);
    gameOverText.style.display = "block";

    if (score > highscore) {
        highscore = score;
        highscoreSpan.textContent = highscore;
        localStorage.setItem("highscore", highscore);
    }
}

// Запуск гри
startGame();

