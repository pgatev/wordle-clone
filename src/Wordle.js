import React from "react";
import { useEffect, useRef } from "react";
import "./styles/Wordle.css";
import dictionary from "./data/dictionary.json";
import targetWords from "./data/targetWords.json";

export default function Wordle() {
  const WORD_LENGTH = 5;
  const startingDate = new Date(2023, 0, 1);
  const msOffset = Date.now() - startingDate;
  const dayOffset = msOffset / 1000 / 60 / 60 / 24;
  const targetWord = targetWords[Math.floor(dayOffset)];
  console.log(targetWord);

  const guessGrid = useRef();
  const alertContainer = useRef();

  //subscribe to keydown event on document level
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleClick(e) {
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

  async function submitGuess() {
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
    activeTiles.forEach((...params) => flipTile(...params, guess));
  }

  async function flipTile(tile, index, array, guess) {}

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
      <div className="keyboard">
        <button className="key" data-key="Q" onClick={(e) => handleClick(e)}>
          Q
        </button>
        <button className="key" data-key="W" onClick={(e) => handleClick(e)}>
          W
        </button>
        <button className="key" data-key="E" onClick={(e) => handleClick(e)}>
          E
        </button>
        <button className="key" data-key="R" onClick={(e) => handleClick(e)}>
          R
        </button>
        <button className="key" data-key="T" onClick={(e) => handleClick(e)}>
          T
        </button>
        <button className="key" data-key="Y" onClick={(e) => handleClick(e)}>
          Y
        </button>
        <button className="key" data-key="U" onClick={(e) => handleClick(e)}>
          U
        </button>
        <button className="key" data-key="I" onClick={(e) => handleClick(e)}>
          I
        </button>
        <button className="key" data-key="O" onClick={(e) => handleClick(e)}>
          O
        </button>
        <button className="key" data-key="P" onClick={(e) => handleClick(e)}>
          P
        </button>
        <div className="space"></div>
        <button className="key" data-key="A" onClick={(e) => handleClick(e)}>
          A
        </button>
        <button className="key" data-key="S" onClick={(e) => handleClick(e)}>
          S
        </button>
        <button className="key" data-key="D" onClick={(e) => handleClick(e)}>
          D
        </button>
        <button className="key" data-key="F" onClick={(e) => handleClick(e)}>
          F
        </button>
        <button className="key" data-key="G" onClick={(e) => handleClick(e)}>
          G
        </button>
        <button className="key" data-key="H" onClick={(e) => handleClick(e)}>
          H
        </button>
        <button className="key" data-key="J" onClick={(e) => handleClick(e)}>
          J
        </button>
        <button className="key" data-key="K" onClick={(e) => handleClick(e)}>
          K
        </button>
        <button className="key" data-key="L" onClick={(e) => handleClick(e)}>
          L
        </button>
        <div className="space"></div>
        <button className="key large" data-enter onClick={() => submitGuess()}>
          ENTER
        </button>
        <button className="key" data-key="Z" onClick={(e) => handleClick(e)}>
          Z
        </button>
        <button className="key" data-key="X" onClick={(e) => handleClick(e)}>
          X
        </button>
        <button className="key" data-key="C" onClick={(e) => handleClick(e)}>
          C
        </button>
        <button className="key" data-key="V" onClick={(e) => handleClick(e)}>
          V
        </button>
        <button className="key" data-key="B" onClick={(e) => handleClick(e)}>
          B
        </button>
        <button className="key" data-key="N" onClick={(e) => handleClick(e)}>
          N
        </button>
        <button className="key" data-key="M" onClick={(e) => handleClick(e)}>
          M
        </button>
        <button
          className="key large"
          data-backspace
          onClick={() => deleteLastCharacter()}>
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
