let score = 0;
const button = document.getElementById('clicker-button');
const scoreElement = document.getElementById('clicker-counter');

button.addEventListener('click', () => {
    score++;
    scoreElement.innerText = score;
});