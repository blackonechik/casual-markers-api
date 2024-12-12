const express = require('express');
const cors = require('cors'); // Импортируем CORS
const app = express();
const port = 3000;

// Данные маркеров
const gData = [
  {
    lat: 37.7749, // Широта
    lng: -122.4194, // Долгота
    size: 40, // Размер маркера
    color: "red", // Цвет маркера
    title: "Сан-Франциско",
    description: "20 января - 3 марта 2028",
    url: "https://example.com/san-francisco", // Ссылка, связанная с маркером
  },
];

// Включаем CORS для всех запросов
app.use(cors()); 

// Роут для получения маркеров
app.get('/api/markers', (req, res) => {
  res.json(gData); // Отправляем данные маркеров в формате JSON
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
