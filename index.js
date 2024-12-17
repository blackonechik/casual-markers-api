import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="white" cx="14" cy="14" r="7"></circle>
      </svg>`;

const container = document.getElementById("globeViz");

const gData = [
  {
    lat: 50.2906,
    lng: 127.5272,
    size: 24,
    color: "red",
    title: `Амур и Колыма`,
    description: `4 - 15 августа 2024 года`,
    url: `https://beta.rcb.ru/amur-i-kolyma`,
  },
  {
    lat: 64.7337,
    lng: 177.5089,
    size: 24,
    color: "red",
    title: `Чукотка`,
    description: `14 - 25 августа 2023 года`,
    url: `https://beta.rcb.ru/cukotka`,
  },
];

const tooltipContainer = document.createElement("div");
tooltipContainer.className = "tooltip-container";
container.appendChild(tooltipContainer);

const Globe = new ThreeGlobe()
  .globeImageUrl("https://blackonechik.github.io/casual-markers-api/map-big.webp")
  .bumpImageUrl("https://blackonechik.github.io/casual-markers-api/earth-topology.webp")
  .htmlElementsData(gData)
  .htmlElement((d) => {
    const el = document.createElement("div");
    el.className = "marker";
    el.innerHTML = markerSvg;
    el.style.color = d.color;
    el.style.width = `${d.size}px`;
    el.style.pointerEvents = "auto";

    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      tooltipContainer.innerHTML = `
        <h3 class="tooltip-title">${d.title}</h3>
        <p class="tooltip-description">${d.description}</p>
        <a href="${d.url}" target="_blank">Перейти</a>
      `;

      tooltipContainer.style.display = "flex";
    });

    return el;
  });

document.addEventListener("click", (e) => {
  if (!tooltipContainer.contains(e.target)) {
    tooltipContainer.style.display = "none"; // Скрываем тултип
  }
});

const renderers = [new THREE.WebGLRenderer(), new CSS2DRenderer()];

renderers.forEach((r, idx) => {
  r.domElement.style.position = "absolute";
  r.domElement.style.pointerEvents = idx > 0 ? "none" : "auto";
  container.appendChild(r.domElement);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xffffff, 2));
const camera = new THREE.PerspectiveCamera();
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
camera.position.z = 290;

const tbControls = new TrackballControls(camera, renderers[0].domElement);
tbControls.noPan = true;
tbControls.dynamicDampingFactor = 0.2;
tbControls.enabled = true;
tbControls.minDistance = 101;
tbControls.rotateSpeed = 1.4;
tbControls.zoomSpeed = 0.8;

Globe.setPointOfView(camera.position, Globe.position);

// Добавляем обработчик событий для TrackballControls
tbControls.addEventListener("change", () => {
  Globe.setPointOfView(camera.position, Globe.position);
});

function resizeRenderer() {
  renderers.forEach((r) =>
    r.setSize(container.clientWidth, container.clientHeight)
  );
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

// Добавляем кнопку для выравнивания глобуса
const resetButton = document.createElement("button");
resetButton.textContent = "Reset View";
resetButton.className = "reset-button";
resetButton.style.position = "absolute";
resetButton.style.bottom = "10px";
resetButton.style.right = "10px";
resetButton.style.padding = "10px";
resetButton.style.background = "#007BFF";
resetButton.style.color = "white";
resetButton.style.border = "none";
resetButton.style.borderRadius = "5px";
resetButton.style.cursor = "pointer";
resetButton.style.zIndex = "10";
container.appendChild(resetButton);

resetButton.addEventListener("click", () => {
  const targetUp = { x: 0, y: 1, z: 0 }; // Целевой "верхний" вектор камеры
  const targetPosition = { x: 0, y: 0, z: camera.position.z }; // Целевая позиция камеры

  const duration = 1000; // Длительность анимации в миллисекундах
  const startTime = performance.now();

  const startUp = { ...camera.up }; // Текущий "верхний" вектор камеры
  const startPosition = { ...camera.position }; // Текущее положение камеры

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1

    // Линейная интерполяция (lerp) для "верхнего" вектора камеры
    camera.up.set(
      startUp.x + (targetUp.x - startUp.x) * progress,
      startUp.y + (targetUp.y - startUp.y) * progress,
      startUp.z + (targetUp.z - startUp.z) * progress
    );

    // Линейная интерполяция (lerp) для позиции камеры
    camera.position.set(
      startPosition.x + (targetPosition.x - startPosition.x) * progress,
      startPosition.y + (targetPosition.y - startPosition.y) * progress,
      startPosition.z + (targetPosition.z - startPosition.z) * progress
    );

    camera.lookAt(0, 0, 0); // Обновляем направление камеры
    tbControls.update(); // Обновляем управление

    if (progress < 1) {
      requestAnimationFrame(animate); // Продолжаем анимацию
    }
  }

  requestAnimationFrame(animate); // Запускаем анимацию
});


(function animate() {
  tbControls.update();
  renderers.forEach((r) => r.render(scene, camera));
  requestAnimationFrame(animate);
})();
