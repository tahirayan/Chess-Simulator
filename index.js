const main = document.querySelector("main");
const output = document.querySelector(".output");
const input = document.querySelector("form");
const simulate = document.getElementById("simulate");
const start = document.getElementById("start");
const target = document.getElementById("target");
const textWrapper = document.querySelector(".output-text");
const bishop = document.createElement("img");
const BOARD_NUMBER = 1;
const ROW_NUMBER = 8;
const SQUARE_NUMBER = 8;

function setAttributes(el, attrs) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
setAttributes(bishop, {
  src: "images/white.png",
  alt: "Bishop Piece",
  id: "piece",
});

const chess = Array(BOARD_NUMBER).fill(null);
chess.forEach((board) => {
  board = document.createElement("div");
  board.classList.add("chess-board");

  const rows = Array(ROW_NUMBER).fill(null);
  rows.forEach((row, i) => {
    row = document.createElement("div");

    const divs = Array(SQUARE_NUMBER).fill(null);
    divs.forEach((div, j) => {
      div = document.createElement("div");
      div.classList.add("tile");
      let letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
      if (i === ROW_NUMBER - 1) div.innerText = letters[j];
      if (j === 0) div.innerText = `${Math.abs(i - ROW_NUMBER)}`;
      if (i === ROW_NUMBER - 1 && j === 0)
        div.innerHTML = `<span>${Math.abs(i - ROW_NUMBER)}</span><span>${
          letters[j]
        }</span>`;
      let SQUARE_ID = `${letters[j] + Math.abs(i - ROW_NUMBER)}`;
      div.setAttribute("id", SQUARE_ID);
      row.appendChild(div);
    });

    row.classList.add("row");
    board.appendChild(row);
  });

  main.appendChild(board);
});

const tiles = document.querySelectorAll(".tile");

const calculateBishopPath = (startFile, startRank, targetFile, targetRank) => {
  const startFileNum = startFile.charCodeAt(0) - "A".charCodeAt(0);
  const targetFileNum = targetFile.charCodeAt(0) - "A".charCodeAt(0);

  const fileDiff = targetFileNum - startFileNum;
  const rankDiff = targetRank - startRank;

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  if (Math.abs(fileDiff) === Math.abs(rankDiff)) {
    return [startFile + startRank, targetFile + targetRank];
  }

  for (let fileOffset = -7; fileOffset <= 7; fileOffset++) {
    const intermediateFileNum = startFileNum + fileOffset;
    if (intermediateFileNum < 0 || intermediateFileNum > 7) continue;

    const rankOffset = Math.abs(fileOffset);

    for (let rankDirection of [1, -1]) {
      const intermediateRank = startRank + rankOffset * rankDirection;

      if (intermediateRank < 1 || intermediateRank > 8) continue;

      const intermediateFile = letters[intermediateFileNum];

      const intermToTargetFileDiff = targetFileNum - intermediateFileNum;
      const intermToTargetRankDiff = targetRank - intermediateRank;

      if (
        Math.abs(intermToTargetFileDiff) === Math.abs(intermToTargetRankDiff)
      ) {
        return [
          startFile + startRank,
          intermediateFile + intermediateRank,
          targetFile + targetRank,
        ];
      }
    }
  }

  const direction = Math.sign(fileDiff) || 1;
  const rankDirection = Math.sign(rankDiff) || 1;
  const intermediate1FileNum = startFileNum + direction * 2;
  const intermediate1Rank = startRank + rankDirection * 2;

  const intermediate2FileNum = targetFileNum - direction * 2;
  const intermediate2Rank = targetRank - rankDirection * 2;

  if (
    intermediate1FileNum >= 0 &&
    intermediate1FileNum <= 7 &&
    intermediate1Rank >= 1 &&
    intermediate1Rank <= 8 &&
    intermediate2FileNum >= 0 &&
    intermediate2FileNum <= 7 &&
    intermediate2Rank >= 1 &&
    intermediate2Rank <= 8
  ) {
    return [
      startFile + startRank,
      letters[intermediate1FileNum] + intermediate1Rank,
      letters[intermediate2FileNum] + intermediate2Rank,
      targetFile + targetRank,
    ];
  }

  const fallbackFileNum = startFileNum + direction;
  const fallbackRank = startRank + rankDirection;

  if (
    fallbackFileNum >= 0 &&
    fallbackFileNum <= 7 &&
    fallbackRank >= 1 &&
    fallbackRank <= 8
  ) {
    return [
      startFile + startRank,
      letters[fallbackFileNum] + fallbackRank,
      targetFile + targetRank,
    ];
  }

  return [startFile + startRank, targetFile + targetRank];
};

const getTileColor = (file, rank) => {
  const fileNum = file.charCodeAt(0) - "A".charCodeAt(0) + 1;

  return (fileNum + rank) % 2 === 0 ? "black" : "white";
};

const isValidBishopMove = (startFile, startRank, targetFile, targetRank) => {
  const startColor = getTileColor(startFile, startRank);
  const targetColor = getTileColor(targetFile, targetRank);

  return startColor === targetColor;
};

simulate.addEventListener("click", (e) => {
  e.preventDefault();

  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const startPos = start.value.trim();
  const targetPos = target.value.trim();

  const startRegex = /^[A-Ha-h][1-8]$/;
  if (!startRegex.test(startPos)) {
    displayErrorMessage(
      startPos === ""
        ? "Starting position cannot be empty."
        : `Invalid starting position "${startPos}". Please enter a letter (A-H) followed by a number (1-8), e.g., "A1".`
    );
    return;
  }

  const targetRegex = /^[A-Ha-h][1-8]$/;
  if (!targetRegex.test(targetPos)) {
    displayErrorMessage(
      targetPos === ""
        ? "Target position cannot be empty."
        : `Invalid target position "${targetPos}". Please enter a letter (A-H) followed by a number (1-8), e.g., "H8".`
    );
    return;
  }

  const formattedStartPos = startPos.toUpperCase();
  const formattedTargetPos = targetPos.toUpperCase();

  const startFile = formattedStartPos[0];
  const startRank = parseInt(formattedStartPos[1]);
  const targetFile = formattedTargetPos[0];
  const targetRank = parseInt(formattedTargetPos[1]);

  if (formattedStartPos === formattedTargetPos) {
    displayErrorMessage("Starting and target positions cannot be the same.");
    return;
  }

  input.classList.add("hidden");
  output.classList.remove("hidden");

  textWrapper.innerHTML = "";

  if (!isValidBishopMove(startFile, startRank, targetFile, targetRank)) {
    displayErrorMessage(
      `Invalid move! ${bishop.alt} can only move on tiles of the same color.`
    );
    input.classList.remove("hidden");
    output.classList.add("hidden");
    return;
  }

  const path = calculateBishopPath(
    startFile,
    startRank,
    targetFile,
    targetRank
  );
  const numMoves = path.length - 1;

  const startTile = document.getElementById(formattedStartPos);
  if (startTile) {
    startTile.appendChild(bishop);
  }

  const positions = {};
  path.forEach((pos, index) => {
    const posElement = document.getElementById(pos);
    if (posElement) {
      positions[index] = {
        id: pos,
        x: posElement.getBoundingClientRect().left,
        y: posElement.getBoundingClientRect().top,
      };
    }
  });

  const numPositions = path.length;
  const scrollThreshold = textWrapper.clientHeight;

  const handleScroll = (tile) => {
    const scrollTop = textWrapper.scrollTop;
    let currentPositionIndex = Math.min(
      Math.floor(scrollTop / scrollThreshold),
      numPositions - 1
    );

    currentPositionIndex = Math.max(0, currentPositionIndex);

    const currentPosition = positions[currentPositionIndex];

    if (currentPosition && tile.id === currentPosition.id) {
      tile.appendChild(bishop);
    } else if (tile.contains(bishop)) {
      tile.removeChild(bishop);
    }
  };

  tiles.forEach((tile) => {
    textWrapper.removeEventListener("scroll", () => handleScroll(tile));
  });

  textWrapper.addEventListener("scroll", () => {
    tiles.forEach((tile) => handleScroll(tile));
  });

  tiles.forEach((tile) => handleScroll(tile));

  const moveSteps = [];
  path.forEach((pos, index) => {
    if (index === 0) {
      moveSteps.push(`Bishop at ${pos}`);
    } else {
      moveSteps.push(`Move ${index}: to ${pos}`);
    }
  });

  moveSteps.push(`Total moves: ${numMoves}`);

  moveSteps.forEach((step) => {
    const text = document.createElement("p");
    text.innerText = step;
    textWrapper.appendChild(text);
  });
});

const displayErrorMessage = (message) => {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.innerText = message;

  const formElement = document.querySelector("form");
  formElement.parentNode.insertBefore(errorMessage, formElement);

  start.classList.add("input-error");
  target.classList.add("input-error");

  const clearInputError = () => {
    start.classList.remove("input-error");
    target.classList.remove("input-error");
  };

  start.addEventListener("input", clearInputError);
  target.addEventListener("input", clearInputError);
};
