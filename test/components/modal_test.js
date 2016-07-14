import React from 'react';
import { sRender, fRender, expect } from '../test_helper';
import sinon from 'sinon';

import Modal from '../../src/components/modal';

describe('Modal', () => {
  let component;
  let choice;
  
  const props = {
    text: 'test text',
  };

  beforeEach(() => {
    choice = sinon.spy((input) => input);
    component = fRender(<Modal choice={choice} {...props} />);
  });

  it('Renders something', () => {
    expect(component).to.exist;
  });

  it('has the class modal', () => {
    // possible bug in enzyme .hasClass, use this work around until fix
    expect(component.first().html()).to.contain('class="modal"');
  });

  it('contains the props text', () => {
    expect(component.find('#modal-text').html()).to.contain(props.text);
  });
  
});
