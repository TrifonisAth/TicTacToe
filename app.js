const GameBoard = (() => {
  let board = [];
  const init = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const row = i + 1;
        const column = j + 1;
        const str = row.toString().concat(column.toString());
        const block = Block(str);
        board.push(block);
        console.log("block inserted,", str);
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
    block.updateCondition(player);
  };
  return { init, playerMark, board }; // Remove board after testing!
})();

const Block = (name) => {
  let condition = "none";
  let occupier = "none";

  const updateCondition = (player) => {
    // If somebody is occupying the block send console error.
    if (condition !== "none") {
      console.error("ERROR: The block is occupied, choose a different one.");
      return;
    }
    condition = player.getNumber();
    occupier = player.getName();
  };
  const getName = () => name;
  const getCondition = () =>
    console.log(`Block ${getName()} is occupied by: ${occupier}.`);

  return { updateCondition, getName, getCondition };
};

// I might add an array to store players, this will help when changing active player.

const PlayerFactory = (name, number, symbol) => {
  const getName = () => name;
  const getNumber = () => number;
  const getSymbol = () => symbol;
  return { getName, getNumber, getSymbol };
};
