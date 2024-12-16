import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="white" cx="14" cy="14" r="7"></circle>
      </svg>`;

const container = document.getElementById("globeViz");

const gData = [{
  lat: 50.2906,
  lng: 127.5272,
  size: 20,
  color: "red",
  title: `Амур и Колыма`,
  description: `4 - 15 августа 2024 года`,
  url: `https://beta.rcb.ru/amur-i-kolyma`,
}];

const tooltipContainer = document.createElement("div");
tooltipContainer.className = "tooltip-container";
tooltipContainer.style.position = "absolute";
tooltipContainer.style.bottom = "20px"; // Отступ от нижней части контейнера
tooltipContainer.style.left = "50%";
tooltipContainer.style.transform = "translateX(-50%)";
tooltipContainer.style.background = "rgba(255, 255, 255, 0.9)";
tooltipContainer.style.border = "1px solid #ccc";
tooltipContainer.style.borderRadius = "5px";
tooltipContainer.style.padding = "10px";
tooltipContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
tooltipContainer.style.display = "none"; // Скрываем по умолчанию
tooltipContainer.style.zIndex = "10";
container.appendChild(tooltipContainer);

const Globe = new ThreeGlobe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
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

      tooltipContainer.style.display = "block";
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
scene.add(new THREE.AmbientLight(0xffffff, 6));
const camera = new THREE.PerspectiveCamera();
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
camera.position.z = 290;

const tbControls = new TrackballControls(camera, renderers[0].domElement);
tbControls.noPan = true;
tbControls.dynamicDampingFactor = 0.2;
tbControls.enabled = true;
tbControls.minDistance = 101;
tbControls.rotateSpeed = 2;
tbControls.zoomSpeed = 0.8;

Globe.setPointOfView(camera.position, Globe.position);
tbControls.addEventListener("change", () =>
  Globe.setPointOfView(camera.position, Globe.position)
);

function resizeRenderer() {
  renderers.forEach((r) =>
    r.setSize(container.clientWidth, container.clientHeight)
  );
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

(function animate() {
  tbControls.update();
  renderers.forEach((r) => r.render(scene, camera));
  requestAnimationFrame(animate);
})();
