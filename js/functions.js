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

