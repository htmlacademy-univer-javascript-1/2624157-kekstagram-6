// Функция для создания DOM-элемента фотографии на основе шаблона
const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const thumbnailElement = template.cloneNode(true);

  const image = thumbnailElement.querySelector('.picture__img');
  const comments = thumbnailElement.querySelector('.picture__comments');
  const likes = thumbnailElement.querySelector('.picture__likes');

  image.src = photoData.url;
  image.alt = photoData.description;
  comments.textContent = photoData.comments.length;
  likes.textContent = photoData.likes;

  // Сохраняем ВСЕ данные фотографии для использования в полноэкранном режиме
  thumbnailElement.photoData = photoData;

  // Добавляем data-атрибут для поиска миниатюры по ID
  thumbnailElement.dataset.photoId = photoData.id;

  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const visual = (photosData) => {
  const container = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  // Очищаем контейнер перед добавлением новых элементов
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  // Создаем и добавляем миниатюры в fragment
  photosData.forEach((photoData) => {
    // Инициализируем свойство userLiked если его нет
    if (photoData.userLiked === undefined) {
      photoData.userLiked = false;
    }

    const thumbnailElement = createThumbnailElement(photoData);
    fragment.appendChild(thumbnailElement);
  });

  // Добавляем все элементы в контейнер за одну операцию
  container.appendChild(fragment);
};

export { visual };
