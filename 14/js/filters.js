// filters.js
import { visual } from './visualizacia.js';

let currentPhotos = [];
let currentFilter = 'default';
let timeoutId = null;

// Функции фильтрации
const FilterFunctions = {
  default: (photos) => {
    // Проверяем, что photos - массив
    if (!Array.isArray(photos)) {
      console.error('Photos is not an array:', photos);
      return [];
    }
    return photos;
  },

  random: (photos) => {
    // Проверяем, что photos - массив
    if (!Array.isArray(photos)) {
      console.error('Photos is not an array:', photos);
      return [];
    }
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  },

  discussed: (photos) => {
    // Проверяем, что photos - массив
    if (!Array.isArray(photos)) {
      console.error('Photos is not an array:', photos);
      return [];
    }
    return [...photos].sort((a, b) => b.comments.length - a.comments.length);
  }
};

// Функция применения фильтра с устранением дребезга
const applyFilter = (filterType) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    currentFilter = filterType;

    // Проверяем, что currentPhotos - массив
    if (!Array.isArray(currentPhotos)) {
      console.error('Current photos is not an array:', currentPhotos);
      return;
    }

    const filteredPhotos = FilterFunctions[filterType](currentPhotos);
    visual(filteredPhotos);
  }, 500);
};

// Функция активации кнопки фильтра
const activateFilterButton = (button) => {
  // Убираем активный класс у всех кнопок
  document.querySelectorAll('.img-filters__button').forEach(btn => {
    btn.classList.remove('img-filters__button--active');
  });

  // Добавляем активный класс текущей кнопке
  button.classList.add('img-filters__button--active');
};

// Инициализация фильтров
const initFilters = (photosData) => {
  const filtersContainer = document.querySelector('.img-filters');
  const filterButtons = document.querySelectorAll('.img-filters__button');

  // Проверяем, что photosData - массив
  if (!Array.isArray(photosData)) {
    console.error('Photos data is not an array:', photosData);
    return;
  }

  // Сохраняем исходные данные
  currentPhotos = photosData;

  // Показываем блок фильтров
  filtersContainer.classList.remove('img-filters--inactive');

  // Добавляем обработчики для кнопок фильтров
  filterButtons.forEach(button => {
    button.addEventListener('click', (evt) => {
      const filterType = evt.target.id.replace('filter-', '');
      activateFilterButton(evt.target);
      applyFilter(filterType);
    });
  });
};

export { initFilters };
