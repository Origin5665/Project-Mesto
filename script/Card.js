class Card {

  constructor(cardData, openImageCallback, api, template) {
    this.template = template;
    this.openImageCallback = openImageCallback;
    this.cardData = cardData;
    this.api = api;
    this.openImage = this.openImage.bind(this);
    this.remove = this.remove.bind(this);
    this.like = this.like.bind(this);
    this.owner = this.cardData.owner
    this.ownerID = this.cardData.owner._id;


  }

  create() {
    this.newCard = this.template.cloneNode(true);

    this.newCard.querySelector('.place-card__name').textContent = this.cardData.name;
    this.newCard.querySelector('.place-card__image').style.backgroundImage = `url(${this.cardData.link})`
    this.newCard.querySelector('.place-card__like-container').textContent = this.cardData.likes.length;
    this.setEventListeners()

    // Проверяем наличие id в likes => добавляем класс 'liked' =>

    if (this.cardData.likes.find(owner => owner._id === '6fd41c71b170e61b148c2a05')) {
      this.newCard.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
    }
    // Проверяем, что карточка пользователя => добавляем атрибут\класс "выделения карточки" => 

    if (this.cardData.owner._id === '6fd41c71b170e61b148c2a05') {
      this.newCard.querySelector('.place-card__delete-icon').style.display = 'block';
      this.newCard.classList.add('place-card__is-mine')
    } else {
      this.newCard.querySelector('.place-card__delete-icon').style.display = 'none';
    };

    return this.newCard
  }

  setEventListeners() {
    this.newCard.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    this.newCard.querySelector('.place-card__like-icon').addEventListener('click', this.like);
    this.newCard.querySelector('.place-card__image').addEventListener('click', this.openImage)
  }

  removeEvent() {
    this.newCard.querySelector('.place-card__like-icon').removeEventListener('click', this.remove);
    this.newCard.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
    this.newCard.querySelector('.place-card__image').removeEventListener('click', this.openImage)
  }

  remove() {
    const choice = window.confirm('Удалить данную карточку?')
    event.stopPropagation()
    if (choice === true) {
      this.api.deleteMyPlace(this.cardData._id)
        .then(() => {
          this.removeEvent();
          this.newCard.remove();
        })
        .catch(err => {
          console.log(`Ошибка ${err} при удалении карточки`)
        });
    }
  }

  like(event) {

    if (event.target.className === 'place-card__like-icon') {
      this.api.addLike(this.cardData._id)
        .then(result => {
          this.newCard.querySelector('.place-card__like-container').textContent = result.likes.length;
          event.target.classList.add("place-card__like-icon_liked");
        })
        .catch(err => {
          console.log(`Ошибка ${err} при добавлении лайка`)
        });
    } else {
      this.api.removeLike(this.cardData._id)
        .then(result => {
          this.newCard.querySelector('.place-card__like-container').textContent = result.likes.length;
          event.target.classList.remove("place-card__like-icon_liked");
        })
        .catch(err => {
          console.log(`Ошибка ${err} при удалении лайка`)
        });
    }
  }

  openImage() {
    this.openImageCallback(this.cardData.link);
  }

}


