const TEST_MODE = 'testMode';
const CACHE_KEY_PLANT = 'plant';
const DAY_IN_MS = 1000 * 60 * 60 * 24;;
const MIN_IN_MS = 1000 * 60;
const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';
const EVENT_CLICK = 'click';
const END_PLANT_INDEX = 7;
const START_PLANT_INDEX = 1;
const DEAD_PLANT_INDEX = 0;
const PLANT_SOURCES = {
    0: './assets/day0.png',
    1: './assets/day1.png',
    2: './assets/day2.png',
    3: './assets/day3.png',
    4: './assets/day4.png',
    5: './assets/day5.png',
    6: './assets/day6.png',
    7: './assets/day7.mp4'
};

document.addEventListener('DOMContentLoaded', () => {
    const imageElement = document.getElementById('plantImage');
    const videoElement = document.getElementById('plantVideo');
    const restartButton = document.getElementById('restartButton');

    function isTestMode() {
        return localStorage.getItem(TEST_MODE) === 'true';
    }

    function getPlantCache() {
        try {
            const plant = localStorage.getItem(CACHE_KEY_PLANT);
            return plant ? JSON.parse(plant) : null;
        } catch (error) {
            console.error('Error parsing plant data:', error);
            return null;
        }
    }

    function setPlantCache(plant) {
        try {
            localStorage.setItem(CACHE_KEY_PLANT, JSON.stringify(plant));
        } catch (error) {
            console.error('Error storing plant data:', error);
        }
    }

    function getTodayTimestamp() {
        return new Date().getTime();
    }

    function displayPlant(day) {
        if (day === END_PLANT_INDEX) {
            imageElement.style.display = DISPLAY_NONE;
            videoElement.style.display = DISPLAY_BLOCK;
            videoElement.src = PLANT_SOURCES[day];
            videoElement.play();
            restartButton.style.display = DISPLAY_BLOCK;
        } else {
            videoElement.style.display = DISPLAY_NONE;
            imageElement.style.display = DISPLAY_BLOCK;
            imageElement.src = PLANT_SOURCES[day];
        }
    }

    function getDaysDifference(todayTimestamp, lastVisitedTimestamp) {
        const oneDay = isTestMode() ? MIN_IN_MS: DAY_IN_MS;
        return Math.floor(Math.abs(todayTimestamp - lastVisitedTimestamp) / oneDay);
    }

    function checkPlantDay() {
        const today = getTodayTimestamp();
        const plant = getPlantCache();

        if (!plant) {
            const newPlant = { currentDay: START_PLANT_INDEX, lastVisited: today };
            displayPlant(newPlant.currentDay);
            setPlantCache(newPlant);
            return;
        }

        if (plant.currentDay == END_PLANT_INDEX) {
            displayPlant(plant.currentDay);
            return;
        }

        const daysDifference = getDaysDifference(today, plant.lastVisited);

        if (daysDifference === 0) {
            displayPlant(plant.currentDay);
        } else if (daysDifference === 1) {
            const newPlant = { currentDay: plant.currentDay + 1, lastVisited: today };
            displayPlant(newPlant.currentDay);
            setPlantCache(newPlant);
        } else {
            displayPlant(DEAD_PLANT_INDEX);
            restartButton.style.display = DISPLAY_BLOCK;
        }
    }

    function toggleTestMode() {
        const newMode = !isTestMode();
        localStorage.setItem(TEST_MODE, newMode);
        alert("Test mode: " + newMode);
    }

    let lastTapTime = 0;
    secretButton.addEventListener(EVENT_CLICK, () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 300) { // Double-tap within 300ms
            toggleTestMode();
        }
        lastTapTime = currentTime;
    });

    restartButton.addEventListener(EVENT_CLICK, () => {
        const newPlant = { currentDay: 1, lastVisited: getTodayTimestamp() };
        setPlantCache(newPlant);
        displayPlant(newPlant.currentDay);
        restartButton.style.display = DISPLAY_NONE;
    });

    checkPlantDay();
});
