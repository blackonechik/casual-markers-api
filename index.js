import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="white" cx="14" cy="14" r="7"></circle>
      </svg>`;

const activeTooltips = new Set(); // Множество для отслеживания активных тултипов

const Globe = new ThreeGlobe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

async function loadMarkers() {
  try {
    const response = await fetch(
      "https://blackonechik.github.io/casual-markers-api/data.json"
    ); // Ваш API-эндпоинт
    const gData = await response.json(); // Получаем данные из API

    Globe.htmlElementsData(gData).htmlElement((d) => {
      const el = document.createElement("div");
      el.innerHTML = markerSvg;
      el.style.color = d.color;
      el.style.width = `${d.size}px`;
      el.style.pointerEvents = "auto";


      return el;
    });
  } catch (error) {
    console.error("Ошибка при загрузке данных маркеров:", error);
  }
}

// Загружаем маркеры с API
loadMarkers();

// Скрываем тултипы при клике на карту
document.addEventListener("click", () => {
  activeTooltips.forEach((tooltip) => (tooltip.style.display = "none"));
  activeTooltips.clear();
});

// Настройка рендереров
const container = document.getElementById("globeViz");
const renderers = [new THREE.WebGLRenderer(), new CSS2DRenderer()];
renderers.forEach((r, idx) => {
  r.domElement.style.position = "absolute";
  r.domElement.style.pointerEvents = idx > 0 ? "none" : "auto";
  container.appendChild(r.domElement);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
scene.add(new THREE.DirectionalLight(0xffffff, 2.6 * Math.PI));

const camera = new THREE.PerspectiveCamera();
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
camera.position.z = 350;

const tbControls = new TrackballControls(camera, renderers[0].domElement);
tbControls.noPan = true; // Отключаем панорамирование
tbControls.dynamicDampingFactor = 0.2; // Инерция вращения
tbControls.enabled = true; // Отключаем управление по умолчанию
tbControls.minDistance = 101;
tbControls.rotateSpeed = 1;
tbControls.zoomSpeed = 0.8;

Globe.setPointOfView(camera.position, Globe.position);
tbControls.addEventListener("change", () =>
  Globe.setPointOfView(camera.position, Globe.position)
);

function resizeRenderer() {
  renderers.forEach((r) => {
    r.setSize(container.clientWidth, container.clientHeight);
  });
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
