import '../src/pages/style.css'

import Api from './script/Api';
import Card from './script/Card';
import CardList from './script/CardList';
import FormValidator from './script/FormValidator';
import Popup from './script/Popup';
import UserInfo from './script/UserInfo';

(function () {
   const template = document.querySelector('#template-card').content.querySelector('.place-card');
   const openPlaceForm = document.querySelector('.user-info__button');         // Открываем форму карточек;
   const openProfileForm = document.querySelector('.user-info__button-edit'); // Открываем форму профиля;
   const openFormPhoto = document.querySelector('.user-info__photo');        //  Форма смены изображения профиля;
   const authorName = document.querySelector('.user-info__name');           //   =>  Получаем элементы
   const authorAbout = document.querySelector('.user-info__job');          //  <=  с именем и описанием профиля
   const photoProfile = document.querySelector('.user-info__photo');      // Элемент изображения профиля

   // Формы =>

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
   const serverUrl = NODE_ENV === 'development' ? ' http://nomoreparties.co/cohort11' : ' https://nomoreparties.co/cohort11';

   // Конструкторы =>

   const newApi = new Api({

      baseUrl: serverUrl,
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
   const cards = document.querySelectorAll('place-card')
   console.log(cards)

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
      popupImage.open();
   }

   const loadingButton = (button, isDone) => {

      if (isDone) {
         button.classList.add('popup__button_loader');
         button.textContent = 'Загружаю';
      } else {
         button.classList.remove('popup__button_loader');
         button.textContent = 'Отправить'
      }
   }

   // ФУНКЦИИ ПРОФИЛЯ =>

   const updateProfileForm = () => {
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

   const openProfilePopup = () => {
      profileValidator.setSubmitButtonState(profileButtonSubmit, true);
      profileValidator.clearErrors()
      profileValidator.setEventListeners(event);
      popupProfile.open();
      newUserInfo.extractValues();
   }

   // ФУНКЦИИ КАРТОЧЕК =>

   const openPlacePopup = () => {
      placeValidator.setSubmitButtonState(placeButtonSubmit, false);
      placeValidator.setEventListeners(event);
      placeValidator.clearErrors();
      formPlace.reset();
      popupPlace.open();
   }

   const addNewPlace = () => {
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

   const openPhotoPopup = () => {
      photoValidator.setSubmitButtonState(photoButtonSubmit, false);
      photoValidator.clearErrors()
      formPhoto.reset();
      popupPhoto.open();
      photoValidator.setEventListeners(event);
   }

   const updatePhoto = () => {
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


}());






