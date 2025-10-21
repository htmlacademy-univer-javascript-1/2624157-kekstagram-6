// Модуль для полноэкранного просмотра фотографий
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialLikes = bigPicture.querySelector('.social__likes');
const authorAvatar = bigPicture.querySelector('.social__header .social__picture');

let currentPhotoData = null;

// Функция для создания DOM-элемента комментария
const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

// Функция для отрисовки комментариев
const renderComments = (comments) => {
  socialComments.innerHTML = '';
  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  });

  socialComments.appendChild(fragment);
};

// Функция для добавления/удаления лайка
const toggleLike = () => {
  if (!currentPhotoData) return;

  // Увеличиваем/уменьшаем количество лайков
  const hasUserLiked = currentPhotoData.userLiked || false;

  if (hasUserLiked) {
    // Убираем лайк
    currentPhotoData.likes--;
    currentPhotoData.userLiked = false;
    socialLikes.classList.remove('social__likes--active');
  } else {
    // Добавляем лайк
    currentPhotoData.likes++;
    currentPhotoData.userLiked = true;
    socialLikes.classList.add('social__likes--active');
  }

  // Обновляем отображение
  likesCount.textContent = currentPhotoData.likes;

  // Обновляем лайк в миниатюре
  updateThumbnailLike(currentPhotoData.id, currentPhotoData.likes, currentPhotoData.userLiked);
};

// Функция для обновления лайка в миниатюре
const updateThumbnailLike = (photoId, likesCount, isLiked) => {
  const thumbnail = document.querySelector(`[data-photo-id="${photoId}"]`);
  if (thumbnail) {
    const thumbnailLikes = thumbnail.querySelector('.picture__likes');
    thumbnailLikes.textContent = likesCount;

    // Добавляем/убираем класс для визуального отображения лайка
    if (isLiked) {
      thumbnail.classList.add('picture--liked');
    } else {
      thumbnail.classList.remove('picture--liked');
    }
  }
};

// Функция для открытия полноэкранного просмотра
const openFullscreen = (photoData) => {
  currentPhotoData = photoData;

  // Заполняем данные
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;

  // Устанавливаем автора фотографии
  if (photoData.author) {
    // Если есть данные об авторе
    authorAvatar.src = photoData.author.avatar;
    authorAvatar.alt = photoData.author.name;
    socialCaption.textContent = photoData.description;
  } else {
    // Если данных об авторе нет, используем стандартные
    authorAvatar.src = 'img/avatar-1.svg';
    authorAvatar.alt = 'Автор фотографии';
    socialCaption.textContent = photoData.description;
  }

  // Устанавливаем состояние лайка
  if (photoData.userLiked) {
    socialLikes.classList.add('social__likes--active');
  } else {
    socialLikes.classList.remove('social__likes--active');
  }

  // Отрисовываем комментарии
  renderComments(photoData.comments);

  // Скрываем блоки счётчика комментариев и загрузки новых комментариев
  commentCountElement.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // Показываем окно
  bigPicture.classList.remove('hidden');

  // Добавляем класс body для блокировки прокрутки
  document.body.classList.add('modal-open');
};

// Функция для закрытия полноэкранного просмотра
const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentPhotoData = null;
};

// Обработчик закрытия по клику на кнопку
closeButton.addEventListener('click', () => {
  closeFullscreen();
});

// Обработчик закрытия по клавише Esc
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreen();
  }
});

// Обработчик клика на лайк
socialLikes.addEventListener('click', () => {
  toggleLike();
});

// Функция для инициализации (добавляет обработчики клика на миниатюры)
const initFullscreenViewer = () => {
  // Делегирование событий на контейнере миниатюр
  document.querySelector('.pictures').addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (thumbnail) {
      evt.preventDefault();

      // Получаем данные фотографии из свойства photoData
      const photoData = thumbnail.photoData;

      if (photoData) {
        // Инициализируем свойство userLiked если его нет
        if (photoData.userLiked === undefined) {
          photoData.userLiked = false;
        }
        openFullscreen(photoData);
      }
    }
  });
};

export { initFullscreenViewer };
