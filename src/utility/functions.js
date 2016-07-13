export function Exception(message) {
  this.message = message;
  this.name = 'Exception';
}
/**
 * Check a game of tic-tac-toe to see if there is a winner. If there is, return
 * the winner's label. If not, return undefined. Supports tic-tac-toe grids of any
 * size
 * @param  {array} game 2D array representing game board
 * @return {string} winner of the game - undefined if no winner
 */
export function isWinner(game) {
  function check(game, player, x, y, n) {
    // cols, rows, left-diagonal, right-diagonal respectively
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) {
      counts[0] = game[x][i] === player ? counts[0] + 1 : counts[0];
      counts[1] = game[i][y] === player ? counts[1] + 1 : counts[1];
      counts[2] = game[i][i] === player ? counts[2] + 1 : counts[2];
      counts[3] = game[i][n - i - 1] === player ? counts[3] + 1 : counts[3];
    }
    return counts.some(count => count === n);
  }

  // input validation
  const n = game.length;
  if (!Array.isArray(game)) {
    throw new Exception('The input game must be a square array of arrays');
  } else {
    game.forEach(row => {
      if (!Array.isArray(row)) {
        throw new Exception('The input game must be a square array of arrays');
      }
    });
  }
  if (game.some(row => row.length !== n)) {
    throw new Exception('The input game was not a square board');
  }

  // iterate over all boxes - if the space contains a mark, search
  // all related columns, rows, and both diagonals to see if the
  // game is won
  for (let x = 0; x < game.length; x++) {
    for (let y = 0; y < game.length; y++) {
      if (game[x][y] !== '' && check(game, game[x][y], x, y, n)) {
        return game[x][y];
      }
    }
  }
  return undefined;
}

/**
 * Find all coordinates of the game that are not filled in
 * @param  {array} game 2D array representing game board
 * @return {array} array of coordinates representing the available moves
 */
export function findMoves(game) {
  const moves = [];
  for (let x = 0; x < game.length; x++) {
    for (let y = 0; y < game.length; y++) {
      if (game[x][y] === '') {
        moves.push([x, y]);
      }
    }
  }
  return moves;
}

/**
 * Determine if the game has a winner - return positive integer if the computer wins,
 * negative integer if player wins, and 0 if there is no winner.
 * @param  {array} game 2D array representing game board
 * @param  {number} depth - the current depth of the game - changes based on depth of recursion
 * @param  {string} computer - the current depth of the game - changes based on depth of recursion
 * @return {number} result of the game
 */
export function score(game, depth, computer) {
  const result = isWinner(game);
  if (result === computer) {
    return 10 - depth;
  } else if (result) {
    return depth - 10;
  }
  return 0;
}

/**
 * Recursively calculate the minimax value, accomdating for depth, of a game of tic-tac-toe
 * @param  {array} game 2D array representing game board
 * @param  {string} turn player whose turn it is (X or O)
 * @param  {string} computer - Which label (X or O) represents the computer
 * @param  {number} depth - the current depth of the game - changes based on depth of recursion
 * @return {number} result of the game
 */
export function minimax(game, turn, computer, depth) {
  // check to see if there is a winner, return from computer's perspective
  if (isWinner(game)) {
    return score(game, depth, computer);
  }

  const scores = [];
  const moves = findMoves(game);
  if (moves.length === 0) {
    return 0;
  }

  // generate all possible games and determine if they favor the computer or the oponent
  moves.forEach(move => {
    const possibleGame = JSON.parse(JSON.stringify(game));
    possibleGame[move[0]][move[1]] = turn;
    scores.push(minimax(possibleGame, turn === 'X' ? 'O' : 'X', computer, depth + 1));
  });

  if (turn === computer) {
    return Math.max.apply(Math, scores);
  }
  return Math.min.apply(Math, scores);
}

