(function () {

  // Реализовано:
  // 1. Получение данных с сервера
  // 2. Получение карточек с сервера
  // 3. Обновление данных (+ аватар)
  // 4. Добавление \ отображение \ снятие лайка
  // 5. Добавление \ удаление карточки
  // 6. Иконка удаления только на своей карточке, своя карточка выделяется.
  // 7. Кнопки при загрузке уведомляют о загрузке.


  // ПЕРЕМЕННЫЕ

  const template = document.querySelector('#template-card').content.querySelector('.place-card');
  const openPlaceForm = document.querySelector('.user-info__button');         // Открываем форму карточек;
  const openProfileForm = document.querySelector('.user-info__button-edit'); // Открываем форму профиля;
  const openFormPhoto = document.querySelector('.user-info__photo');        //  Форма смены изображения профиля;
  const authorName = document.querySelector('.user-info__name');           //   =>  Получаем элементы
  const authorAbout = document.querySelector('.user-info__job');          //  <=  с именем и описанием профиля
  const photoProfile = document.querySelector('.user-info__photo');      // Элемент изображения профиля

  // Формы =>
  /*REVIEW. Можно лучше. В стилевых правилах написания js-кода требуется, чтобы поиск DOM-элементов во всём проекте
  осуществлялся одним способом, например только с помощью querySelector */
  const formPhoto = document.forms.photo;
  const formPlace = document.forms.card;
  const formProfile = document.forms.profile;
  const placeName = formPlace.elements.name;
  const placeLink = formPlace.elements.link;
  const photoLink = formPhoto.elements.link;
  const profileAuthor = formProfile.elements.author;
  const profileAbout = formProfile.elements.about;
  const placeButtonSubmit = formPlace.querySelector('.popup__button-type_place');
  const profileButtonSubmit = formProfile.querySelector('.popup__button-type_profile');
  const photoButtonSubmit = formPhoto.querySelector('.popup__button-type_photo');

  // Конструкторы =>

  const newApi = new Api({
    baseUrl: 'https://praktikum.tk/cohort11',
    headers: {
      authorization: 'bc314e81-9f4f-4d54-a975-f1d4e1eff7d2',
      'Content-Type': 'application/json'
    }
  });

  const popupPlace = new Popup(document.querySelector('.popup__type_place'));
  const popupProfile = new Popup(document.querySelector('.popup__type_profile'));
  const popupImage = new Popup(document.querySelector('.popup__type_img'))
  const newUserInfo = new UserInfo(authorName, authorAbout, profileAuthor, profileAbout, photoProfile);
  const placeValidator = new FormValidator(formPlace);
  const profileValidator = new FormValidator(formProfile);
  const photoValidator = new FormValidator(formPhoto);
  const createCard = (...args) => new Card(...args, openImagePopup, newApi, template);
  const popupPhoto = new Popup(document.querySelector('.popup__type_photo'));
  const placeList = new CardList(document.querySelector('.places-list'), createCard);


  // Получим карточки =>

  newApi.getInitialCards()
    .then(result => {
      placeList.render(result)
    })
    .catch(err => {
      console.log(`Ошибка ${err} при загрузке карточек`)
    });

  // Получим данные профиля =>

  newApi.getUserData().then(result => {
    newUserInfo.setUserInfo(result.name, result.about);
    newUserInfo.updateUserInfo();
    newUserInfo.updatePhoto(result.avatar)
  })
    .catch(err => {
      console.log(`Ошибка ${err} при получении данных профиля`)
    });

  // Функция передачи ссылки изображения =>

  function openImagePopup(url) {
    const popupImg = document.querySelector('.popup__image');
    popupImg.src = url;
    /*REVIEW. Надо бы лучше. Получается, когда Вы вызываете метод open класса Popup, в котором у Вас вызывается метод setEvent того же класса, что
    добавление обработчика события закрытия большого фото на крестик его всплывающего окна происходит столько раз, сколько у Вас карточек (потому
    что это происходит при рендере), а крестик всего один, который дан в размётке. По-моему setEvent в open вызывать нельзя, добавление обработчиков
    событий на постоянные DOM-элементы, изначально данные в размётке, надо производить в файле script.js один раз. */
    popupImage.open();
  }

  loadingButton = (button, isDone) => {

    if (isDone) {
      button.classList.add('popup__button_loader');
      button.textContent = 'Загружаю';
    } else {
      button.classList.remove('popup__button_loader');
      button.textContent = 'Отправить'
    }
  }

  // ФУНКЦИИ ПРОФИЛЯ =>

  updateProfileForm = () => {
    event.preventDefault();
    loadingButton(profileButtonSubmit, true)
    newApi.updateUserData(profileAuthor.value, profileAbout.value)
      .then((res) => {
        newUserInfo.setUserInfo(res.name, res.about);
        newUserInfo.updateUserInfo();
        formProfile.reset;
        popupProfile.close();
      })
      .catch(err => {
        console.log(`Ошибка ${err} при добавлении карточки`)
      })
      .finally(() => {
        loadingButton(profileButtonSubmit, false)
      })
  }

  openProfilePopup = () => {
    profileValidator.setSubmitButtonState(profileButtonSubmit, true);
    profileValidator.clearErrors()
    profileValidator.setEventListeners(event);
    popupProfile.open();
    newUserInfo.extractValues();
  }

  // ФУНКЦИИ КАРТОЧЕК =>

  openPlacePopup = () => {
    placeValidator.setSubmitButtonState(placeButtonSubmit, false);
    placeValidator.setEventListeners(event);
    placeValidator.clearErrors();
    formPlace.reset();
    popupPlace.open();
  }

  addNewPlace = () => {
    event.preventDefault();
    loadingButton(placeButtonSubmit, true)
    newApi.addNewPlace(placeName.value, placeLink.value)
      .then((data) => {
        placeList.addCard(data);
        popupPlace.close();
      })
      .catch(err => {
        console.log(`Ошибка ${err} при добавлении карточки`);
      })
      .finally(() => {
        loadingButton(placeButtonSubmit, false)
      })
  }

  // Функции изображения:

  openPhotoPopup = () => {
    photoValidator.setSubmitButtonState(photoButtonSubmit, false);
    photoValidator.clearErrors()
    formPhoto.reset();
    popupPhoto.open();
    photoValidator.setEventListeners(event);
  }

  updatePhoto = () => {
    event.preventDefault();
    loadingButton(photoButtonSubmit, true)
    newApi.updatePhotoProfile(photoLink.value)
      .then(res => {
        photoProfile.style.backgroundImage = `url(${res.avatar})`
        popupPhoto.close();
      })
      .catch(err => {
        console.log(`Ошибка ${err} при обновлении фото`)
      })
      .finally(() => {
        loadingButton(photoButtonSubmit, false)
      })
  }

  // Слушатели =>

  formPhoto.addEventListener('submit', updatePhoto);
  openFormPhoto.addEventListener('click', openPhotoPopup);
  formProfile.addEventListener('submit', updateProfileForm);
  openPlaceForm.addEventListener('click', openPlacePopup);
  formPlace.addEventListener('submit', addNewPlace);
  openProfileForm.addEventListener('click', openProfilePopup);

  updateProfileForm = () => {
    event.preventDefault();
    loadingButton(profileButtonSubmit, true)
    newApi.updateUserData(profileAuthor.value, profileAbout.value)
      .then((res) => {
        newUserInfo.setUserInfo(res.name, res.about);
        newUserInfo.updateUserInfo();
        formProfile.reset;
        popupProfile.close();
      })
      .catch(err => {
        console.log(`Ошибка ${err} при добавлении карточки`)
      })
      .finally(() => {
        loadingButton(profileButtonSubmit, false)
      })
  }




}());



/*REVIEW. Резюме.

Сильная работа. Критических замечаний по 9-му заданию нет.
Учитывается асинхронность работы с сервером.
Используется синтаксис ES6.
Сделаны все дополнительные задания и даже больше!


Что можно лучше.

1. Лучше в параметры класса CardList передавать не функцию, возвращающую экземпляр класса Card, а функцию, возвращающую элемент карточки
для каждого экземпляра (подробный комментарий в классе CardList).
2. Лучше вызывать метод setEventListeners класса Card в его методе create, чтобы класс CardList был ответственен только за рендер
каких-то объектов, возможно не только карточек.(подробный комментарий в классе CardList).
3. В стилевых правилах написания js-кода требуется, чтобы поиск DOM-элементов во всём проекте осуществлялся одним способом, например,
только с помощью querySelector.
4. Добавление обработчика события закрытия большого фото на крестик его всплывающего окна и других обработчиков закрытия всплывающих окон
происходит столько раз, сколько карточек (потому что это происходит при рендере). Нужно подумать и оптимизировать код (подробный комментарий
в этом файле в коде  openImagePopup).


Работа принимается.

Желаю дальнейших успехов в обучении!

*/
