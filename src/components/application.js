if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import Modal from './modal';
import Footer from './footer';
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
      count: 1,
    };
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
    this.findDifficultyMargin = this.findDifficultyMargin.bind(this);
    this.randomColor = this.randomColor.bind(this);
    this.playColors = this.playColors.bind(this);
    this.checkIndexes = this.checkIndexes.bind(this);
  }

  randomColor(count) {
    if (!this.state.on || this.state.sequenceActive) {
      return;
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
    this.playColors(colors);
  }

  playColors(colors) {
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

  setColor(activeColor, i, callback) {
    setTimeout(() => {
      new Audio(activeColor.sound).play();
      this.setState({ activeColor }, this.resetColor(callback));
    }, (i + 1) * 1500); // the timeout length is based on the index of the array which is zero based
  }

  resetColor(callback) {
    setTimeout(() => {
      console.log('resetting');
      this.setState({ activeColor: undefined });
      callback();
    }, 1000);
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
    const { started, sequenceActive, indexes, colors, selectedIndexes, count, strict } = this.state;

    if (started && !sequenceActive) {
      const updatedSelected = JSON.parse(JSON.stringify(selectedIndexes));
      updatedSelected.push(n);
      this.setState({ selectedIndexes: updatedSelected });

      const indexesSoFar = indexes.slice(0, updatedSelected.length);
      if (indexesSoFar.join(',') === updatedSelected.join(',')
          && indexes.length === updatedSelected.length) {
        console.log('Win');
        this.setState({
          count: count + 1,
          sequenceActive: true,
        }, this.randomColor(count + 1));
        
      } else if (indexesSoFar.join(',') === updatedSelected.join(',')) {
        console.log('Continue');
      } else if (strict) {
        console.log('Lose - strict');
        new Audio('/static/buzzer.mp3').play();
        this.setState({
          message: 'Incorrect! You lose - restarting game to 1.',
          showModal: true,
          count: 1,
          sequenceActive: false,
          started: false,
        });
      } else {
        console.log('Lose - replay');
        new Audio('/static/buzzer.mp3').play();
        this.setState({
          message: 'Incorrect! Replaying the sequence.',
          showModal: true,
          selectedIndexes: [],
          sequenceActive: true,
        });
      }
    }
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
    const { showModal, count, on, strict, activeColor, message, colors } = this.state;

    return (
      <div>
        {showModal ? <Modal hideModal={() => this.playColors(colors)} message={message} /> : ''}
        <div id="app-container" style={showModal ? { opacity: '0.3' } : {}} >
          <div
            id="red-container"
            onClick={() => this.checkIndexes(1)}
            style={{ backgroundColor: activeColor && activeColor.index === 1 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="blue-container"
            onClick={() => this.checkIndexes(2)}
            style={{ backgroundColor: activeColor && activeColor.index === 2 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="yellow-container"
            onClick={() => this.checkIndexes(3)}
            style={{ backgroundColor: activeColor && activeColor.index === 3 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="green-container"
            onClick={() => this.checkIndexes(4)}
            style={{ backgroundColor: activeColor && activeColor.index === 4 ? activeColor.color : '' }}
            className="wedge"
          />
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
                  <div id="start-button" onClick={() => this.randomColor(count)} />
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
                      onClick={() => this.setState({ on: !on })}
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
