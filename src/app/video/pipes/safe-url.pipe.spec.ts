import { SafeURLPipe } from './safe-url.pipe';

describe('SafeURLPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeURLPipe();
    expect(pipe).toBeTruthy();
  });
});
