"use strict";
const Game = (() => {
  const container = document.querySelector(".container");
  const content = document.querySelector(".content");
  const header = document.querySelector("header");
  const buttonPlay = document.querySelector("#buttonStart");
  const form = document.forms.options;

  const players = [];
  let p1;
  let p2;
  let activePlayer;

  buttonPlay.addEventListener("click", () => {
    form.classList.add("hidden");
    startGame();
  });

  const handleClickEvent = (e) => {
    const div = e.currentTarget;
    if (GameBoard.playerMark(activePlayer, div.dataset.number)) {
      div.style.color = activePlayer.getColor();
      div.textContent = activePlayer.getSymbol();
      if (GameBoard.victoryStatus()) {
        renderGameStatus();
        removeClickEvents();
        renderPlayAgainButton();
      } else if (GameBoard.getCounterOfMarks() === 9) {
        renderGameStatus(true); // tie == true.
        removeClickEvents();
        renderPlayAgainButton();
      } else {
        changeActivePlayer();
      }
    }
  };

  const removeRenderedEls = () => {
    container.removeChild(container.lastChild);
    container.removeChild(container.lastChild);
  };

  const removeClickEvents = () => {
    for (let div of content.children) {
      div.removeEventListener("click", handleClickEvent);
    }
  };
  const renderBlocks = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = document.createElement("div");
        div.classList.add("block");
        div.dataset.number = (i + 1).toString().concat((j + 1).toString());
        div.addEventListener("click", handleClickEvent);
        content.appendChild(div);
      }
    }
  };

  const renderGameStatus = (tie = false) => {
    const p = document.createElement("p");
    p.textContent = tie
      ? "There is a Tie..."
      : `${activePlayer.getName()} won!`;
    if (!tie) p.style.color = activePlayer.getColor();
    container.appendChild(p);
  };

  const renderPlayAgainButton = () => {
    const btn = document.createElement("button");
    btn.textContent = "Play Again";
    btn.classList.add("playAgain");
    btn.addEventListener("click", handlePlayAgain);
    container.appendChild(btn);
  };

  const handlePlayAgain = () => {
    GameBoard.resetBoard();
    GameBoard.resetCounterOfMarks();
    removeRenderedEls();
    startGame(false);
    activePlayer = p1;
  };

  const GameBoard = (() => {
    let board = [];
    let counterOfMarks = 0; // Number of marks inside the board.
    const init = () => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = i + 1;
          const column = j + 1;
          const str = row.toString().concat(column.toString());
          const block = Block(str);
          board.push(block);
          // console.log("block inserted,", str);
        }
      }
      console.log("GameBoard is now initialized.");
    };
    const getBlock = (position) => {
      for (let block of board) {
        if (block.getName() === position) return block;
      }
    };
    // Condition has to be a string to be compatible with strict name check of the block.
    const playerMark = (player, position) => {
      const block = getBlock(position);
      const log = block.updateCondition(player);
      block.getConditionLog();
      console.log(log);
      counterOfMarks += log;
      console.log(counterOfMarks);
      return log;
    };

    const getCounterOfMarks = () => {
      return counterOfMarks;
    };

    const resetCounterOfMarks = () => {
      counterOfMarks = 0;
    };

    const resetBoard = () => {
      board = [];
      const content = document.querySelector(".content");
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }
    };

    const victoryStatus = () => {
      if (
        (board[0].getCondition() === board[1].getCondition() &&
          board[1].getCondition() === board[2].getCondition() &&
          board[0].getCondition() !== "none") ||
        (board[3].getCondition() === board[4].getCondition() &&
          board[4].getCondition() === board[5].getCondition() &&
          board[3].getCondition() !== "none") ||
        (board[6].getCondition() === board[7].getCondition() &&
          board[7].getCondition() === board[8].getCondition() &&
          board[6].getCondition() !== "none") ||
        (board[0].getCondition() === board[3].getCondition() &&
          board[3].getCondition() === board[6].getCondition() &&
          board[0].getCondition() !== "none") ||
        (board[1].getCondition() === board[4].getCondition() &&
          board[4].getCondition() === board[7].getCondition() &&
          board[1].getCondition() !== "none") ||
        (board[2].getCondition() === board[5].getCondition() &&
          board[5].getCondition() === board[8].getCondition() &&
          board[2].getCondition() !== "none") ||
        (board[0].getCondition() === board[4].getCondition() &&
          board[4].getCondition() === board[8].getCondition() &&
          board[0].getCondition() !== "none") ||
        (board[2].getCondition() === board[4].getCondition() &&
          board[4].getCondition() === board[6].getCondition() &&
          board[2].getCondition() !== "none")
      ) {
        return true; // Change it to boolean.
      } else return false;
    };

    return {
      init,
      playerMark,
      board,
      getCounterOfMarks,
      victoryStatus,
      resetBoard,
      resetCounterOfMarks,
    }; // Remove board after testing!
  })();

  const Block = (name) => {
    let condition = "none";
    let occupier = "none";

    const updateCondition = (player) => {
      // If somebody is occupying the block send console error.
      if (condition !== "none") {
        console.error("ERROR: The block is occupied, choose a different one.");
        return false;
      }
      condition = player.getNumber();
      occupier = player.getName();
      return true;
    };
    const getName = () => name;
    const getConditionLog = () =>
      console.log(`Block ${getName()} is occupied by: ${occupier}.`);

    const getCondition = () => {
      return condition;
    };
    return { updateCondition, getName, getConditionLog, getCondition };
  };

  // I might add an array to store players, this will help when changing active player.

  const PlayerFactory = (name, number, symbol, color) => {
    const getName = () => name;
    const getNumber = () => number;
    const getSymbol = () => symbol;
    const getColor = () => color;
    return { getName, getNumber, getSymbol, getColor };
  };

  const changeActivePlayer = () => {
    activePlayer = players[0] !== activePlayer ? players[0] : players[1];
  };

  const setOptions = () => {
    const p1Name = form.querySelector("input[name='p1name']").value;
    const p1Symbol = form.querySelector("input[name='p1symbol']:checked").value;
    const p1Color = form.querySelector("input[name='p1color']").value;
    const p2Name = form.querySelector("input[name='p2name']").value;
    const p2Symbol = form.querySelector("input[name='p2symbol']:checked").value;
    const p2Color = form.querySelector("input[name='p2color']").value;

    p1 = PlayerFactory(p1Name, "1", p1Symbol, p1Color);
    p2 = PlayerFactory(p2Name, "2", p2Symbol, p2Color);
    players.push(p1, p2);
    activePlayer = p1;
  };

  const startGame = (setNewOptions = true) => {
    GameBoard.init(); // Initialize logic.
    renderBlocks(); // Render blocks.
    if (setNewOptions) setOptions();
  };

  return { startGame };
})();

// Testing
// Game.startGame();
