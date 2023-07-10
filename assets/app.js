const toggleBtn = document.querySelector(".toggle-btn");
const result = document.querySelector(".result");

window.addEventListener("DOMContentLoaded", () => {
  const isDarkTheme = localStorage.getItem("darkTheme");

  if (isDarkTheme === "true") {
    enableDarkTheme();
  } else {
    disableDarkTheme();
  }
});

function enableDarkTheme() {
  document.body.classList.add("dark-theme");
  toggleBtn.classList.add("active");
  localStorage.setItem("darkTheme", "true");
}

function disableDarkTheme() {
  document.body.classList.remove("dark-theme");
  toggleBtn.classList.remove("active");
  localStorage.setItem("darkTheme", "false");
}

function toggleDarkLight() {
  if (document.body.classList.contains("dark-theme")) {
    disableDarkTheme();
  } else {
    enableDarkTheme();
  }
}

toggleBtn.addEventListener("click", toggleDarkLight);

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".search-class");

  if (input) {
    input.addEventListener("change", getData);
  }

  async function getData() {
    try {
      const inputValue = input.value;
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const html = data
          .map(
            (entry) => `
          <div class="section-one">
            <div class="resault-word">
              <div class="word">${entry.word}</div>
              <div class="word-play"><p>${entry.phonetics[0].text}</p></div>
            </div>
            <div class="play">
              <img src="./starter-code/assets/images/icon-play.svg" alt="" data-word="${
                entry.word
              }" />
            </div>
          </div>

          ${entry.meanings
            .map(
              (meaning) => `
            <div class="part-of-speech">
              <p>${meaning.partOfSpeech} <hr class="part-speech-hr"> </p>
            </div>
            <div class="meaning">
              <p>Meaning</p>
              <ul>
                ${meaning.definitions
                  .map((definition) => `<li>${definition.definition}</li>`)
                  .join("")}
              </ul>
              <p class="synonyms">Synonyms &nbsp;&nbsp;&nbsp; <span class="synonyms-word">${meaning.definitions[0].synonyms.join(
                ", "
              )}</span></p>
            </div>
          `
            )
            .join("")}
        `
          )
          .join("");

        result.innerHTML = html;
        attachPlayEventListeners();
      } else {
        result.innerHTML = `
          <div class="error">
            <div>😶‍🌫️😨😱</div>
            <div>
              <p class="no-definition">No Definitions Found</p>
            </div>
            <div>
              <p class="sorry-pal">
                Sorry pal, we couldn't find definitions for the word you were
                looking for. You can try the search again at a later time or head
                to the web instead.
              </p>
            </div>
          </div>
        `;
      }

      console.log(data);
    } catch (error) {
      console.log(error);
      result.innerHTML = `
        <div class="error">
          <div>😶‍🌫️😨😱</div>
          <div>
            <p class="no-definition">No Definitions Found</p>
          </div>
          <div>
            <p class="sorry-pal">
              Sorry pal, we couldn't find definitions for the word you were
              looking for. You can try the search again at a later time or head
              to the web instead.
            </p>
          </div>
        </div>
      `;
    }
  }
});

function attachPlayEventListeners() {
  const playIcons = document.querySelectorAll(".play img");
  playIcons.forEach((playIcon) => {
    playIcon.addEventListener("click", () => {
      const word = playIcon.getAttribute("data-word");
      speakWord(word);
    });
  });
}

function speakWord(word) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(word);
  synth.speak(utterance);
}
