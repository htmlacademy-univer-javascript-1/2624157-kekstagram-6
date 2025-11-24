console.log('Testing');

import {zadanie1, zadanie2, getControlTime} from './functions.js';
//import {similarUsers} from './data.js';
import { visual } from './visualizacia.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidation } from './form-validation.js';
//import { showErrorMessage } from './messages.js';
import { getData } from './api.js';

// Функция для показа сообщения об ошибке загрузки
const showLoadError = (message) => {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ff6b6b;
    color: white;
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 400px;
  `;

  errorContainer.innerHTML = `
    <p style="margin: 0 0 15px 0; font-size: 16px;">${message}</p>
    <button style="
      background: white;
      color: #ff6b6b;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    ">Понятно</button>
  `;

  document.body.appendChild(errorContainer);

  const closeError = () => {
    errorContainer.remove();
  };

  errorContainer.querySelector('button').addEventListener('click', closeError);
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      closeError();
    }
  });
};

// Загрузка и отображение данных
const loadAndDisplayPhotos = async () => {
  try {
    console.log('Загрузка данных с сервера...');
    const photosData = await getData();

    // Добавляем свойство userLiked для каждого фото
    const photosWithLikes = photosData.map(photo => ({
      ...photo,
      userLiked: false
    }));

    console.log('Данные загружены:', photosWithLikes);
    console.log('Отображение фотографий');
    visual(photosWithLikes);

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    showLoadError(error.message);
  }
};

// Запуск тестовых функций
const runTests = () => {
  const zad1 = zadanie1();
  const zad2 = zadanie2();

  console.log('\nЗадание 1');
  console.log(zad1.test1.result);
  console.log(zad1.test2.result);

  console.log('\nЗадание 2');
  console.log(zad2.test1.result);
  console.log(zad2.test2.result);
  console.log(zad2.test3.result);
  console.log(zad2.test4.result);

  console.log('\nЗадание 5-2');
  console.log(getControlTime('08:00', '17:30', '14:00', 90)); // true
  console.log(getControlTime('8:0', '10:0', '8:0', 120));     // true
  console.log(getControlTime('08:00', '14:30', '14:00', 90)); // false
  console.log(getControlTime('14:00', '17:30', '08:0', 90));  // false
  console.log(getControlTime('8:00', '17:30', '08:00', 900)); // false
};

// Инициализация приложения
const initApp = async () => {
  runTests();

  console.log('\nЗадание 7 - 1');
  await loadAndDisplayPhotos();

  console.log('\nЗадание 8 - 1');
  console.log('Полноэкранный просмотр инициализирован');
  initFullscreenViewer();

  console.log('\nЗадание 9 - 1');
  console.log('Валидация формы инициализирована');
  initFormValidation();
};

// Запуск приложения
initApp();
/*
const zad1 = zadanie1();
const zad2 = zadanie2();
const zad4 = similarUsers();

console.log('\nЗадание 1');
console.log(zad1.test1.result);
console.log(zad1.test2.result);

console.log('\nЗадание 2');
console.log(zad2.test1.result);
console.log(zad2.test2.result);
console.log(zad2.test3.result);
console.log(zad2.test4.result);

console.log('\nЗадание 4');
console.log(zad4);
*/
/*
'8:00' - начало рабочего дня
'17:30' - конец рабочего дня
'14:00' - начало встречи
90 - продолжительность встречи в минутах
*/
/*
console.log('\nЗадание 5-2');
console.log(getControlTime('08:00', '17:30', '14:00', 90)); // true
console.log(getControlTime('8:0', '10:0', '8:0', 120));     // true
console.log(getControlTime('08:00', '14:30', '14:00', 90)); // false
console.log(getControlTime('14:00', '17:30', '08:0', 90));  // false
console.log(getControlTime('8:00', '17:30', '08:00', 900)); // false

console.log('\nЗадание 7 - 1');
console.log('Отображение фотографий');
visual(zad4);

console.log('\nЗадание 8 - 1');
console.log('Полноэкранный просмотр инициализирован');
initFullscreenViewer();

console.log('\nЗадание 9 - 1');
console.log('Валидация формы инициализирована');
initFormValidation();
*/
