class Popup {
  constructor(popup) {
    this.popup = popup;
    this.closeButton = this.popup.querySelector('.popup__close');
    this.close = this.close.bind(this);
    this.closeByClick = this.closeByClick.bind(this)
    this.closePopupButton = this.closePopupButton.bind(this)
  }

  open() {
    this.popup.classList.add('popup_is-opened');
    this.setEvent()

  }

  close() {
    this.removeEvent()
    this.popup.classList.remove('popup_is-opened');
  }

  closePopupButton(event) {
    if (event.key === 'Escape') {
      this.close()
    }
  }

  closeByClick(event) {
    if (event.target.contains(this.popup)) {
      this.close()
    }
  }

  setEvent() {
    this.closeButton.addEventListener('click', this.close);
    document.addEventListener('click', this.closeByClick);
    document.addEventListener('keydown', this.closePopupButton);
  }

  removeEvent() {
    this.closeButton.removeEventListener('click', this.close);
    document.removeEventListener('click', this.closeByClick);
    document.removeEventListener('keydown', this.closePopupButton);
  }
}


