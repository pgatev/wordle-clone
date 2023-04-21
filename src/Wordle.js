import React from "react";
import { useEffect, useRef, useState } from "react";
import "./styles/Wordle.css";
import dictionary from "./data/dictionary.json";
import targetWords from "./data/targetWords.json";

export default function Wordle() {
  const WORD_LENGTH = 5;
  const FLIP_ANIMATION_DURATION = 500;
  const DANCE_ANIMATION_DURATION = 500;
  const startingDate = new Date(2023, 0, 1);
  const msOffset = Date.now() - startingDate;
  const dayOffset = msOffset / 1000 / 60 / 60 / 24;
  const targetWord = targetWords[Math.floor(dayOffset)];

  const guessGrid = useRef();
  const alertContainer = useRef();
  const keyboard = useRef();

  const [animationsRunning, setAnimationsRunning] = useState(false);

  subscribeToEvents();

  // useEffect(() => {
  //   //debugger;
  //   if (animationsRunning) {
  //     unsubscribeFromEvents();
  //   } else {
  //     subscribeToEvents();
  //   }
  // }, [animationsRunning]);

  //subscribe to keydown event on document level
  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  function subscribeToEvents() {
    // debugger;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    console.log("subscribed");
  }
  function unsubscribeFromEvents() {
    //debugger;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("click", handleClick);
    console.log("unsubscribed");
  }

  function handleClick(e) {
    //debugger;
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key);
      return;
    }

    if (e.target.matches("[data-enter]")) {
      submitGuess();
      return;
    }

    if (e.target.matches("[data-backspace]")) {
      deleteLastCharacter();
      return;
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      submitGuess();
      return;
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteLastCharacter();
      return;
    }
    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key);
      return;
    }
  }

  function pressKey(key) {
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= WORD_LENGTH) return;
    const nextTile = guessGrid.current.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
  }

  function deleteLastCharacter() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
  }

  function submitGuess() {
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Not enough letters");
      shakeTiles(activeTiles);
      return;
    }

    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter;
    }, "");

    if (!dictionary.includes(guess)) {
      showAlert("Not in word list");
      shakeTiles(activeTiles);
      return;
    }

    unsubscribeFromEvents();
    activeTiles.forEach((...params) => flipTile(...params, guess));
  }

  function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.current.querySelector(
      `[data-key="${letter.toUpperCase()}"]`
    );
    setTimeout(() => {
      tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);

    tile.addEventListener("transitionend", () => {
      tile.classList.remove("flip");
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct";
        key.classList.add("correct");
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location";
        key.classList.add("wrong-location");
      } else {
        tile.dataset.state = "wrong";
        key.classList.add("wrong");
      }
    });

    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip");
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct";
          key.classList.add("correct");
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "wrong-location";
          key.classList.add("wrong-location");
        } else {
          tile.dataset.state = "wrong";
          key.classList.add("wrong");
        }

        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              subscribeToEvents();
              checkWinLose(guess, array);
            },
            { once: true }
          );
        }
      },
      { once: true }
    );
  }

  function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
      showAlert("You Win", 5000);
      danceTiles(tiles);
      unsubscribeFromEvents();
      return;
    }

    const remainingTiles = guessGrid.current.querySelectorAll(
      ":not([data-letter])"
    );

    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null);
      unsubscribeFromEvents();
    }
  }

  function getActiveTiles() {
    return guessGrid.current.querySelectorAll('[data-state="active"]');
  }

  function showAlert(message, duration = 1000) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.current.prepend(alert);

    if (duration == null) return;

    setTimeout(() => {
      alert.classList.add("hidden");
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
  }

  function shakeTiles(tiles) {
    tiles.forEach((tile) => {
      tile.classList.add("shake");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake");
        },
        { once: true }
      );
    });
  }

  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance");
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance");
          },
          { once: true }
        );
      }, (index * DANCE_ANIMATION_DURATION) / 5);
    });
  }

  return (
    <>
      <div ref={alertContainer} className="alert-container"></div>
      <div ref={guessGrid} className="guess-grid">
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
        <div className="tile"></div>
      </div>
      <div ref={keyboard} className="keyboard">
        <button className="key" data-key="Q">
          Q
        </button>
        <button className="key" data-key="W">
          W
        </button>
        <button className="key" data-key="E">
          E
        </button>
        <button className="key" data-key="R">
          R
        </button>
        <button className="key" data-key="T">
          T
        </button>
        <button className="key" data-key="Y">
          Y
        </button>
        <button className="key" data-key="U">
          U
        </button>
        <button className="key" data-key="I">
          I
        </button>
        <button className="key" data-key="O">
          O
        </button>
        <button className="key" data-key="P">
          P
        </button>
        <div className="space"></div>
        <button className="key" data-key="A">
          A
        </button>
        <button className="key" data-key="S">
          S
        </button>
        <button className="key" data-key="D">
          D
        </button>
        <button className="key" data-key="F">
          F
        </button>
        <button className="key" data-key="G">
          G
        </button>
        <button className="key" data-key="H">
          H
        </button>
        <button className="key" data-key="J">
          J
        </button>
        <button className="key" data-key="K">
          K
        </button>
        <button className="key" data-key="L">
          L
        </button>
        <div className="space"></div>
        <button className="key large" data-enter>
          ENTER
        </button>
        <button className="key" data-key="Z">
          Z
        </button>
        <button className="key" data-key="X">
          X
        </button>
        <button className="key" data-key="C">
          C
        </button>
        <button className="key" data-key="V">
          V
        </button>
        <button className="key" data-key="B">
          B
        </button>
        <button className="key" data-key="N">
          N
        </button>
        <button className="key" data-key="M">
          M
        </button>
        <button className="key large" data-backspace>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            data-testid="icon-backspace">
            <path
              fill="var(--color-tone-1)"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
          </svg>
        </button>
      </div>
    </>
  );
}
