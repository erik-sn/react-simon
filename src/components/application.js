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

  setColor(activeColor, i, callback) {
    setTimeout(() => {
      new Audio(activeColor.sound).play();
      this.setState({ activeColor }, this.resetColor(callback));
    }, (i + 1) * 1500); // the timeout length is based on the index of the array which is zero based
  }

  playSequence(colors) {
    this.setState({ sequenceActive: true, showModal: false });
    setTimeout(() => {
      const processed = colors.reduce((promiseChain, color) => {
        return promiseChain.then(() => new Promise((resolve, index) => {
          this.setColor(color, index, resolve);
        }));
      }, Promise.resolve());

      processed.then(() => {
        this.setState({ sequenceActive: false });
      });
    }, 1000);
  }

  randomColors(count) {
    if (!this.state.on || this.state.sequenceActive) {
      return;
    } else if (count === '--') {
      count = 1;
      this.setState({ count });
    }

    // generate random colors and sounds
    const colors = [];
    const indexes = [];
    for (let i = 0; i < count; i++) {
      const random = Math.floor(Math.random() * 4) + 1;
      indexes.push(random);
      colors.push(this.generateColorObjects(random));
    }
    this.setState({ indexes, colors, started: true, selectedIndexes: [] });
    this.playSequence(colors);
  }

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

  resetColor(callback) {
    setTimeout(() => {
      this.setState({ activeColor: undefined });
      callback();
    }, (1000 / this.state.difficulty));
  }

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

  checkIndexes(n) {
    const { started, sequenceActive, indexes, selectedIndexes, count, strict } = this.state;
    if (started && !sequenceActive) {
      const updatedSelected = JSON.parse(JSON.stringify(selectedIndexes));
      updatedSelected.push(n);
      const indexesSoFar = indexes.slice(0, updatedSelected.length);
      if (indexesSoFar.join(',') === updatedSelected.join(',')
          && indexes.length === updatedSelected.length) {
        this.win(count);
      } else if (indexesSoFar.join(',') === updatedSelected.join(',')) {
        this.setState({ selectedIndexes: updatedSelected });
        return;
      } else if (strict) {
        this.lose();
      } else {
        this.replay();
      }
    }
  }

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

  replay() {
    new Audio('/static/boom.mp3').play();
    this.setState({
      message: 'Incorrect! Replaying the sequence.',
      showModal: true,
      selectedIndexes: [],
      sequenceActive: true,
    });
  }

  incrementDifficulty() {
    const { difficulty } = this.state;
    if (difficulty === 3) {
      this.setState({ difficulty: 1 });
    } else {
      this.setState({ difficulty: difficulty + 1 });
    }
  }

  findDifficultyMargin() {
    let marginLeft;
    switch (this.state.difficulty) {
      case 1:
        marginLeft = '0px';
        break;
      case 2:
        marginLeft = '20px';
        break;
      default:
        marginLeft = '38px';
    }
    return marginLeft;
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
