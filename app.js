const Game = (() => {
  const container = document.querySelector(".container");
  const content = document.querySelector(".content");
  const header = document.querySelector("header");

  const renderBlocks = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = document.createElement("div");
        div.classList.add("block");
        div.dataset.number = (i + 1).toString().concat((j + 1).toString());
        div.addEventListener("click", () => {
          // console.log(div.dataset.number);
          // TODO Call a func to check if you can mark the block and then change textcontent and activePlayer.
          if (GameBoard.playerMark(activePlayer, div.dataset.number)) {
            div.textContent = activePlayer.getSymbol();
            if (GameBoard.victoryStatus()) {
              renderGameStatus();
              // GameBoard.resetBoard();
              // End the game.
            }
            changeActivePlayer();
          }
        });
        content.appendChild(div);
      }
    }
  };

  const renderStartingOptions = () => {
    const form = document.createElement("form");
    const inputP1Name = document.createElement("input");
    const inputP1Symbol = document.createElement("input");
    inputP1Name.setAttribute("type", "text");
    inputP1Name.setAttribute("maxLength", 10);
    inputP1Name.setAttribute("placeholder", "Player1");
    inputP1Symbol.setAttribute("type", "radio");
    header.insertAdjacentElement("beforeend", inputP1Name);
    header.insertAdjacentElement("beforeend", inputP1Symbol);
  };

  const renderGameStatus = () => {
    const p = document.createElement("p");
    p.textContent = `${activePlayer.getName()} won!`;
    container.appendChild(p);
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

  const PlayerFactory = (name, number, symbol) => {
    const getName = () => name;
    const getNumber = () => number;
    const getSymbol = () => symbol;
    return { getName, getNumber, getSymbol };
  };

  const players = [];
  const p1 = PlayerFactory("player1", "1", "O");
  const p2 = PlayerFactory("player2", "2", "X");
  players.push(p1, p2);
  let activePlayer = p1;

  const changeActivePlayer = () => {
    activePlayer = players[0] !== activePlayer ? players[0] : players[1];
  };

  const startGame = () => {
    GameBoard.init(); // Initialize logic.
    // renderStartingOptions();
    // renderBlocks(); // Render blocks.
  };

  return { startGame };
})();

// Testing
Game.startGame();
