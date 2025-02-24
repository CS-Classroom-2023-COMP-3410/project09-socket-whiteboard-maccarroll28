const socket = io('http://localhost:3000');

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearBoard');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let currentColor = colorPicker.value;
let currentBrushSize = brushSize.value;
let lastX = 0, lastY = 0;

// Update color when user picks a new one
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Update brush size when user adjusts the slider
brushSize.addEventListener('input', (e) => {
    currentBrushSize = e.target.value;
});

// Start drawing when mouse is pressed
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop];
});

// Stop drawing when mouse is released
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

// Track mouse movement and emit drawing actions
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    socket.emit('draw', { lastX, lastY, x, y, color: currentColor, size: currentBrushSize });

    [lastX, lastY] = [x, y];
});

// Listen for drawing events from the server and update the canvas
socket.on('draw', (data) => {
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
});

// Handle board clearing
clearButton.addEventListener('click', () => {
    socket.emit('clearBoard');
});

socket.on('clearBoard', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
