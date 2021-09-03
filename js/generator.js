const
textArea = document.querySelector('textarea'),
copyBtn = document.querySelector('#copy'),
showMoreBtn = document.querySelector("#show-more");

// Toggle between "advanced options" visibilty
showMoreBtn.addEventListener("click", () => {
  showMoreBtn.classList.toggle("visible");
  showMoreBtn.classList.contains("visible") ?
  showMoreBtn.textContent = "Hide options " :
  showMoreBtn.textContent = "Advanced options ";
});

// Copy event listener
textArea.addEventListener('click', clipboardCopy);
document.querySelector('#copy').addEventListener('click', clipboardCopy);

// Shuffle the array
document.querySelector('#generate').addEventListener('click', () => {
  password.shuffle();
  textArea.textContent = password.getRandom();
});

function clipboardCopy() {

  if (!navigator?.clipboard) return execCopy();

  const tmp = textArea.textContent;

  navigator.clipboard.writeText(tmp);
  textArea.textContent = 'Copied';

  setTimeout(() => textArea.textContent = tmp, 1500);
}

function execCopy() { // Fallback for older browsers
  const tmp = textArea.textContent;

  textArea.focus();
  textArea.select();

  document.execCommand('copy');

  textArea.textContent = 'Copied';
  setTimeout(() => textArea.textContent = tmp, 1500);
}

const password = {
  getRandom: function() {
    return this.arr.slice(0, this.length).join("");
  },

  shuffle: function() {
    for (let i = this.arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
    }
  },

  arr: Array.from("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789-_"),
  length: localStorage.passwordLength || 12,

  addCharacter: function(char) {
    this.arr.push(char);
  },
  removeCharacter: function(char) {
    this.arr = this.arr.filter(val => val !== char);
  }
}

/*
*   Advanced Options ↓↓↓
*/

const charBox = document.querySelector("#custom-chars");

document.querySelector("#length").addEventListener("input", event => {
  password.length = event.target.value;
});

document.querySelector("#add-char").addEventListener("input", event => {

  const
  char = event.target.value,
  span = event.target.nextElementSibling;

  if (char.length === 0) return span.textContent = '';

  if (char.length !== 1) return span.textContent =
  "* 1 character at a time";
    
  if (password.arr.some(val => val === char)) return span.textContent =
  "* This character already there";
  
  span.textContent = '';

  password.addCharacter(char);
  addCharDOM(char);
  passwordStorage.addChar(char);

  event.target.value = '';
});

function addCharDOM(char) {
  const
  div = document.createElement("div"),
  span = document.createElement("span"),
  button = document.createElement("button");

  span.textContent = char;

  button.type = "button";
  button.dataset.char = char;
  button.textContent = "❌";
  
  div.appendChild(span);
  div.appendChild(button);

  charBox.appendChild(div);
}

charBox.addEventListener("click", event => {
  if (event.target.type !== "button") return;

  password.removeCharacter(event.target.dataset.char);
  passwordStorage.removeChar(event.target.dataset.char);

  event.target.parentElement.remove();
});

/*
*   localstorage management ↓↓↓
*/

const passwordStorage = {

  addChar: function(char) {
    localStorage.passwordChars ||= "[]";

    const chars = JSON.parse(localStorage.passwordChars);
    chars.push(char);
    localStorage.passwordChars = JSON.stringify(chars);
  },

  removeChar: function(char) {
    const chars = JSON.parse(localStorage.passwordChars).filter(val => val !== char);
    localStorage.passwordChars = JSON.stringify(chars);
  },

  editLength: function(len = 12) {
    localStorage.passwordLength = len;
  }

};

(function(strArr) {
  if (!strArr) return;

  JSON.parse(strArr).forEach(char => {
    password.addCharacter(char);
    addCharDOM(char);
  });
})(localStorage.passwordChars);