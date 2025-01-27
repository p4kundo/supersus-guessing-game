const players = ["BLUE", "RED", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BROWN", "WHITE", "CYAN"];
    const impostorsCount = 2;
    let impostors = [];
    let score = 0;
    let round = 1;
    let guessesLeft = 3;
    let correctGuesses = 0;
    let wrongGuesses = 0;
    let consecutiveCorrectGuesses = 0;

    function generateRoles() {
        const allPlayers = [...players];
        allPlayers.sort(() => Math.random() - 0.5);
        impostors = allPlayers.slice(0, impostorsCount);
    }

    function createPlayerCards() {
        const playerContainer = document.getElementById("players");
        playerContainer.innerHTML = "";

        players.forEach((player) => {
            const playerCard = document.createElement("div");
            playerCard.classList.add("col-lg-6", "col-sm-6");
            playerCard.setAttribute("id", `player-${player}`);
            playerCard.innerHTML = `
                <div class="card" style="border-left: 5px solid ${getColorForPlayer(player)};">
                    <div class="card-body d-flex justify-content-between align-items-center" id="card-${player}">
                        <p class="mb-0">${player}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-crosshair" viewBox="0 0 16 16" role="button" style="cursor: pointer;" onclick="handleGuess('${player}')">
                            <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                        </svg>
                    </div>
                </div>
            `;
            playerContainer.appendChild(playerCard);
        });
    }

    function getColorForPlayer(player) {
        const colorMapping = {
            "BLUE": "blue",
            "RED": "red",
            "GREEN": "green",
            "YELLOW": "yellow",
            "ORANGE": "orange",
            "PURPLE": "purple",
            "PINK": "pink",
            "BROWN": "brown",
            "WHITE": "white",
            "CYAN": "cyan"
        };
        return colorMapping[player] || 'gray';
    }

    function handleGuess(player) {
        const isImpostor = impostors.includes(player);
        
        if (isImpostor) {
            score += 10;
            correctGuesses++;
            consecutiveCorrectGuesses++;
            showImpostorStatus(player, true);
        } else {
            wrongGuesses++;
            consecutiveCorrectGuesses = 0;
            showImpostorStatus(player, false);
        }

        guessesLeft--;
        updateScoreDisplay();
        updateGameData(); 
        updateRoundInfo();
        updateCorrectIncorrectDisplay();
        updateAccuracyDisplay();
        disableCard(player);
        checkEndOfRound();
    }

    function showImpostorStatus(player, isImpostor) {
        const cardBody = document.getElementById(`card-${player}`);
        const impostorText = document.createElement('p');
        impostorText.classList.add('impostor-text', 'mb-0');
        impostorText.innerText = isImpostor ? "Impostor" : "Spacecrew";
        impostorText.style.color = isImpostor ? 'red' : 'blue';
        cardBody.appendChild(impostorText);
    }

    function disableCard(player) {
        const playerCard = document.getElementById(`player-${player}`);
        const icon = playerCard.querySelector('svg');
        playerCard.classList.add("disabled-card");
        if (icon) {
            icon.style.display = "none";
        }
    }

    function checkEndOfRound() {
        if (consecutiveCorrectGuesses === impostorsCount) {
            disableAllIcons();
            document.getElementById("nextRoundButton").style.display = "block";
        } else if (guessesLeft <= 0) {
            disableAllIcons();
            document.getElementById("nextRoundButton").style.display = "block";
        }
    }

    function disableAllIcons() {
        const icons = document.querySelectorAll('svg');
        icons.forEach(icon => {
            icon.style.pointerEvents = "none";
        });
    }

    function nextRound() {
        round++;
        guessesLeft = 3;
        consecutiveCorrectGuesses = 0;
        generateRoles();
        createPlayerCards();
        updateRoundInfo();
        document.getElementById("nextRoundButton").style.display = "none";
        updateGameData();
    }

    function updateRoundInfo() {
        document.getElementById("roundInfo").innerText = `Round: ${round} | Guesses Left: ${guessesLeft}`;
    }

    function updateScoreDisplay() {
        document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    }

    function updateCorrectIncorrectDisplay() {
        document.getElementById("correctIncorrectDisplay").innerText = `Correct Guesses: ${correctGuesses} | Wrong Guesses: ${wrongGuesses}`;
    }

    function updateAccuracyDisplay() {
        const totalGuesses = correctGuesses + wrongGuesses;
        const accuracy = totalGuesses > 0 ? ((correctGuesses / totalGuesses) * 100).toFixed(2) : 0;
        document.getElementById("accuracyDisplay").innerText = `Accuracy: ${accuracy}%`;
    }

    function updateGameData() {
        const gameData = {
            score: score,
            round: round,
            guessesLeft: guessesLeft,
            correctGuesses: correctGuesses,
            wrongGuesses: wrongGuesses
        };
        document.cookie = `gameData=${JSON.stringify(gameData)}; path=/;`;
    }

    window.onload = function() {
        const gameData = getGameDataFromCookies();
        if (gameData) {
            score = gameData.score;
            round = gameData.round;
            guessesLeft = gameData.guessesLeft;
            correctGuesses = gameData.correctGuesses;
            wrongGuesses = gameData.wrongGuesses;
        }

        generateRoles();
        createPlayerCards();
        updateScoreDisplay();
        updateRoundInfo();
        updateCorrectIncorrectDisplay();
        updateAccuracyDisplay();
    }

    function getGameDataFromCookies() {
        const match = document.cookie.match(/gameData=([^;]+)/);
        if (match) {
            return JSON.parse(match[1]);
        }
        return null;
    }
