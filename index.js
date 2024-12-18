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
    size: 20,
    color: "red",
    title: `Амур и Колыма`,
    description: `4 - 15 августа 2024 года`,
    url: `https://beta.rcb.ru/amur-i-kolyma`,
  },
  {
    lat: 64.7337,
    lng: 177.5089,
    size: 20,
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
resetButton.classList.add("reset-button");

// Добавление SVG элемента внутри кнопки
resetButton.innerHTML = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="#FF0000"/>
  <path d="M16 7.79799C21.8234 7.79799 26.5454 10.9499 26.5454 14.8283C26.5454 16.7968 25.3269 18.5778 23.3701 19.855C24.6238 18.8356 25.3737 17.5467 25.3737 16.1523C25.3737 12.8247 21.179 10.1414 16 10.1414V13.6566L11.3131 8.96971L16 4.28284V7.79799ZM16 24.202C10.1765 24.202 5.45453 21.0501 5.45453 17.1717C5.45453 15.2032 6.67311 13.4222 8.62988 12.1451C7.37615 13.1645 6.62625 14.4533 6.62625 15.8594C6.62625 19.1754 10.821 21.8586 16 21.8586V18.3434L20.6869 23.0303L16 27.7172V24.202Z" fill="white"/>
</svg>
`;

container.appendChild(resetButton);


resetButton.addEventListener("click", () => {
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  tbControls.update();
});

(function animate() {
  tbControls.update();
  renderers.forEach((r) => r.render(scene, camera));
  requestAnimationFrame(animate);
})();
