if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import Modal from './modal';
import Footer from './footer';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      result: '',
      difficulty: 1,
      on: false,
      strict: false,
      count: '--',
    };
    this.incrementDifficulty = this.incrementDifficulty.bind(this);
    this.findDifficultyMargin = this.findDifficultyMargin.bind(this);
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
    const { showModal, result, count, on, strict } = this.state;   

    return (
      <div>
        {showModal ? <Modal result={result} /> : ''}
        <div id="app-container" style={showModal ? { opacity: '0.3' } : {}} >
          <div id="green-container" className="wedge" />
          <div id="red-container" className="wedge" />
          <div id="blue-container" className="wedge" />
          <div id="yellow-container" className="wedge" />
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
                  <div id="start-button" />
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
