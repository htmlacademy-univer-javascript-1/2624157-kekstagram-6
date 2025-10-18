console.log('Testing');
import {zadanie1, zadanie2} from './functions.js';
import {similarUsers} from './data.js';
//import { similarUsers } from './data.js';

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
