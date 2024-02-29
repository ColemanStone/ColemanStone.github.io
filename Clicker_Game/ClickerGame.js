let score = 0;
const button = document.createElement('clicker-button');
const scoreElement = document.getElementById('score');

button.addEventListener('click', () => {
    score++;
    scoreElement.innerText = score;
});