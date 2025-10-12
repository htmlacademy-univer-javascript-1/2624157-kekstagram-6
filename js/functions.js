/*
  Возвращает true если длина строки меньше или равно числу,
  false - длина строки больше числа
*/
function getLengthString(str, length)
{
  if(str.length <= length)
  {
    return true;
  }
  return false;
}

/*
  Возвращает true если палиндром, false - не палиедром,
  игнорирует регистр и пробелы
*/
function getPalindrom(str) {
  //  /\s/g <- это означает, что все кроме букв
  const cleanStr = str.replaceAll(' ','').toLowerCase();
  return cleanStr === cleanStr.split('').reverse().join('');
}

function writingInConsole(str)
{
  console.log(str);
}

const zadanie1 = {
  test1 : {
    str: 'Hello, My name is Ivan',
    lenStr: 10,

    get result() {
      return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу?\nОтвет: ${getLengthString(this.str, this.lenStr)}.`;
    }
  },
  test2 : {
    str: 'Hello, My name is Ivan',
    lenStr: 50,

    result: function() {
      return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу? Ответ: ${getLengthString(this.str, this.lenStr)}.`;
    }
  }
};

const zadanie2 = {
  test1 : {
    str: 'топот',

    get result(){
      return `Слово(Предложение): ${this.str} - палиднорм? \nОтвет: ${getPalindrom(this.str)}`;
    }
  },
  test2 : {
    str: 'ДовОд',

    get result(){
      return `Слово(Предложение): ${this.str} - палиднорм? \nОтвет: ${getPalindrom(this.str)}`;
    }
  },
  test3 : {
    str: 'Кекс',

    get result(){
      return `Слово(Предложение): ${this.str} - палиднорм? \nОтвет: ${getPalindrom(this.str)}`;
    }
  },
  test4 : {
    str: 'Лёша на полке клопа нашёл',

    get result(){
      return `Слово(Предложение): ${this.str} - палиднорм? \nОтвет: ${getPalindrom(this.str)}`;
    }
  },
};
//Задание 1
writingInConsole('Задание 1');
writingInConsole(zadanie1.test1.result);
writingInConsole(zadanie1.test2.result);
//Задание 2
writingInConsole('\nЗадание 2');
writingInConsole(zadanie2.test1.result);
writingInConsole(zadanie2.test2.result);
writingInConsole(zadanie2.test3.result);
writingInConsole(zadanie2.test4.result);
