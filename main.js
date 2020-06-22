// Have two players
const player_1 = 'x'
const player_2 = 'circle' //AI

// Making player 1 for starting player
let currentPlayerIs1 = true
let resultNow
let game = false
// All winning combinations to win a game
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Selecting all elements from html
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')


// Starting game for vs Human
function startGameHuman() {
    // Removing all the previous entries if any
    cellElements.forEach(cell => {
        cell.classList.remove(player_1)
        cell.classList.remove(player_2)
        cell.removeEventListener('click', handleClickAI)
        cell.removeEventListener('click', handleClickHuman)
        cell.addEventListener('click', handleClickHuman, { once: true })
    })
    // Setting the board for starting the game
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

// After registering a click from player both human players
function handleClickHuman(e) {
    // Determining the cell that has been targeted
    const cell = e.target
    // Determining which player is curren Player
    let currentPlayer = currentPlayerIs1 ? player_1 : player_2
    placeMark(cell, currentPlayer)
    endGameHuman(currentPlayer)
    swapTurns()
    setBoardHoverClass()

}

// Starting game starting single player game with AI
function startGameAI() {
    // Removing all the previous entries if any
    cellElements.forEach(cell => {
        cell.classList.remove(player_1)
        cell.classList.remove(player_2)
        cell.removeEventListener('click', handleClickAI)
        cell.removeEventListener('click', handleClickHuman)
        cell.addEventListener('click', handleClickAI, { once: true })
    })
    // Setting the board for starting the game
    setBoardHoverClass()
    currentPlayerIs1 = true
    gane = false
    resultNow = null;
    winningMessageElement.classList.remove('show')
}

// After registering a click from player and AI
function handleClickAI(e) {
    // Determining the cell that has been targeted
    const cell = e.target
    // Determining which player is curren Player
    let currentPlayer = currentPlayerIs1 ? player_1 : player_2
    placeMark(cell, currentPlayer)
    endGameAI(currentPlayer)
    if(!winningMessageElement.classList.contains('show')){
      swapTurns()
      setBoardHoverClass()
      if (!currentPlayerIs1){
        bestMove()
      }
    }
}

// Show winning message after checking if it's a draw or a win by someone
function endGameHuman(currentPlayer) {
    let winner = checkWin(currentPlayer);
    if (!winner && isDraw()) {
        winningMessageTextElement.innerText = 'Draw!'
        winningMessageElement.classList.add('show')
        restartButton.addEventListener('click', startGameHuman)
    } else if(winner){
        winningMessageTextElement.innerText = `${currentPlayerIs1 ? "X's" : "O's"} Wins!`
        winningMessageElement.classList.add('show')
        restartButton.addEventListener('click', startGameHuman)
    }
}

// Show winning message after checking if it's a draw or a win by someone
function endGameAI(currentPlayer) {
    let winner = checkWin(currentPlayer);
    if (!winner && isDraw()) {
        winningMessageTextElement.innerText = 'Draw!'
        winningMessageElement.classList.add('show')
        restartButton.addEventListener('click', startGameAI)
    } else if(winner){
        winningMessageTextElement.innerText = `${currentPlayerIs1 ? "X's" : "O's"} Wins!`
        winningMessageElement.classList.add('show')
        restartButton.addEventListener('click', startGameAI)
    }
}


// Intermediate game state checker for minmax algorithm
function endGameCheck(currentPlayer) {
    let winner = checkWin(currentPlayer);
    if (!winner && isDraw()) {
        resultNow="tie"
    } else if(winner){
        resultNow = currentPlayer
    }
    else {
      resultNow = null
    }
    return resultNow;
}

// Determining if current board is in a draw
function isDraw() {
    // Returns True if all the cells are filled
    return [...cellElements].every(cell => {
        return cell.classList.contains(player_1) || cell.classList.contains(player_2)
    })
}

// Adding the mark of respective Player
function placeMark(cell, currentPlayer) {
    cell.classList.add(currentPlayer)
}

// Changing the current Player after current Player has made their move
function swapTurns() {
    currentPlayerIs1 = !currentPlayerIs1
}

// Setting Board for play
function setBoardHoverClass() {
    // Remove the previous players
    board.classList.remove(player_1)
    board.classList.remove(player_2)

    // Choosing the current player accordingly
    if (currentPlayerIs1) {
        board.classList.add(player_1)
    } else {
        board.classList.add(player_2)
    }
}

// Checking if current Player has won
function checkWin(currentPlayer) {
    // returns true if any of the winning combination has been done
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentPlayer)
        })
    })
}

// Choosing best cell to make a move
function bestMove() {
  let bestScore = -Infinity;
  let move;
  // Search for all empty cells and insert ai player at
  // that place and make a tree for scoring options
  for (var i = 0; i < cellElements.length; i++) {
    if (!(cellElements[i].classList.contains(player_1) || cellElements[i].classList.contains(player_2))) {
      cellElements[i].classList.add(player_2)
      let score = minimax(player_2, 0, false)
      cellElements[i].classList.remove(player_2);
      if (score > bestScore) {
        bestScore = score
        move = cellElements[i]
          }
    }
  }
  move.click()
}

// scores for Maximizing, Minimizing and tie situations
let scores = {
  x: -10,
  circle: 10,
  tie: 0
}

// Main minmax algorithm
function minimax(player, depth, isMaximizing) {
  // Check if game state has reached  conclusion
  let result = endGameCheck(player);
  if(result !== null){
    return scores[result];
  }
  // Scoring according to the respective player future best move
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (var i = 0; i < cellElements.length; i++) {
      if (!(cellElements[i].classList.contains(player_1) || cellElements[i].classList.contains(player_2))) {
        cellElements[i].classList.add(player_2)
        let score = minimax(player_2, depth + 1, false)
        cellElements[i].classList.remove(player_2);
        bestScore = Math.max(score,bestScore)
            }
      }
    return bestScore;
    }
    else {
      let bestScore = Infinity;
      for (var i = 0; i < cellElements.length; i++) {
        if (!(cellElements[i].classList.contains(player_1) || cellElements[i].classList.contains(player_2))) {
          cellElements[i].classList.add(player_1)
          let score = minimax(player_1, depth + 1, true)
          cellElements[i].classList.remove(player_1);
          bestScore = Math.min(score,bestScore)
        }
      }
      return bestScore;
    }
  }
