export default class FormValidator {

    constructor(form) {
        this.form = form;
        this.error = Array.from(this.form.querySelectorAll('.error'))
    }

    // Состояние кнопки:
    setSubmitButtonState(button, state) {
        if (state === true) {
            button.classList.remove('popup__button_disabled');
            button.removeAttribute('disabled');
        } else {
            button.classList.add('popup__button_disabled');
            button.setAttribute('disabled', 'disabled');
        }
    }

    // Слушаем:
    setEventListeners() {
        this.form.addEventListener('input', (event) => {
            const button = event.currentTarget.querySelector('.popup__button');
            const inputs = Array.from(event.currentTarget.querySelectorAll('input'));
            this.isFieldValid(event.target)

            if (inputs.every(this.checkInputValidity)) {
                this.setSubmitButtonState(button, true)
            } else {
                this.setSubmitButtonState(button, false)
            }
        });
    }

    // Проверяем валидность 'input':
    isFieldValid(input) {
        const errorElement = this.form.querySelector(`#${input.id}-error`);
        this.checkInputValidity(input)
        errorElement.textContent = input.validationMessage;
    }

    // Вывод ошибки: 
    checkInputValidity(input) {
        input.setCustomValidity('');

        if (input.validity.valueMissing) {
            input.setCustomValidity('Обязательное поле');
            return false;
        }
        if (input.validity.tooShort || input.validity.tooLong) {
            input.setCustomValidity('От 2 до 30 символов');
            return false
        }
        if (input.validity.typeMismatch && input.type === 'url') {
            input.setCustomValidity('Здесь должна быть ссылка');
            return false
        }
        return input.checkValidity();
    }

    // Обнуление:
    clearErrors() {
        this.error.forEach((er) => {
            er.textContent = "";
        })
    }
}