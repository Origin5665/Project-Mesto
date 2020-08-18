export default class UserInfo {
   constructor(authorName, authorAbout, profileAuthor, profileAbout, photoElement) {
      this.authorName = authorName;
      this.authorAbout = authorAbout;
      this.profileAuthor = profileAuthor;
      this.profileAbout = profileAbout;
      this.photoElement = photoElement;
   }

   setUserInfo(newName, newJob) {
      this.name = newName;
      this.job = newJob;
   }

   updateUserInfo() {
      this.authorName.textContent = this.name;
      this.authorAbout.textContent = this.job;
   }

   extractValues() {
      this.profileAuthor.value = this.authorName.textContent;
      this.profileAbout.value = this.authorAbout.textContent;
   }
   updatePhoto(link) {
      this.photoElement.style.backgroundImage = `url(${link})`
   }


}

