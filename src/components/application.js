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
      result: '',
      difficulty: 1,
      on: false,
      strict: false,
      started: false,
      sequenceActive: true,
      activeColor: undefined,
      count: 10,
    };
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
    this.findDifficultyMargin = this.findDifficultyMargin.bind(this);
    this.randomColor = this.randomColor.bind(this);
  }

  randomColor() {
    console.log('starting random');
    const { count } = this.state;

    // generate random colors and sounds
    const colors = [];
    for (let i = 0; i < count; i++) {
      const random = Math.floor(Math.random() * 4) + 1;
      colors.push(this.generateColorObjects(random));
    }
    colors.forEach((color, index) => this.setColor(color, index)); // +1 to
  }

  setColor(activeColor, i) {
    setTimeout(() => {
      console.log(activeColor.sound);
      this.setState({ activeColor }, this.resetColor);
    }, (i + 1) * 2500); // the timeout length is based on the index of the array which is zero based
  }

  resetColor() {
    setTimeout(() => {
      console.log('resetting');
      this.setState({ activeColor: undefined });
    }, 1500);
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
    const { showModal, result, count, on, strict, activeColor } = this.state;

    return (
      <div>
        {showModal ? <Modal result={result} /> : ''}
        <div id="app-container" style={showModal ? { opacity: '0.3' } : {}} >
          <div
            id="red-container"
            style={{ backgroundColor: activeColor && activeColor.index === 1 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="blue-container"
            style={{ backgroundColor: activeColor && activeColor.index === 2 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="yellow-container"
            style={{ backgroundColor: activeColor && activeColor.index === 3 ? activeColor.color : '' }}
            className="wedge"
          />
          <div
            id="green-container"
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
                  <div id="start-button" onClick={() => this.randomColor()} />
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
