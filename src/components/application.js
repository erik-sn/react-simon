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
      on: false,
      strict: false,
      count: '25',
    };
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
                <div id="onoff-container">
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
