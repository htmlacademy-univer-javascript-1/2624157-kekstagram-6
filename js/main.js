//Константы
const NAMES = [ //Имена
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

const DESCRIPTION = [ //Описание фотографий
  'Закат над горным озером в Альпах',
  'Уличный музыкант играет на саксофоне в Париже',
  'Кофе на деревянном столе утренним светом',
  'Старый книжный магазин с витриной в дождь',
  'Котенок спит в цветочном горшке',
  'Осенний лес с золотыми листьями',
  'Неоновые вывески Токио ночью',
  'Дети запускают воздушного змея на пляже',
  'Архитектурные детали старинного собора',
  'Макросъемка капель росы на паутине',
  'Рыночный ряд со специями в Марракеше',
  'Снежные вершины Гималаев на рассвете',
  'Портрет пожилого человека с морщинами мудрости',
  'Винтажный автомобиль на пустынной дороге',
  'Подводный мир кораллового рифа',
  'Уличное граффити в берлинском районе',
  'Семейный пикник в цветущем саду',
  'Огни большого города с высоты птичьего полета',
  'Рыбак в лодке на туманном озере',
  'Библиотека с высокими деревянными стеллажами'
];

const COMMENTS = [ //Комментарии
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const SIMILAR_USERS_COUNT = 25; //Кол-во создаваемых пользователей (для теста)
const SIMILAR_URL_COUNT = 6; //Кол-во URL аватаров (для теста)
const MAX_COUNT_COMMENTS = 30; //Маакс. кол-во комментариев на 1 аватар

//Функция последовательной генерации
function createIdGenerator () {
  let lastGeneratedId = 0;

  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

//Функция генерации случайных чисел из указанного диапазона, далее - ФСЧ
function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

//Функция ФСЧ без повторения значений
function createRandomIdFromRangeGenerator (min, max) {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      console.error('Перебраны все числа из диапазона от ' + min + ' до ' + max);
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
}

const generateId = createRandomIdFromRangeGenerator(1, SIMILAR_USERS_COUNT);//Случайное Id от 1 до 25 включительно без повторений
const generateURLId = createRandomIdFromRangeGenerator(1, SIMILAR_USERS_COUNT);//Случайное Id URL от 1 до 25 включительно без повторений
const generateCommentsId = createIdGenerator();//Последовательное изменение Id комментариев
const generateCountComments = createRandomIdFromRangeGenerator(0, MAX_COUNT_COMMENTS);//Случайное кол-во комментариев от 0 до 30
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];//Cлучайный элемент из списка

//Содание объекта "Комментарий"
const createComments = () => ({
  avatar: `img/avatar-${getRandomInteger(1, SIMILAR_URL_COUNT)}.svg`, //Уникальный аватар
  message: `${getRandomArrayElement(COMMENTS)}`, //Какое-то сообщение
  name: `${getRandomArrayElement(NAMES)}`, //Какое-то имя
  id: generateCommentsId(), //Id - поеследовательное Id
});

//Cоздания объекта "Пользователь"
const createUsers = () => ({
  id: generateId(), //Id - уникальное
  url: `photos/${generateURLId()}.jpg`, // Фото - уникальное
  description: `${getRandomArrayElement(DESCRIPTION)}`, // Описание фото - любое
  likes: getRandomInteger(15, 200), // Кол-во лайков: от 15 до 200 включительно
  comments: Array.from({length: generateCountComments()}, createComments), //массив комментариев
});

const similarUsers = Array.from({length: SIMILAR_USERS_COUNT}, createUsers);//Создание массива из пользователей

console.log('\n\nЗадание 4');
console.log(similarUsers);
