let score = 0;
const button = document.getElementById('clicker-button');
const scoreElement = document.getElementById('clicker-counter');

button.addEventListener('click', () => {
    console.log('Button was clicked!');
    score++;
    scoreElement.innerText = score;
    console.log('Score was updated to', score);
});