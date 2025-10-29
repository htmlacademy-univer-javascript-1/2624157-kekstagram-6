// Исправляем импорт Pristine
import './vendor/pristine/pristine.js';
import { initImageScale, resetScale } from './image-scale.js';

// Импортируем Pristine как обычный скрипт (через CDN или локально)
// Временно отключим импорт, чтобы проверить работу

const form = document.querySelector('.img-upload__form');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const fileInput = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const submitButton = form.querySelector('.img-upload__submit');
const previewImage = form.querySelector('.img-upload__preview img');
const effectsList = form.querySelector('.effects__list');
const effectLevel = document.querySelector('.effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

let isSubmitBlocked = false;
let currentEffect = 'none';
let pristine = null;

// Настройки эффектов
const effects = {
  none: { min: 0, max: 100, step: 1 },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1 },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1 },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1 }
};

// Инициализация слайдера эффектов (нативный вариант)
const initEffectSlider = () => {
  // Создаем нативный input range
  effectLevelSlider.innerHTML = `
    <input type="range"
           class="effect-level__slider-native"
           min="0"
           max="100"
           value="100"
           step="1">
  `;

  const nativeSlider = effectLevelSlider.querySelector('.effect-level__slider-native');

  nativeSlider.addEventListener('input', (evt) => {
    const value = evt.target.value;
    effectLevelValue.value = value;
    applyEffect(value);
  });
};

// Применение эффекта к изображению
const applyEffect = (value) => {
  if (currentEffect === 'none') {
    previewImage.style.filter = 'none';
    return;
  }

  const effect = effects[currentEffect];
  let filterValue = value;

  // Преобразуем значение из диапазона 0-100 в нужный для эффекта
  const normalizedValue = (value / 100) * (effect.max - effect.min) + effect.min;

  if (effect.unit) {
    filterValue = normalizedValue + effect.unit;
  } else {
    filterValue = normalizedValue.toFixed(1);
  }

  previewImage.style.filter = `${effect.filter}(${filterValue})`;
};

// Обновление слайдера при смене эффекта
const updateSliderForEffect = (effect) => {
  const nativeSlider = effectLevelSlider.querySelector('.effect-level__slider-native');
  if (nativeSlider) {
    nativeSlider.value = 100; // Устанавливаем максимальное значение
    applyEffect(100);
  }
};

// Сброс эффектов
const resetEffects = () => {
  currentEffect = 'none';
  previewImage.style.filter = 'none';
  effectLevel.classList.add('hidden');

  // Сброс радиокнопки к оригиналу
  const originalEffect = effectsList.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }

  // Сброс слайдера
  const nativeSlider = effectLevelSlider.querySelector('.effect-level__slider-native');
  if (nativeSlider) {
    nativeSlider.value = 100;
  }
};

// Обработчик изменения эффекта
const onEffectChange = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      effectLevel.classList.add('hidden');
      previewImage.style.filter = 'none';
    } else {
      effectLevel.classList.remove('hidden');
      const effect = effects[currentEffect];
      updateSliderForEffect(effect);
    }
  }
};

// Функция для валидации хэш-тегов
const validateHashtags = (value) => {
  if (value === '') {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/).filter(tag => tag !== '');

  // Проверка максимального количества хэш-тегов
  if (hashtags.length > 5) {
    return false;
  }

  // Проверка каждого хэш-тега
  for (let i = 0; i < hashtags.length; i++) {
    const hashtag = hashtags[i];

    // Хэш-тег должен начинаться с #
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Хэш-тег не может состоять только из #
    if (hashtag === '#') {
      return false;
    }

    // Длина хэш-тега (включая #) не более 20 символов
    if (hashtag.length > 20) {
      return false;
    }

    // Хэш-тег должен содержать только буквы и цифры после #
    if (!/^#[a-zа-яё0-9]+$/i.test(hashtag)) {
      return false;
    }

    // Проверка на повторяющиеся хэш-теги
    if (hashtags.indexOf(hashtag) !== i) {
      return false;
    }
  }

  return true;
};

// Функция для валидации комментария
const validateDescription = (value) => {
  return value.length <= 140;
};

// Инициализация Pristine
const initPristine = () => {
  // Проверяем, доступна ли библиотека Pristine глобально
  if (typeof window.Pristine === 'undefined') {
    console.warn('Pristine not available, validation disabled');
    return null;
  }

  const pristineInstance = new window.Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error-text'
  });

  // Добавляем валидаторы
  pristineInstance.addValidator(
    hashtagsInput,
    validateHashtags,
    'Неправильный формат хэш-тегов. Хэш-теги должны начинаться с #, содержать только буквы и цифры, быть не длиннее 20 символов, максимум 5 хэш-тегов, без повторений.'
  );

  pristineInstance.addValidator(
    descriptionInput,
    validateDescription,
    'Длина комментария не может составлять больше 140 символов.'
  );

  return pristineInstance;
};

// Функция для сброса формы к исходному состоянию
const resetForm = () => {
  form.reset();
  if (pristine) {
    pristine.reset();
  }
  resetScale();
  resetEffects();
};

// Обработчик отправки формы
const onFormSubmit = async (evt) => {
  evt.preventDefault();

  // Проверяем валидацию, если Pristine доступен
  if (pristine && !pristine.validate()) {
    return;
  }

  if (isSubmitBlocked) {
    return;
  }

  isSubmitBlocked = true;
  submitButton.disabled = true;

};

// Функция закрытия формы
const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчик выбора файла
const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;

      // Обновляем превью эффектов
      const effectPreviews = effectsList.querySelectorAll('.effects__preview');
      effectPreviews.forEach(preview => {
        preview.style.backgroundImage = `url(${e.target.result})`;
      });
    };

    reader.readAsDataURL(file);
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
};

// Обработчики для предотвращения закрытия формы при фокусе в полях ввода
const onInputKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

// Обработчик закрытия по Esc
const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
    evt.preventDefault();
    closeForm();
    resetForm();
  }
};

// Обработчик закрытия формы
const onCancelClick = () => {
  closeForm();
  resetForm();
};

// Инициализация модуля
const initFormValidation = () => {
  // Инициализация компонентов
  initImageScale();
  initEffectSlider();
  resetEffects();

  // Инициализация Pristine (если доступна)
  pristine = initPristine();

  // Добавление обработчиков событий
  form.addEventListener('submit', onFormSubmit);
  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelClick);
  document.addEventListener('keydown', onDocumentKeydown);
  effectsList.addEventListener('change', onEffectChange);

  // Добавляем обработчики для полей ввода
  hashtagsInput.addEventListener('keydown', onInputKeydown);
  descriptionInput.addEventListener('keydown', onInputKeydown);
};

export { initFormValidation, resetForm, closeForm };
