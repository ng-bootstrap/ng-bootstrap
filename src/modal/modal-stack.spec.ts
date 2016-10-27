import {NgbModalStack} from './modal-stack';

describe('modal stack', () => {

  it('should throw if a container element was not registered', () => {
    const modalStack = new NgbModalStack();
    expect(() => { modalStack.open(null, 'foo'); }).toThrowError();
  });
});
