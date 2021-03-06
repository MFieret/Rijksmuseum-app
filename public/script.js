class AudioControl {
  constructor() {
      this.backgroundMusic = new Audio('Assets/Audio/background-music.mp3');
      this.flipSound = new Audio('Assets/Audio/flip.wav');
      this.matchSound = new Audio('Assets/Audio/match.wav');
      this.victorySound = new Audio('Assets/Audio/victory.wav');
      this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
      this.backgroundMusic.volume = 0.2;
      this.backgroundMusic.loop = true;
  }
  startMusic() {
      this.backgroundMusic.play();
  }
  stopMusic() {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
  }
  flip() {
      this.flipSound.play();
  }
  match() {
      this.matchSound.play();
  }
  victory() {
      this.stopMusic();
      this.victorySound.play();
  }
  gameOver() {
      this.stopMusic();
      this.gameOverSound.play();
  }
}

class Memory {
  constructor(totalTime, cards) {
      this.cardArray = cards;
      this.totalTime = totalTime;
      this.timeRemaining = totalTime;
      this.timer = document.getElementById('time-remaining')
      this.ticker = document.getElementById('flips');
      this.audioControl = new AudioControl();
  }

  startGame() {
      this.totalClicks = 0;
      this.timeRemaining = this.totalTime;
      this.cardToCheck = null;
      this.matchedCards = [];
      this.busy = true;
      setTimeout(() => {
          this.audioControl.startMusic();
          this.shuffleCards(this.cardArray);
          this.countdown = this.startCountdown();
          this.busy = false;
      }, 500)
      this.hideCards();
      this.timer.innerText = this.timeRemaining;
      this.ticker.innerText = this.totalClicks;
  }
  startCountdown() {
      return setInterval(() => {
          this.timeRemaining--;
          this.timer.innerText = this.timeRemaining;
          if(this.timeRemaining === 0)
              this.gameOver();
      }, 1000);
  }
  gameOver() {
      clearInterval(this.countdown);
      this.audioControl.gameOver();
      document.getElementById('game-over-text').classList.add('visible');
  }
  victory() {
      clearInterval(this.countdown);
      this.audioControl.victory();
      document.getElementById('victory-text').classList.add('visible');
  }
  hideCards() {
      this.cardArray.forEach(card => {
          card.classList.remove('visible');
          card.classList.remove('matched');
      });
  }
  flipCard(card) {
      if(this.canFlipCard(card)) {
          this.audioControl.flip();
          this.totalClicks++;
          this.ticker.innerText = this.totalClicks;
          card.classList.add('visible');

          if(this.cardToCheck) {
              this.checkForCardMatch(card);
          } else {
              this.cardToCheck = card;
          }
      }
  }
  checkForCardMatch(card) {
      if(this.getCardType(card) === this.getCardType(this.cardToCheck))
          this.cardMatch(card, this.cardToCheck);
      else 
          this.cardnotMatch(card, this.cardToCheck);

      this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
      this.matchedCards.push(card1);
      this.matchedCards.push(card2);
      card1.classList.add('matched');
      card2.classList.add('matched');
      this.audioControl.match();
      if(this.matchedCards.length === this.cardArray.length)
          this.victory();
  }
  cardnotMatch(card1, card2) {
      this.busy = true;
      setTimeout(() => {
          card1.classList.remove('visible');
          card2.classList.remove('visible');
          this.busy = false;
      }, 1000);
  }
  shuffleCards(cardArray) { // Fisher-Yates Shuffle Algorithm.
      for (let i = cardArray.length - 1; i > 0; i--) {
          let randIndex = Math.floor(Math.random() * (i + 1));
          cardArray[randIndex].style.order = i;
          cardArray[i].style.order = randIndex;
      }
  }
  getCardType(card) {
      return card.getElementsByClassName('picture-known')[0].src;
  }
  canFlipCard(card) {
      return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new Memory(100, cards);

  overlays.forEach(overlay => {
      overlay.addEventListener('click', () => {
          overlay.classList.remove('visible');
          game.startGame();
      });
  });

  cards.forEach(card => {
      card.addEventListener('click', () => {
          game.flipCard(card);
      });
  });
}