export default class CardList {

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

