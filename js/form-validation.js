import './vendor/pristine/pristine.js';
import { initImageScale, resetScale } from './image-scale.js';
import './vendor/nouislider/nouislider.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

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
const scaleControl = document.querySelector('.scale__control--value');

let isSubmitBlocked = false;
let currentEffect = 'none';
let slider = null;
let pristine = null;

// Настройки эффектов
const effects = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' }
};

// Инициализация слайдера эффектов с noUiSlider
const initEffectSlider = () => {
  // Скрываем слайдер по умолчанию
  effectLevel.classList.add('hidden');

  slider = noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        return value;
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  // Обработчик изменения значения слайдера
  slider.on('update', (values) => {
    const value = values[0];
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

  // Преобразуем значение из диапазона 0-100 в нужный для эффекта
  const normalizedValue = (value / 100) * (effect.max - effect.min) + effect.min;
  let filterValue;

  if (effect.unit) {
    filterValue = `${normalizedValue.toFixed(1)}${effect.unit}`;
  } else {
    filterValue = normalizedValue.toFixed(1);
  }

  previewImage.style.filter = `${effect.filter}(${filterValue})`;
};

// Обновление слайдера при смене эффекта
const updateSliderForEffect = (effectName) => {
  if (slider) {
    const effect = effects[effectName];

    // Для эффектов кроме "none" показываем слайдер
    if (effectName === 'none') {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }

    // Устанавливаем начальное значение
    slider.set(100);
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
  if (slider) {
    slider.set(100);
  }
};

const blockSubmitButton = () => {
  isSubmitBlocked = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  isSubmitBlocked = false;
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

// Обработчик изменения эффекта
const onEffectChange = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;
    updateSliderForEffect(currentEffect);
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
  fileInput.value = '';
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

  blockSubmitButton();

  try {
    // Собираем данные формы
    const formData = new FormData(form);

    // Добавляем данные об эффекте и масштабе
    //formData.append('scale', scaleControl.value);
    //formData.append('effect', currentEffect);
    //formData.append('effectLevel', effectLevelValue.value);

    console.log('Отправка формы на сервер...');
    await sendData(formData);

    console.log('Форма успешно отправлена');
    showSuccessMessage();
    closeForm();
    resetForm();

  } catch (error) {
    console.error('Ошибка отправки формы:', error);
    showErrorMessage();
  } finally {
    unblockSubmitButton();
  }
};

// Функция закрытия формы
const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const showLoadError = (message) => {
  alert(message);
};

// Функция для загрузки пользовательской фотографии
const loadUserPhoto = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;

      // Обновляем превью эффектов
      const effectPreviews = effectsList.querySelectorAll('.effects__preview');
      effectPreviews.forEach(preview => {
        preview.style.backgroundImage = `url(${e.target.result})`;
      });

      resolve(e.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Ошибка загрузки файла'));
    };

    reader.readAsDataURL(file);
  });
};

// Обработчик выбора файла
const onFileInputChange = async () => {
  const file = fileInput.files[0];
  console.log('Выбран файл:', file); // ДЛЯ ОТЛАДКИ

  if (!file) {
    console.log('Файл не выбран'); // ДЛЯ ОТЛАДКИ
    return;
  }
  // Проверяем тип файла
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showLoadError('Пожалуйста, выберите файл изображения (JPEG, PNG, GIF, WebP)');
    fileInput.value = '';
    return;
  }

  // Проверяем размер файла (например, не более 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    showLoadError('Размер файла не должен превышать 5MB');
    fileInput.value = '';
    return;
  }

  try {
    await loadUserPhoto(file);
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    // Сбрасываем масштаб и эффекты для новой фотографии
    resetScale();
    resetEffects();

  } catch (error) {
    console.error('Ошибка загрузки фотографии:', error);
    showLoadError('Не удалось загрузить фотографию');
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
