class CardList {
    /*REVIEW. Можно лучше. Лучше в параметры класса CardList передавать не функцию, возвращающую экземпляр класса Card, а функцию, возвращающую элемент карточки.
    Тогда классу CardList не надо быбыло быть осведомлённым , что в классе Card есть метод с названием create и эти классы были бы полностью независимы
    друг от друга. Класс Card можно было бы заменить на какой-нибудь другой. */
    constructor(container, createCard) {

        this.container = container;
        this.createCard = createCard;
        this.addCard = this.addCard.bind(this)
    }

    addCard(cardData) {

        const card = this.createCard(cardData);
        this.container.appendChild(card.create());


    }

    render(cards) {

        cards.forEach(this.addCard);
    }
}

