import jsdom from 'jsdom';
import { shallow, mount } from 'enzyme';
import chai, { expect } from 'chai';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = {
  userAgent: 'node.js'
};

function sRender(ComponentClass, state = {}) {
  const component = shallow(ComponentClass)
  if (Object.keys(state).length > 0) {
    component.setState(state);    
  }
  return component
}

function fRender(ComponentClass, state = {}) {
  const component = mount(ComponentClass)
  if (Object.keys(state).length > 0) {
    component.setState(state);    
  }
  return component
}

function storageMock() {
  const storage = {};

  return {
    setItem(key, value) {
      storage[key] = value || '';
    },
    getItem(key) {
      return storage[key] || null;
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}


export { sRender, fRender, storageMock, expect };
