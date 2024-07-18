import { FbTimestampPipe } from './fb-timestamp.pipe';

describe('FbTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new FbTimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
