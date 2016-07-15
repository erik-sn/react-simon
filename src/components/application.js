if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import Modal from './modal';
import Footer from './footer';
import Wedge from './wedge';
import { Exception } from '../utility/functions';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      message: '',
      difficulty: 1,
      on: true,
      strict: false,
      started: false,
      sequenceActive: false,
      activeColor: undefined,
      colors: [],
      indexes: [],
      selectedIndexes: [],
      count: '--',
      gameOver: false,
    };
    this.togglePower = this.togglePower.bind(this);
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
    this.findDifficultyMargin = this.findDifficultyMargin.bind(this);
    this.randomColors = this.randomColors.bind(this);
    this.playSequence = this.playSequence.bind(this);
    this.checkIndexes = this.checkIndexes.bind(this);
  }

  /**
   * Set the active color of the game board and play the color's respective sound. This
   * is done on a delay using setTimeout. The delay time is set using the index of the
   * specified color. If there is a color sequence playing of length > 1 then there will
   * be multiple setTimeout functions active - one for each color. The only difference is
   * their delay.
   * @param  {object} activeColor - color object representing the color to be played
   * @param  {number} i - index of the color in the sequence
   * @param  {function} callback - callback from playSequence that is passed to resetColor
   * to call when the timing is over.
   */
  setColor(activeColor, i, callback) {
    setTimeout(() => {
      new Audio(activeColor.sound).play();
      this.setState({ activeColor }, this.resetColor(callback));
    }, (i + 1) * 1500); // the timeout length is based on the index of the array which is zero based
  }

  /**
   * Given an array of color objects play them in sequence using a promise chain
   * reducer. Add a 1000ms delay before the promise chain starts for aesthetics.
   * @param  {array} colors - list of color objects to play
   */
  playSequence(colors) {
    // click on the modal calls this function so we hide it within the setState
    this.setState({ sequenceActive: true, showModal: false });
    setTimeout(() => {
      const processed = colors.reduce((promiseChain, color) => {
        return promiseChain.then(() => new Promise((resolve, index) => {
          this.setColor(color, index, resolve);
        }));
      }, Promise.resolve());
      // after all promises are resolved allow user to interact with game
      processed.then(() => {
        this.setState({ sequenceActive: false });
      });
    }, 1000);
  }

  /**
   * Generate a new random color object, append it to the existing colors, and
   * then playSequence.
   * @param  {number} count - the current round of the game/number of colors to generate
   */
  randomColors(count) {
    if (!this.state.on || this.state.sequenceActive) {
      return;
    } else if (count === '--') {
      this.setState({ count: 1 });
    }

    const { colors, indexes } = this.state;
    const newColors = JSON.parse(JSON.stringify(colors));
    const newIndexes = JSON.parse(JSON.stringify(indexes));

    // generate random colors and sounds
    const test = {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
    };
    for (let i = 0; i < 1000; i++) {
      const testNum = Math.floor(Math.random() * 4) + 1;
      switch (testNum) {
        case 1:
          test.one = test.one + 1;
          break;
        case 2:
          test.two = test.two + 1;
          break;
        case 3:
          test.three = test.three + 1;
          break;
        case 4:
          test.four = test.four + 1;
          break;
      }
    }
    console.log(test);
    const random = Math.floor(Math.random() * 4) + 1;
    newIndexes.push(random);
    newColors.push(this.generateColorObjects(random));

    this.setState({ indexes: newIndexes, colors: newColors, started: true, selectedIndexes: [] });
    this.playSequence(newColors);
  }

  /**
   * Toggle the on state, and update any affected states to simulate turning
   * off the game.
   */
  togglePower() {
    const { on } = this.state;
    if (on) {
      this.setState({
        on: false,
        strict: false,
        started: false,
        sequenceActive: false,
        indexes: [],
        selectedIndexes: [],
        count: '',
      });
    } else {
      this.setState({
        on: true,
        count: '--',
      });
    }
  }

  /**
   * Set the active color to undefined after a delay. The delay is determined
   * by the game's difficulty setting. After it has been reset call the callback
   * function to let the parent functions know it is completed.
   * @param  {function} callback
   */
  resetColor(callback) {
    setTimeout(() => {
      this.setState({ activeColor: undefined });
      callback();
    }, (1000 / this.state.difficulty));
  }

  /**
   * Given a random number between 1 and 4 generate and return the color object
   * that corresponds to that number.
   * @param  {number} random
   * @return {object} color object
   */
  generateColorObjects(random) {
    switch (random) {
      case 1:
        return {
          index: 1,
          color: 'hsl(0, 65%, 65%)',
          sound: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
        };
      case 2:
        return {
          index: 2,
          color: 'hsl(240, 65%, 65%)',
          sound: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
        };
      case 3:
        return {
          index: 3,
          color: 'hsl(49, 100%, 80%)',
          sound: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
        };
      case 4:
        return {
          index: 4,
          color: 'hsl(120, 100%, 65%)',
          sound: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
        };
      default:
        throw new Exception('Random number must be between 1 and 4');
    }
  }

  /**
   * Called when the user clicks on a wedge attempting to mimic the sequence. Determine
   * if the user has matched the sequence and adjust the game state to reflect that
   * determination.
   * @param  {number} n
   */
  checkIndexes(n) {
    const { started, sequenceActive, indexes, selectedIndexes, count, strict } = this.state;
    if (started && !sequenceActive) {
      const updatedSelected = JSON.parse(JSON.stringify(selectedIndexes));
      updatedSelected.push(n);
      const indexesSoFar = indexes.slice(0, updatedSelected.length);
        // user matches sequence, and the sequence is over
      if (indexesSoFar.join(',') === updatedSelected.join(',')
          && indexes.length === updatedSelected.length) {
        this.win(count);
        // user matches the sequence, but the sequence is not over
      } else if (indexesSoFar.join(',') === updatedSelected.join(',')) {
        this.setState({ selectedIndexes: updatedSelected });
        return;
        // user did not match the sequence and the game is in strict mode - restart game
      } else if (strict) {
        this.lose();
        // user did not match the sequence, replay the sequence
      } else {
        this.replay();
      }
    }
  }

  /**
   * Called when the user successfully matches a sequence - either update the game
   * to the next state or declare the game over.
   * @param  {number} count
   */
  win(count) {
    new Audio('/static/ding.mp3').play();
    if (count === 20) {
      this.setState({
        message: 'You Win! Congratulations!',
        showModal: true,
        count: '--',
        sequenceActive: false,
        started: false,
        gameOver: true,
      });
    } else {
      this.setState({
        count: count + 1,
        sequenceActive: true,
      }, this.randomColors(count + 1));
    }
  }

  /**
   * Set the game state back to default
   */
  lose() {
    new Audio('/static/boom.mp3').play();
    this.setState({
      message: 'Incorrect! You lose.',
      showModal: true,
      count: '--',
      sequenceActive: false,
      started: false,
      gameOver: true,
    });
  }

  /**
   * Replay the current sequence
   */
  replay() {
    new Audio('/static/boom.mp3').play();
    this.setState({
      message: 'Incorrect! Replaying the sequence.',
      showModal: true,
      selectedIndexes: [],
      sequenceActive: true,
    });
  }

  /**
   * Incrememnt the difficulty of the game state: 1 -> 2 -> 3 -> 1
   */
  incrementDifficulty() {
    const { difficulty } = this.state;
    if (difficulty === 3) {
      this.setState({ difficulty: 1 });
    } else {
      this.setState({ difficulty: difficulty + 1 });
    }
  }

  /**
   * Return a css margin to apply to the difficulty switch to
   */
  findDifficultyMargin() {
    switch (this.state.difficulty) {
      case 1:
        return '0px';
      case 2:
        return '20px';
      default:
        return '38px';
    }
  }

  render() {
    const { showModal, count, on, started, strict, activeColor, message,
      colors, sequenceActive, gameOver } = this.state;

    const modal = (
      <Modal
        message={message}
        hideModal={!gameOver ? () => this.playSequence(colors) :
          () => this.setState({ showModal: false })}
      />
    );
    const wedgeProps = { checkIndexes: this.checkIndexes, activeColor, sequenceActive, started };

    return (
      <div>
        {showModal ? modal : ''}
        <div id="app-container" style={showModal ? { opacity: '0.3' } : {}} >
          <Wedge index={1} color="red" {...wedgeProps} />
          <Wedge index={2} color="blue" {...wedgeProps} />
          <Wedge index={3} color="yellow" {...wedgeProps} />
          <Wedge index={4} color="green" {...wedgeProps} />
          <div id="center-border-container" />
          <div id="center-container">
            <div id="label-container">Simon</div>
            <div id="settings-container">
              <div className="setting-row">
                <div className="setting-row-item" >
                  <div id="counter" >{count}</div>
                  <div className="label" style={{ width: '60px' }} >Count</div>
                </div>
                <div className="setting-row-item" style={{ marginLeft: '20px' }}>
                  <div id="start-button" onClick={() => this.randomColors(count)} />
                  <span className="label" >Start</span>
                </div>
                <div className="setting-row-item">
                  <div id="strict-mode" style={{ backgroundColor: strict ? '#FF1177' : 'black' }} />
                  <div id="strict-button" onClick={() => this.setState({ strict: !strict })} />
                  <span className="label" >Strict</span>
                </div>
              </div>
              <div className="setting-row">
                <div id="switch-container">
                  <span className="switch-child" >1</span>
                  <div className="switch-child shadow" id="difficulty-switch-container">
                    <div
                      style={{ marginLeft: this.findDifficultyMargin() }}
                      id="onoff-switch"
                      onClick={this.incrementDifficulty}
                    />
                  </div>
                  <span className="switch-child">3</span>
                </div>
                <div id="switch-container">
                  <span className="switch-child" >OFF</span>
                  <div className="switch-child shadow" id="onoff-switch-container">
                    <div
                      style={{ float: on ? 'right' : 'left' }}
                      id="onoff-switch"
                      onClick={() => this.togglePower()}
                    />
                  </div>
                  <span className="switch-child">ON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
