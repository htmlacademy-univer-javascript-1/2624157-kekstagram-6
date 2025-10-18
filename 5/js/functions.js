/*
export function getLengthString(str, length) {
  return str.length <= length;
}

export function getPalindrom(str) {
  // Удаляем все не-буквенные символы (пробелы, знаки препинания) и приводим к нижнему регистру
  const cleanStr = str.replace(/[^a-zа-яё]/gi, '').toLowerCase();
  return cleanStr === cleanStr.split('').reverse().join('');
}

// Функция возвращает объект с тестами для задания 1
export function zadanie1() {
  return {
    test1: {
      str: 'Hello, My name is Ivan',
      lenStr: 10,

      get result() {
        return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу?\nОтвет: ${getLengthString(this.str, this.lenStr)}.`;
      }
    },
    test2: {
      str: 'Hello, My name is Ivan',
      lenStr: 50,

      result: function() {
        return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу? Ответ: ${getLengthString(this.str, this.lenStr)}.`;
      }
    }
  };
}

// Функция возвращает объект с тестами для задания 2
export function zadanie2(){{
  return {
    test1: {
      str: 'топот',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test2: {
      str: 'ДовОд',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test3: {
      str: 'Кекс',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test4: {
      str: 'Лёша на полке клопа нашёл',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
  };
}}
*/
// Функция для преобразования времени в минуты
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}
//Вазвращение true если продолжительность встречи в рамках раб. дня,
//false - выходит за рмаки рабочего дня
function getControlTime(start, end, meet, duration) {
  // Преобразуем все времена в минуты
  const startWork = timeToMinutes(start);
  const endWork = timeToMinutes(end);
  const startMeet = timeToMinutes(meet);
  const endMeet = startMeet + duration;

  // Проверяем, что встреча полностью в пределах рабочего дня
  return startMeet >= startWork && endMeet <= endWork;
}


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
