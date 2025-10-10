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
let dino2Interval;
let dino3Interval;
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
    document.querySelectorAll(".litak").forEach(b => b.remove());
    document.querySelectorAll(".dino2").forEach(b => b.remove()); // Для ptero
    document.querySelectorAll(".dino3").forEach(b => b.remove()); // Для ptero
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
    birdInterval = setInterval(createBird, 10000);
  
    if (litakInterval) clearInterval(litakInterval);
    litakInterval = setInterval(createLitak, 10000); // Синхронізовано з CSS, але тепер динамічно
  
    if (dino2Interval) clearInterval(dino2Interval);
    dino2Interval = setInterval(createDino2, 6000); // Швидкість з CSS
  
    if (dino3Interval) clearInterval(dino3Interval);
    dino3Interval = setInterval(createDino3, 15000); // Швидкість з CSS
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

    // Уникаємо створення, якщо є кактус
    const activeCactuses = game.querySelectorAll('.cactus');
    if (activeCactuses.length > 0) {
        return;
    }

    const bird = document.createElement("div");
    bird.classList.add("bird");
    game.appendChild(bird);

    let birdLeft = game.offsetWidth;
    const birdTop = 100 + 400; // З твого коду, але перевір — може 150px для низького польоту
    bird.style.top = birdTop + "px";
    bird.style.left = birdLeft + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            bird.remove();
            return;
        }

        birdLeft -= 6;
        bird.style.left = birdLeft + "px";

        const dinoRect = dino.getBoundingClientRect();
        const birdRect = bird.getBoundingClientRect();

        if (
            dinoRect.right > birdRect.left &&
            dinoRect.left < birdRect.right &&
            dinoRect.bottom > birdRect.top &&
            dinoRect.top < birdRect.bottom
        ) {
            endGame();
            return;
        }

        if (birdLeft < -50) {
            score++;
            scoreSpan.textContent = score;
            bird.remove();
            clearInterval(move);
        }
    }, 20);
}

function createLitak() {
    if (gameOver) return;

    // Уникаємо створення, якщо є кактус
    const activeCactuses = game.querySelectorAll('.cactus');
    if (activeCactuses.length > 0) {
        return;
    }

    const litak = document.createElement("div");
    litak.classList.add("litak"); // Змінено на клас, щоб уникнути дублювання id
    game.appendChild(litak);

    let litakLeft = game.offsetWidth;
    const litakTop = 20;
    litak.style.top = litakTop + "px";
    litak.style.left = litakLeft + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            litak.remove();
            return;
        }

        litakLeft -= 5;
        litak.style.left = litakLeft + "px";

        const dinoRect = dino.getBoundingClientRect();
        const litakRect = litak.getBoundingClientRect();

        if (
            dinoRect.right > litakRect.left &&
            dinoRect.left < litakRect.right &&
            dinoRect.bottom > litakRect.top &&
            dinoRect.top < litakRect.bottom
        ) {
            endGame();
            return;
        }

        if (litakLeft < -80) {
            score++;
            scoreSpan.textContent = score;
            litak.remove();
            clearInterval(move);
        }
    }, 20);
}

function createDino2() {
    if (gameOver) return;

    // Уникаємо створення, якщо є кактус
    const activeCactuses = game.querySelectorAll('.cactus');
    if (activeCactuses.length > 0) {
        return;
    }

    const dino2 = document.createElement("div");
    dino2.classList.add("dino2"); // Клас замість id
    game.appendChild(dino2);

    let dino2Left = game.offsetWidth;
    const dino2Top = 20;
    dino2.style.top = dino2Top + "px";
    dino2.style.left = dino2Left + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            dino2.remove();
            return;
        }

        dino2Left -= 6; // Швидкість з CSS (6s інтервал)
        dino2.style.left = dino2Left + "px";

        const dinoRect = dino.getBoundingClientRect();
        const dino2Rect = dino2.getBoundingClientRect();

        if (
            dinoRect.right > dino2Rect.left &&
            dinoRect.left < dino2Rect.right &&
            dinoRect.bottom > dino2Rect.top &&
            dinoRect.top < dino2Rect.bottom
        ) {
            endGame();
            return;
        }

        if (dino2Left < -50) {
            score++;
            scoreSpan.textContent = score;
            dino2.remove();
            clearInterval(move);
        }
    }, 20);
}

function createDino3() {
    if (gameOver) return;

    // Уникаємо створення, якщо є кактус
    const activeCactuses = game.querySelectorAll('.cactus');
    if (activeCactuses.length > 0) {
        return;
    }

    const dino3 = document.createElement("div");
    dino3.classList.add("dino3"); // Клас замість id
    game.appendChild(dino3);

    let dino3Left = game.offsetWidth;
    const dino3Top = 0;
    dino3.style.top = dino3Top + "px";
    dino3.style.left = dino3Left + "px";

    const move = setInterval(() => {
        if (gameOver) {
            clearInterval(move);
            dino3.remove();
            return;
        }

        dino3Left -= 4; // Повільніше для 15s інтервалу
        dino3.style.left = dino3Left + "px";

        const dinoRect = dino.getBoundingClientRect();
        const dino3Rect = dino3.getBoundingClientRect();

        if (
            dinoRect.right > dino3Rect.left &&
            dinoRect.left < dino3Rect.right &&
            dinoRect.bottom > dino3Rect.top &&
            dinoRect.top < dino3Rect.bottom
        ) {
            endGame();
            return;
        }

        if (dino3Left < -50) {
            score++;
            scoreSpan.textContent = score;
            dino3.remove();
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
    clearInterval(litakInterval);
    clearInterval(dino2Interval);
    clearInterval(dino3Interval);
    gameOverText.style.display = "block";

    if (score > highscore) {
        highscore = score;
        highscoreSpan.textContent = highscore;
        localStorage.setItem("highscore", highscore);
    }
}

// Запуск гри
startGame();