const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

const rotationValues = [
    { minDegree: 0, maxDegree: 30, value: 0, label: "100" },
    { minDegree: 31, maxDegree: 90, value: 10000, label: "0" },
    { minDegree: 91, maxDegree: 150, value: 50, label: "10,000" },
    { minDegree: 151, maxDegree: 210, value: 20, label: "20" },
    { minDegree: 211, maxDegree: 270, value: "1M", label: "1M" },
    { minDegree: 271, maxDegree: 330, value: 100, label: "50" },
    { minDegree: 331, maxDegree: 360, value: 0, label: "1" },
  ];
const data = [16, 16, 16, 16, 16, 16];
const pieColors = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#00ffff",
  "#ff00ff",
];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [10000, 0, 100, "1M", 20, 50],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) =>
          context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

const displayResult = (message) => {
  finalValue.innerHTML = `<p>${message}</p>`;
};

let spinCount = 0;

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;

  if (spinCount === 0) {
    finalValue.innerHTML = `<p>Try again</p>`;
  } else if (spinCount === 1) {
    finalValue.innerHTML = `<p>Spinning...</p>`;
  } else if (spinCount === 2) {
    finalValue.innerHTML = `<p>Click On The Spin Button To Start</p>`;
    spinCount = 0;
    showMessage("Resetting spins", 1500);
    return;
  }
  
  function showMessage(message, duration) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.classList.add("custom-message");
    document.body.appendChild(messageElement);
  
    setTimeout(() => {
      messageElement.remove();
      location.reload();
    }, duration);
  }

  let randomDegree = Math.floor(Math.random() * 360);
  let targetDegree = 360 * (spinCount + 1) + randomDegree; 

  let spinDuration = Math.random() * (5000 - 4500) + 4500; 
  let rotationInterval = null;

  const startRotation = () => {
    rotationInterval = window.setInterval(() => {
      myChart.options.rotation += 5;
      myChart.update();

      if (myChart.options.rotation >= targetDegree) {
        if (spinCount === 0){
            window.alert("try again")
        }
        else if (spinCount === 1) {
          let resultValue = valueGenerator(randomDegree);
          startConfetti();
          window.alert(`You won! Value: ${resultValue}`)
          displayResult(`You won! Value: ${resultValue}`);
        }

        clearInterval(rotationInterval);
        spinCount++;
        spinBtn.disabled = false;
      }
    }, 10);
  };

  const stopRotation = () => {
    clearInterval(rotationInterval);
  };

  startRotation();

  setTimeout(() => {
    stopRotation();
    if (spinCount === 1) {
      displayResult("Spin duration ended. Try again.");
      spinCount = 0;
    }
  }, spinDuration);
});

const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      return i.value;
    }
  }
};
