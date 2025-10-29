console.log('Testing');

import {zadanie1, zadanie2, getControlTime} from './functions.js';
import {similarUsers} from './data.js';
import { visual } from './visualizacia.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidation } from './form-validation.js';
import { initImageScale } from './image-scale.js';

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

/*
'8:00' - начало рабочего дня
'17:30' - конец рабочего дня
'14:00' - начало встречи
90 - продолжительность встречи в минутах
*/
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
console.log('\nМасштабирование изображения инициализировано');
initImageScale();
