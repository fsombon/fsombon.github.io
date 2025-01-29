let currentStationIndex = 0;
let attemptsLeft = 3;
let score = 0;
let highScores = [];
let isAdminLoggedIn = false;

// Initialize variables
let stations = [
    { name: "Ayala", image: "./images/ayalaresized.png" },
    { name: "Carriedo", image: "./images/carriedoresized.png" },
    { name: "FTI", image: "./images/ftiresized.png" },
    // Add more stations here
];

// Function to shuffle the stations array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to load a new station
function loadStation() {
    if (currentStationIndex < stations.length) {
        const station = stations[currentStationIndex];
        document.getElementById("station-image").src = station.image;
        document.getElementById("feedback").textContent = "";
        document.getElementById("attempts-left").textContent = attemptsLeft;
    } else {
        endRound();
    }
}

// Function to display high scores
function displayHighScores() {
    const highScoresList = document.getElementById("high-scores-list");
    highScoresList.innerHTML = "";
    highScores.forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${score.name} - ${score.score}`;
        highScoresList.appendChild(li);
    });
    document.getElementById("high-scores").style.display = "block";
}

// Function to save high score
function saveHighScore(name, score) {
    const newScore = { name, score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10); // Keep only the top 10 scores
    localStorage.setItem("highScores", JSON.stringify(highScores));
    displayHighScores();
}

// Function to load high scores from local storage
function loadHighScores() {
    const storedHighScores = localStorage.getItem("highScores");
    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
        displayHighScores();
    }
}

// Function to reset high scores
function resetHighScores() {
    if (confirm("Are you sure you want to reset the high scores?")) {
        let csvContent = "Name,Score\n";
        highScores.forEach((score, index) => {
            csvContent += `${score.name},${score.score}\n`;
        });
        const date = new Date();
        const fileName = `High Scores - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}.csv`;
        try {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' }));
            link.download = fileName;
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
        highScores = [];
        localStorage.removeItem("highScores");
        displayHighScores();
    }
}

// Function to end the round
function endRound() {
    document.getElementById("congrats").textContent = `Thank you for playing! Your score is ${score}.`;
    document.getElementById("name-modal").style.display = "block";
    document.getElementById("player-name").focus();
}

// Load high scores on page load
loadHighScores();

// Load a new station on page load
shuffleArray(stations);
loadStation();

// Add event listener to submit guess button
document.getElementById("submit-guess").addEventListener("click", () => {
    const userGuess = document.getElementById("user-guess").value.trim().toLowerCase();
    const correctAnswer = stations[currentStationIndex].name.toLowerCase();

    if (userGuess === correctAnswer) {
        score++; // Increment score for correct guess
        document.getElementById("feedback").textContent = "Correct! Next station.";
        currentStationIndex++;
        attemptsLeft = 3; // Reset attempts left
        loadStation();
    } else {
        attemptsLeft--;
        document.getElementById("feedback").textContent = "Incorrect! Try again.";
        if (attemptsLeft === 0) {
            document.getElementById("feedback").textContent = `Game Over! The station was ${stations[currentStationIndex].name}.`;
            attemptsLeft = 3; // Reset attempts left
            currentStationIndex++;
            loadStation();
        }
    }
    document.getElementById("attempts-left").textContent = attemptsLeft;
    document.getElementById("user-guess").value = "";
});

// Add event listener to submit name button
document.getElementById("submit-name").addEventListener("click", () => {
    const playerName = document.getElementById("player-name").value.trim();
    if (playerName) {
        saveHighScore(playerName, score);
        document.getElementById("name-modal").style.display = "none";
        document.getElementById("player-name").value = "";
        shuffleArray(stations);
        currentStationIndex = 0;
        score = 0;
        loadStation();
    }
});

// Add event listener to login button
document.getElementById("login-button").addEventListener("click", () => {
    document.getElementById("login-modal").style.display = "block";
});

// Add event listener to login submit button
document.getElementById("login-submit").addEventListener("click", () => {
    const adminPassword = document.getElementById("admin-password").value.trim();
    if (adminPassword === "admin") {
        isAdminLoggedIn = true;
        document.getElementById("add-station-button").style.display = "block";
        document.getElementById("reset-high-scores").style.display = "block";
        document.getElementById("login-button").style.display = "none";
        document.getElementById("logout-button").style.display = "block";
        document.getElementById("login-modal").style.display = "none";
        document.getElementById("admin-password").value = "";
    } else {
        alert("Incorrect password!");
    }
});

// Add event listener to logout button
document.getElementById("logout-button").addEventListener("click", () => {
    isAdminLoggedIn = false;
    document.getElementById("add-station-button").style.display = "none";
    document.getElementById("reset-high-scores").style.display = "none";
    document.getElementById("login-button").style.display = "block";
    document.getElementById("logout-button").style.display = "none";
}); 

// Add event listener to reset high scores button
document.getElementById("reset-high-scores").addEventListener("click", () => {
    if (isAdminLoggedIn) {
        resetHighScores();
    } else {
        alert("You must be logged in as admin to reset high scores!");
    }
});

document.getElementById("add-station-button").addEventListener("click", () => {
    document.getElementById("add-station-modal").style.display = "block";
});

document.getElementById("add-station-submit").addEventListener("click", () => {
    const stationName = document.getElementById("station-name").value.trim();
    const stationImage = document.getElementById("station-image-upload").files[0];

    if (stationName && stationImage) {
        const reader = new FileReader();
        reader.onload = () => {
            const station = {
                name: stationName,
                image: reader.result,
            };
            stations.push(station);
            document.getElementById("add-station-modal").style.display = "none";
            document.getElementById("station-name").value = "";
            document.getElementById("station-image-upload").value = "";
        };
        reader.readAsDataURL(stationImage);
    } else {
        alert("Please enter both station name and image.");
    }
});



document.getElementById("toggle-side-menu").addEventListener("click", () => {
    const sideMenu = document.querySelector(".side-menu");
    if (sideMenu.style.left === "-200px" || sideMenu.style.left === "") {
        sideMenu.style.left = "0px";
    } else {
        sideMenu.style.left = "-200px";
    }
    sideMenu.classList.toggle("minimized");
});

document.getElementById("close-add-station-modal").addEventListener("click", () => {
    document.getElementById("add-station-modal").style.display = "none";
});



