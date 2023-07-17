const simulate = document.getElementById('simulate')
const start = document.getElementById('start')
const target = document.getElementById('target')
const textWrapper = document.getElementById('text')
const bishop = document.createElement('img')
const BOARD_NUMBER = 1;
const ROW_NUMBER = 8;
const SQUARE_NUMBER = 8;

function setAttributes(el, attrs) {
  for(let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
setAttributes(bishop, {'src' : 'images/white.png', 'alt' : 'Bishop Piece', 'id' : 'piece'})

const chess = Array(BOARD_NUMBER).fill(null);
chess.forEach((board) => {
  board = document.createElement('div');
  board.classList.add('chess-board');

  const rows = Array(ROW_NUMBER).fill(null);
  rows.forEach((row, i) => {
    row = document.createElement('div');

    const divs = Array(SQUARE_NUMBER).fill(null);
    divs.forEach((div, j) => {
      div = document.createElement('div');
      div.classList.add('square');
      let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      if (i === ROW_NUMBER - 1) div.innerText = letters[j];
      if (j === 0) div.innerText = `${Math.abs(i - ROW_NUMBER)}`
      if(i === ROW_NUMBER - 1 && j === 0) div.innerHTML = `<span>${ Math.abs(i - ROW_NUMBER) }</span><span>${ letters[j] }</span>`
      let SQUARE_ID = `${letters[j] + Math.abs(i - ROW_NUMBER)}`
      div.setAttribute('id', SQUARE_ID)
      row.appendChild(div);
    });

    row.classList.add('row');
    board.appendChild(row);
  });

  window.main.appendChild(board);
});

const tiles = document.querySelectorAll('.square')

simulate.addEventListener('click', calculate = (e) => {
  e.preventDefault();
  const x1 = document.getElementById(`${start.value}`).getBoundingClientRect().left;
  const y1 = document.getElementById(`${start.value}`).getBoundingClientRect().top;
  const x2 = document.getElementById(`${target.value}`).getBoundingClientRect().left;
  const y2 = document.getElementById(`${target.value}`).getBoundingClientRect().top;
  const x3 = (x1-y2+y1)
  const y3 = y2
  const x4 = (x3 + x2 - y3 + y2) / 2
  const y4 = (y3 - x2 + x3 + y2) / 2

  tiles.forEach((tile, i) => {
    tile = tiles[i]
    textWrapper.addEventListener('scroll', nextMove = () => {
      if (textWrapper.scrollTop <= 176) {
        if (document.elementFromPoint(x1, y1).id === tile.id) tile.appendChild(bishop)
      } else if (textWrapper.scrollTop <= 362) {
        if (document.elementFromPoint(x4, y4).id === tile.id) tile.appendChild(bishop)
      } else {
        if (document.elementFromPoint(x2, y2).id === tile.id) tile.appendChild(bishop)
      }
    })
  })

  const way = Array(3).fill(null)
  way.forEach((text, i) => {
    text = document.createElement('p')
    text.classList.add('output-field__texts')
    if (i === 0) text.innerText = `Bishop at ${start.value.toUpperCase()}`
    for (let i = 1; i < way.length - 2; i++) {
      text.innerText = `Then to ${document.elementFromPoint(x4, y4).id}`
    }
    if (i === way.length - 1) text.innerText = `Lastly to ${target.value.toUpperCase()}`
    textWrapper.appendChild(text)
  });
})