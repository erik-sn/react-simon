import React from 'react';
import { fRender, expect } from '../test_helper';

import Footer from '../../src/components/footer';

describe('Footer', () => {
  let component;

  const props = {
  };

  beforeEach(() => {
    component = fRender(<Footer {...props} />);
    
  });

  it('Renders something', () => {
    expect(component).to.exist;
  });

  it('has the class footer', () => {
    expect(component.find('.footer')).to.exist;
  });
  
  it('should contain an image', () => {
     expect(component.find('img')).to.exist; 
  });
  
});
