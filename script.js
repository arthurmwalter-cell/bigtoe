document.addEventListener("DOMContentLoaded", () => {
  const boardEl = document.getElementById("board");
  const turnText = document.getElementById("turn");
  const body = document.body;

  const nameXInput = document.getElementById("nameX");
  const nameOInput = document.getElementById("nameO");
  const scoreXEl = document.getElementById("scoreX");
  const scoreOEl = document.getElementById("scoreO");

  let currentPlayer = "X";
  let board = Array(25).fill(null);
  let moves = { X: [], O: [] };
  let blocks = { X: [], O: [] };
  let gameOver = false;
  const maxBlocks = 3;
  const maxMoves = 3;
  let scores = { X: 0, O: 0 };

  function createBoard() {
    boardEl.innerHTML = "";
    for (let i = 0; i < 25; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => handleMove(i));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleBlock(i);
      });
      boardEl.appendChild(cell);
    }
    updateBoard();
    updateTurnText();
  }

  function toggleBlock(index) {
    if (blocks[currentPlayer].includes(index)) {
      blocks[currentPlayer] = blocks[currentPlayer].filter(i => i !== index);
    } else if (blocks[currentPlayer].length < maxBlocks && board[index] === null) {
      blocks[currentPlayer].push(index);
    }
    updateBoard();
  }

  function handleMove(index) {
    if (gameOver) return;
    if (board[index] !== null || blocks.X.includes(index) || blocks.O.includes(index)) return;

    board[index] = currentPlayer;
    moves[currentPlayer].push(index);

    if (moves[currentPlayer].length > maxMoves) {
      const removed = moves[currentPlayer].shift();
      board[removed] = null;
    }

    updateBoard();

    const winCells = checkWin(currentPlayer);
    if (winCells) {
      highlightWin(winCells);
      const name = currentPlayer === "X" ? (nameXInput.value || "Spieler X") : (nameOInput.value || "Spieler O");
      turnText.textContent = `🎉 ${name} gewinnt!`;
      gameOver = true;
      if (currentPlayer === "X") { scores.X++; scoreXEl.textContent = scores.X; }
      else { scores.O++; scoreOEl.textContent = scores.O; }
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    body.className = currentPlayer === "X" ? "x-turn" : "o-turn";
    updateTurnText();
  }

  function checkWin(player) {
    const size = 5;
    const winCells = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const i = r * size + c;
        // horizontal
        if (c <= 2 && board[i] === player && board[i+1] === player && board[i+2] === player)
          return [i, i+1, i+2];
        // vertical
        if (r <= 2 && board[i] === player && board[i+size] === player && board[i+size*2] === player)
          return [i, i+size, i+size*2];
        // diagonal \
        if (r <= 2 && c <= 2 && board[i] === player && board[i+size+1] === player && board[i+size*2+2] === player)
          return [i, i+size+1, i+size*2+2];
        // diagonal /
        if (r <= 2 && c >= 2 && board[i] === player && board[i+size-1] === player && board[i+size*2-2] === player)
          return [i, i+size-1, i+size*2-2];
      }
    }
    return null;
  }

  function highlightWin(cells) {
    cells.forEach(i => {
      const cell = boardEl.children[i];
      cell.classList.add("win-cell");
    });
  }

  function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
      if (blocks.X.includes(i)) {
        cell.style.background = "#a00";
        cell.textContent = "";
      } else if (blocks.O.includes(i)) {
        cell.style.background = "#00a";
        cell.textContent = "";
      } else {
        cell.style.background = "#1e1e1e";
        cell.textContent = board[i] ? (board[i]==="X"?"❌":"⭕") : "";
        cell.classList.remove("win-cell");
      }
    });
  }

  function updateTurnText() {
    const nameX = nameXInput.value || "Spieler X";
    const nameO = nameOInput.value || "Spieler O";

    if (currentPlayer === "X") turnText.textContent = `${nameX} ist dran ❌`;
    else turnText.textContent = `${nameO} ist dran ⭕`;
  }

  document.getElementById("reset").addEventListener("click", () => {
    board = Array(25).fill(null);
    moves = { X: [], O: [] };
    blocks = { X: [], O: [] };
    gameOver = false;
    currentPlayer = "X";
    body.className = "x-turn";
    updateBoard();
    updateTurnText();
  });

  createBoard();
});
