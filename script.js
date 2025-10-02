const optionsContainer = document.getElementById('optionsContainer');
const addOptionBtn = document.getElementById('addOptionBtn');

// Load horse sprite once
const horseImg = new Image();
horseImg.src = "assets/horse.png"; // correct path

// Wait until image is fully loaded
horseImg.onload = () => {
  console.log("Horse image loaded!");
};

addOptionBtn.addEventListener('click', () => {
  addHorseOption();
});

function addHorseOption() {
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option';

  // Horse name input
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Horse name';

  // Bet input
  const betInput = document.createElement('input');
  betInput.type = 'number';
  betInput.placeholder = 'Bet';

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Draw horse once image is loaded
  if (horseImg.complete) {
    drawHorse(ctx);
  } else {
    horseImg.onload = () => drawHorse(ctx);
  }

  // Recolor horse on click
  canvas.addEventListener('click', () => {
    drawHorse(ctx);
  });

  optionDiv.appendChild(canvas);
  optionDiv.appendChild(nameInput);
  optionDiv.appendChild(betInput);
  optionsContainer.appendChild(optionDiv);
}

function drawHorse(ctx) {
  // Clear canvas
  ctx.clearRect(0, 0, 64, 64);
  // Draw base horse
  ctx.drawImage(horseImg, 0, 0, 64, 64);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, 64, 64);
  const data = imageData.data;

  // Random fur and mane colors
  const furColor = randomColor();
  const maneColor = randomColor();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];

    // Fur = mostly white pixels
    if (r > 200 && g > 200 && b > 200) {
      data[i] = furColor[0];
      data[i+1] = furColor[1];
      data[i+2] = furColor[2];
    }

    // Mane/tail = grayish pixels
    if (r < 180 && g < 180 && b < 180 && r > 50) {
      data[i] = maneColor[0];
      data[i+1] = maneColor[1];
      data[i+2] = maneColor[2];
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function randomColor() {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ];
}
