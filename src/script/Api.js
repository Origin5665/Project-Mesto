export default class Api {

   constructor(options) {

      this.options = options;
      this.url = options.baseUrl;
      this.headers = this.options.headers

   }

   // Загрузка карточкек с сервера =>

   getInitialCards() {
      return fetch(`${this.url}/cards`, {
         method: "GET",
         headers: this.headers,
      })
         .then(res => {

            if (res.ok) {
               return res.json()
            } else {
               return Promise.reject(`Ошибка: ${res.status}`)
            }
         })
   }

   // Получаем данные с сервера =>

   getUserData() {
      return fetch(`${this.url}/users/me`, {
         method: "GET",
         headers: this.headers,
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            } else {
               return Promise.reject(`Ошибка: ${res.status}`)
            }
         })
   }

   // Обновляем данные профиля на сервере =>

   updateUserData(authorName, authorAbout) {
      return fetch(`${this.url}/users/me`, {
         method: "PATCH",
         headers: this.headers,
         body: JSON.stringify({
            name: authorName,
            about: authorAbout
         })
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            } else {
               return Promise.reject(`Ошибка: ${res.status}`)
            }
         })
   }

   // Добавляем новый элемент на сервер =>

   addNewPlace(placeName, placeLink) {
      return fetch(`${this.url}/cards`, {
         method: "POST",
         headers: this.headers,
         body: JSON.stringify({
            name: placeName,
            link: placeLink
         })
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`)
         })
   }


   // Удаляем элемент с сервера => 

   deleteMyPlace(placeID) {
      return fetch(`${this.url}/cards/${placeID}`, {
         method: "DELETE",
         headers: this.headers,
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            } else {
               return Promise.reject(`Ошибка: ${res.status}`)
            }
         })

   }

   // Обвновляем изображение профиля =>

   updatePhotoProfile(link) {
      return fetch(`${this.url}/users/me/avatar`, {
         method: "PATCH",
         headers: this.headers,
         body: JSON.stringify({
            avatar: link
         })
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`)
         })

   }

   // Добавление "лайка" =>

   addLike(id) {
      return fetch(`${this.url}/cards/like/${id}`, {
         method: "PUT",
         headers: this.headers,
      })
         .then(res => {
            if (res.ok) {
               return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`)
         })
   }

   // Снятие "Лайка" =>

   removeLike(id) {
      return fetch(`${this.url}/cards/like/${id}`, {
         method: "DELETE",
         headers: this.headers,
      })
         .then(res => {
            if (res.ok) {
               return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`)
         })
   }





}
