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
  {
    lat: 47.2221,
    lng: 39.7188,
    size: 20,
    color: "red",
    title: `Степь`,
    description: `22-27 апреля 2023 года`,
    url: `https://beta.rcb.ru/step`,
  },
  {
    lat: 66.5298,
    lng: 66.6145,
    size: 20,
    color: "red",
    title: `Ямал`,
    description: `22-25 февраля 2023 года`,
    url: `https://beta.rcb.ru/iamal`,
  },
  {
    lat: 55.7558,
    lng: 37.6177,
    size: 20,
    color: "red",
    title: `Глубинная Русь`,
    description: `С 13 августа 2021 года`,
    url: `https://beta.rcb.ru/glubinnaia-rus`,
  },
  {
    lat: 53.7211,
    lng: 91.4423,
    size: 20,
    color: "red",
    title: `Хакасия и Тыва`,
    description: `13 - 23 августа 2022 года`,
    url: `https://beta.rcb.ru/xakasiia-i-tyva`,
  },
  {
    lat: 68.6299,
    lng: 31.7587,
    size: 20,
    color: "red",
    title: `Кольский`,
    description: `3 – 7 ноября 2021 года`,
    url: `https://beta.rcb.ru/kolskii`,
  },
  {
    lat: 67.9915,
    lng: 34.6850,
    size: 20,
    color: "red",
    title: `Гиперборея`,
    description: `28 мая - 5 июня 2021`,
    url: `https://beta.rcb.ru/giperboreia`,
  },
  {
    lat: 51.9578,
    lng: 85.9606,
    size: 20,
    color: "red",
    title: `Горный Алтай`,
    description: `5 – 11 сентября 2020 года`,
    url: `https://beta.rcb.ru/gornyi-altai`,
  },
  {
    lat: 35.6817,
    lng: 139.7539,
    size: 20,
    color: "red",
    title: `Япония`,
    description: `2 – 15 ноября 2019 года`,
    url: `https://beta.rcb.ru/iaponiia`,
  },
  {
    lat: 42.6978,
    lng: 23.3144,
    size: 20,
    color: "red",
    title: `Балканы`,
    description: `19 – 30 апреля 2019 года`,
    url: `https://beta.rcb.ru/balkany`,
  },
  {
    lat: -50.3386,
    lng: -72.2732,
    size: 20,
    color: "red",
    title: `Патагония`,
    description: `27 октября - 10 ноября 2018`,
    url: `https://beta.rcb.ru/patagoniia`,
  },
  {
    lat: 43.0246,
    lng: 44.6817,
    size: 20,
    color: "red",
    title: `Северный Кавказ`,
    description: `21 – 30 апреля 2018`,
    url: `https://beta.rcb.ru/severnyi-kavkaz`,
  },
  {
    lat: 17.9708,
    lng: 102.6189,
    size: 20,
    color: "red",
    title: `Индокитай`,
    description: `29 октября – 11 ноября 2017`,
    url: `https://beta.rcb.ru/indokitai`,
  },
  {
    lat: 53.3402,
    lng: -6.2528,
    size: 20,
    color: "red",
    title: `Шотландия-Ирландия`,
    description: `10 – 18 июня 2017`,
    url: `https://beta.rcb.ru/sotlandiia-irlandiia`,
  },
  {
    lat: -12.0580,
    lng: -77.0359,
    size: 20,
    color: "red",
    title: `Перу-Боливия`,
    description: `29 октября - 12 ноября 2016`,
    url: `https://beta.rcb.ru/peru-boliviia`,
  },
  {
    lat: 44.8162,
    lng: 20.4604,
    size: 20,
    color: "red",
    title: `Югославия`,
    description: `16 - 25 апреля 2016`,
    url: `https://beta.rcb.ru/iugoslaviia`,
  },
  {
    lat: 21.8445,
    lng: 96.6395,
    size: 20,
    color: "red",
    title: `Бирма`,
    description: `30 октября - 9 ноября 2015`,
    url: `https://beta.rcb.ru/birma`,
  },
  {
    lat: -18.9095,
    lng: 47.5253,
    size: 20,
    color: "red",
    title: `Мадагаскар`,
    description: `30 октября - 10 ноября 2014`,
    url: `https://beta.rcb.ru/madagaskar`,
  },
  {
    lat: 64.1471,
    lng: -21.9392,
    size: 20,
    color: "red",
    title: `Исландия`,
    description: `7-17 июня 2014`,
    url: `https://beta.rcb.ru/islandiia`,
  },
  {
    lat: 42.4412,
    lng: 77.2670,
    size: 20,
    color: "red",
    title: `Два озера (Балхаш и Иссык-Куль)`,
    description: `17-27 апреля 2014`,
    url: `https://beta.rcb.ru/twolakes`,
  },
  {
    lat: 56.9468,
    lng: 24.1060,
    size: 20,
    color: "red",
    title: `Прибалтика`,
    description: `15–24 августа 2013`,
    url: `https://beta.rcb.ru/pribaltika`,
  },
  {
    lat: 64.7358,
    lng: 177.5189,
    size: 20,
    color: "red",
    title: `Чукотка`,
    description: `21 - 30 июля 2013`,
    url: `https://beta.rcb.ru/cukotka-2013`,
  },
  {
    lat: 44.4363,
    lng: 26.0990,
    size: 20,
    color: "red",
    title: `Галиция – Трансильвания (Западная Украина – Румыния)`,
    description: `20 - 28 апреля 2013`,
    url: `https://beta.rcb.ru/ukr-rom`,
  },
  {
    lat: -0.2192,
    lng: -78.5097,
    size: 20,
    color: "red",
    title: `Эквадор и Галапагосские острова`,
    description: `21 февраля – 6 марта 2013`,
    url: `https://beta.rcb.ru/ekvador-i-galapagosskie-ostrova`,
  },
  {
    lat: 40.3729,
    lng: 49.8531,
    size: 20,
    color: "red",
    title: `Азербайджан`,
    description: `5-9 сентября 2012`,
    url: `https://beta.rcb.ru/azerbaidzan`,
  },
  {
    lat: 53.0242,
    lng: 158.6435,
    size: 20,
    color: "red",
    title: `Камчатка`,
    description: `3-12 августа 2012`,
    url: `https://beta.rcb.ru/kamcatka`,
  },
  {
    lat: 40.9993,
    lng: 44.6511,
    size: 20,
    color: "red",
    title: `Армения-Грузия`,
    description: `21-29 апреля 2012`,
    url: `https://beta.rcb.ru/armeniia-gruziia`,
  },
  {
    lat: 61.7850,
    lng: 34.3468,
    size: 20,
    color: "red",
    title: `Карелия`,
    description: `17-26 августа 2011`,
    url: `https://beta.rcb.ru/kareliia`,
  },
  {
    lat: 41.3111,
    lng: 69.2797,
    size: 20,
    color: "red",
    title: `Узбекистан`,
    description: `20-30 апреля 2011`,
    url: `https://beta.rcb.ru/uzbekistan`,
  },
  {
    lat: 62.0513,
    lng: 89.1841,
    size: 20,
    color: "red",
    title: `Енисей`,
    description: `14-22 августа 2010`,
    url: `https://beta.rcb.ru/enisei`,
  },
  {
    lat: 53.4053,
    lng: 107.6730,
    size: 20,
    color: "red",
    title: `Лед Байкала`,
    description: `18-24 февраля 2010`,
    url: `https://beta.rcb.ru/led-baikal`,
  },
  {
    lat: 56.1290,
    lng: 40.4066,
    size: 20,
    color: "red",
    title: `Малое золотое кольцо России`,
    description: `9-12 июля 2009`,
    url: `https://beta.rcb.ru/maloe-zolotoe-kolco-rossii`,
  },
  {
    lat: 51.8348,
    lng: 107.5845,
    size: 20,
    color: "red",
    title: `Бурятия-Монголия`,
    description: `12-20 июля 2008`,
    url: `https://beta.rcb.ru/buriatiia-mongoliia`,
  },
  {
    lat: 60.7577,
    lng: 46.3052,
    size: 20,
    color: "red",
    title: `Великий Устюг`,
    description: `6-10 февраля 2008`,
    url: `https://beta.rcb.ru/velikii-ustiug`,
  },
  {
    lat: 61.7850,
    lng: 34.3468,
    size: 20,
    color: "red",
    title: `Карелия`,
    description: `4-7 июля 2007`,
    url: `https://beta.rcb.ru/kareliia-2007`,
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

function latLonToCartesian(lat, lon, radius = 100) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

// Координаты Москвы
const moscowCoords = latLonToCartesian(55.7558, 97.6173, 290);

// Устанавливаем камеру на Москву
camera.position.set(moscowCoords.x, moscowCoords.y, moscowCoords.z);
camera.lookAt(0, 0, 0);
Globe.setPointOfView(camera.position, Globe.position);
tbControls.update();



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
