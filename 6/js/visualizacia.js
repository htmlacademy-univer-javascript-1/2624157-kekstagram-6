// Функция для создания DOM-элемента фотографии на основе шаблона
const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');//Ищем шаблон
  const thumbnailElement = template.cloneNode(true);//Клонируем

  const image = thumbnailElement.querySelector('.picture__img');//Ищем компоненты внутри шаблона
  const comments = thumbnailElement.querySelector('.picture__comments');
  const likes = thumbnailElement.querySelector('.picture__likes');

  image.src = photoData.url;//Загружаем данные
  image.alt = photoData.description;
  comments.textContent = photoData.comments.length;
  likes.textContent = photoData.likes;

  // Добавляем данные для дальнейшего использования
  thumbnailElement.photoData = photoData;
  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const visual = (photosData) => {
  const container = document.querySelector('.pictures');//Ищем место для хранения фото
  const fragment = document.createDocumentFragment();

  // Очищаем контейнер перед добавлением новых элементов
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  // Создаем и добавляем миниатюры в fragment
  photosData.forEach((photoData) => {
    const thumbnailElement = createThumbnailElement(photoData);
    fragment.appendChild(thumbnailElement);
  });

  // Добавляем все элементы в контейнер за одну операцию
  container.appendChild(fragment);
};

export { visual };
