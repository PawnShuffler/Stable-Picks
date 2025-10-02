const optionsContainer = document.getElementById('optionsContainer');
const addOptionBtn = document.getElementById('addOptionBtn');
const startRaceBtn = document.getElementById('startRaceBtn');

// Load horse sprite once
const horseImg = new Image();
horseImg.src = "assets/horse.png"; // make sure path is correct

horseImg.onload = () => {
  console.log("Horse image loaded!");
};

addOptionBtn.addEventListener('click', () => {
  addHorseOption();
});

startRaceBtn.addEventListener('click', () => {
  startRace();
});

function addHorseOption() {
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Horse name';

  const betInput = document.createElement('input');
  betInput.type = 'number';
  betInput.placeholder = 'Bet';

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (horseImg.complete) {
    drawHorse(ctx);
  } else {
    horseImg.onload = () => drawHorse(ctx);
  }

  canvas.addEventListener('click', () => {
    drawHorse(ctx);
  });

  optionDiv.appendChild(canvas);
  optionDiv.appendChild(nameInput);
  optionDiv.appendChild(betInput);
  optionsContainer.appendChild(optionDiv);
}

function drawHorse(ctx) {
  ctx.clearRect(0, 0, 64, 64);
  ctx.drawImage(horseImg, 0, 0, 64, 64);

  const imageData = ctx.getImageData(0, 0, 64, 64);
  const data = imageData.data;

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

// Race function
function startRace() {
  const horseOptions = Array.from(optionsContainer.querySelectorAll('.option'));
  if (horseOptions.length === 0) {
    alert("Add some horses first!");
    return;
  }

  const finishLine = 500; // pixels
  const positions = horseOptions.map(() => 0);

  const raceInterval = setInterval(() => {
    horseOptions.forEach((optionDiv, index) => {
      const canvas = optionDiv.querySelector('canvas');
      const speed = 2 + Math.random() * 3;
      positions[index] += speed;

      canvas.style.transform = `translateX(${positions[index]}px)`;

      if (positions[index] >= finishLine) {
        clearInterval(raceInterval);
        const horseName = optionDiv.querySelector('input[type="text"]').value || `#${index+1}`;
        alert(`🏆 Horse ${horseName} wins!`);
      }
    });
  }, 30);
}
