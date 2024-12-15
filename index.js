import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

const markerSvg = `<svg viewBox="-4 0 36 36">
        <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
        <circle fill="white" cx="14" cy="14" r="7"></circle>
      </svg>`;

const activeTooltips = new Set(); // Множество для отслеживания активных тултипов

const N = 1;
const gData = [{
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: 30,
  color: "red",
  title: `Амур и Колыма`,
  description: `4 - 15 августа 2024 года`,
  url: `https://beta.rcb.ru/amur-i-kolyma`,
}];

const Globe = new ThreeGlobe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
  .htmlElementsData(gData)
  .htmlElement((d) => {
    const el = document.createElement("div");
    el.className = "marker";
    el.innerHTML = markerSvg;
    console.log("Создан маркер:", el); // Добавьте лог
    el.style.color = d.color;
    el.style.width = `${d.size}px`;
    el.style.pointerEvents = "auto";

    // Создаем тултип
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(255, 255, 255, 0.9)";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.borderRadius = "5px";
    tooltip.style.padding = "10px";
    tooltip.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    tooltip.style.display = "none"; // Скрываем по умолчанию
    tooltip.style.zIndex = "10";

    // Добавляем контент тултипа
    tooltip.innerHTML = `
            <div class="tooltip-i">
              <h3>${d.title}</h3>
              <p>${d.description}</p>
              <button>Перейти</button>
            </div>
          `;

    // Добавляем кнопку перехода
    const button = tooltip.querySelector("button");
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Предотвращаем всплытие
      window.open(d.url, "_blank"); // Открываем ссылку в новой вкладке
    });

    // Добавляем тултип в элемент маркера
    el.appendChild(tooltip);

    // Обрабатываем событие клика
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Останавливаем всплытие событий

      // Закрываем другие активные тултипы
      activeTooltips.forEach((t) => (t.style.display = "none"));
      activeTooltips.clear();

      // Показываем тултип
      tooltip.style.display = "block";
      tooltip.style.left = `${e.offsetX + 10}px`; // Смещаем тултип относительно курсора
      tooltip.style.top = `${e.offsetY + 10}px`;

      // Добавляем тултип в активные
      activeTooltips.add(tooltip);
    });
    console.log(el);
    return el;
  });

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
camera.position.z = 290;

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
