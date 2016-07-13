if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import Modal from './modal';
import Footer from './footer';
import Box from './box';

import { findMoves, minimax, isWinner } from '../utility/functions';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      size: window.innerHeight,
      user: undefined,
      computer: undefined,
      game: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      result: '',
    };
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.adjustSize();
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.adjustSize();
    });
  }

  /**
   * Called when the user clicks on an empty box, set this box as
   * the user's label and then let the computer take a turn
   * @param  {string} id
   */
  onSelect(id) {
    const { game } = this.state;
    const xy = id.replace('box', '');
    // generate random response for first move of the game
    const x = parseInt(xy[0], 10);
    const y = parseInt(xy[1], 10);

    // check to make sure box isn't filled in already
    if (game[x][y] === '') {
      game[x][y] = this.state.user;
      this.setState({ game });
      this.makeMove();
    }
  }

  /**
   * Set the user as X or O, and set the computer as the opposite. Then
   * let the computer make the first move.
   * @param  {string} user
   */
  setUser(user) {
    const computer = user === 'X' ? 'O' : 'X';
    const game = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    const x = Math.floor(Math.random() * 2);
    const y = Math.floor(Math.random() * 2);
    game[x][y] = computer;
    this.setState({ showModal: false, user, computer, game });
  }

  /**
   * Check the result of the game - if the computer wins or there is a
   * draw then display the result to the user through the modal
   * @param  {array} game - 2D array representing game
   * @param  {number} movesRemaining - the amount of open spaces in the game
   */
  checkResult(game, movesRemaining) {
    const result = isWinner(game);
    if (!result && movesRemaining === 0) {
      this.setState({ game, showModal: true, result: 'DRAW' });
    } else if (result) {
      this.setState({ game, showModal: true, result: 'YOU LOSE' });
    }
  }

  /**
   * Check all possible moves from the computer's perspective, and find
   * the corresponding minimax value for all of them.
   * @param  {array} game - 2D array representing tic tac toe game
   * @param  {string} computer - which icon represents the computer
   */
  getMiniMaxValues(game, computer) {
    return findMoves(game).map(move => {
      const possibleGame = JSON.parse(JSON.stringify(game));
      possibleGame[move[0]][move[1]] = computer;
      // note that the perspective taken is from the computer, so the minimax
      // values must be generated assuming the player has the next move.
      return minimax(possibleGame, computer === 'X' ? 'O' : 'X', computer, 0);
    });
  }

  /**
   * Computers move - if implements the minimax algorithm to find the 
   * most optimal move. Applies the move and then checks to see if the
   * game is complete.
   */
  makeMove() {
    const { game, computer } = this.state;
    const moves = findMoves(game);

    const miniMaxVals = this.getMiniMaxValues(game, computer);
    const max = Math.max.apply(Math, miniMaxVals);
    const index = miniMaxVals.findIndex(val => val === max);
    const move = moves[index];
    game[move[0]][move[1]] = computer;

    this.checkResult(game, moves.length - 1, computer);
  }

  /**
   * Called on app start up and whenever the window is resized to
   * keep the game on screen
   */
  adjustSize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const smallest = height < width ? height : width;
    this.setState({ size: (smallest * 0.6) / 3 });
  }

  render() {
    const { showModal, game, size, labels, result } = this.state;
    const modal = (
      <Modal result={result} choice={(input) => this.setUser(input)} text={'Choose which player you want to be:'} />
    );
    const props = { size, labels, select: this.onSelect };

    return (
      <div>
        {showModal ? modal : ''}
        <div id="app-container" style={showModal ? { opacity: '0.3', width: size * 3 } : { width: size * 3 }} >
          <div className="box-row">
            <Box id="box00" val={game[0][0]} {...props} />
            <Box id="box01" val={game[0][1]} {...props} />
            <Box id="box02" val={game[0][2]} {...props} />
          </div>
          <div className="box-row">
            <Box id="box10" val={game[1][0]} {...props} />
            <Box id="box11" val={game[1][1]} {...props} />
            <Box id="box12" val={game[1][2]} {...props} />
          </div>
          <div className="box-row">
            <Box id="box20" val={game[2][0]} {...props} />
            <Box id="box21" val={game[2][1]} {...props} />
            <Box id="box22" val={game[2][2]} {...props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
