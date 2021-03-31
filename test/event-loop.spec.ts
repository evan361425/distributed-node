import { expect } from 'chai';
import { readFile } from 'fs';
import { fake } from 'sinon';

describe('Event Loop', () => {
  it('should follow phase order', async () => {
    const action = fake();
    // Action
    await new Promise((res) => {
      setImmediate(() => action(1));
      void Promise.resolve().then(() => action(2));
      process.nextTick(() => action(3));
      readFile(__filename, () => {
        action(4);
        setTimeout(() => action(5));
        setImmediate(() => action(6));
        process.nextTick(() => action(7));
        setTimeout(res, 10);
      });
      action(8);
    });
    // Assertion
    expect(action.getCalls().map((call) => call.firstArg)).to.eql([
      8,
      3,
      2,
      1,
      4,
      7,
      6,
      5,
    ]);
  });

  it('should follow phase in "async" "await" patter', async () => {
    const sleep_st = (t: number) => new Promise((r) => setTimeout(r, t));
    const sleep_im = () => new Promise((r) => setImmediate(r));
    const action = fake();
    // Action
    await new Promise(async (res) => {
      setImmediate(() => action(1));
      action(2);
      await sleep_st(0);
      setImmediate(() => action(3));
      action(4);
      await sleep_im();
      setImmediate(() => action(5));
      action(6);
      await 1;
      setImmediate(() => action(7));
      action(8);
      setTimeout(res, 10);
    });
    // Assertion
    expect(action.getCalls().map((call) => call.firstArg)).to.eql([
      2,
      1,
      4,
      3,
      6,
      8,
      5,
      7,
    ]);
  });
});
