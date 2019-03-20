import { sleep } from './test-utils';

describe('sleep', () => {
    test('creates a promise that resolves with the number of milliseconds it should take to resolve', async (done) => {
        const milliseconds = 1;
        await expect(sleep(milliseconds) instanceof Promise).toEqual(true);
        await expect(sleep(milliseconds)).resolves.toEqual(milliseconds);
        done();
    });
});
