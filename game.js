import { GameBoard } from "./app.js";

const game = (() => {
  const start = () => {
    GameBoard.init();
  };
  return { start };
})();
