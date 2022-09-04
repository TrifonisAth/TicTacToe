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
        console.log("block inserted", `${i + 1}${j + 1}`);
      }
    }
    console.log("GameBoard is now initialized.");
  };
  const getBlock = (position) => {
    for (let block of board) {
      if (block.getName() === position) return block;
    }
  };
  const playerMark = (playerNumber, position) => {
    const block = getBlock(position);
    block.updateCondition(playerNumber);
  };
  return { init, playerMark, board }; // Remove board after testing!
})();

const Block = (name) => {
  const blockName = name; // this.name = name created a mutation bug?!
  let condition = 0;
  let occupier = "none";
  const updateCondition = (playerNumber) => {
    condition = playerNumber;
    occupier = playerNumber === 1 ? "player one" : "player two";
  };
  const getName = () => blockName;
  const getCondition = () =>
    console.log(`Block ${blockName} is occupied by: ${occupier}.`);

  return { updateCondition, getName, getCondition };
};

const PlayerFactory = (name, symbol) => {
  this.name = name;
  this.symbol = symbol;
  const getName = () => this.name;
  const getSymbol = () => this.symbol;
  return { getName, getSymbol };
};
