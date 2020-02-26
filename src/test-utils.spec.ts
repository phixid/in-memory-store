import {expect} from 'chai';

import {sleep} from './test-utils';

describe('sleep', () => {
    it('creates a promise that resolves with the number of milliseconds it should take to resolve', async () => {
        const milliseconds = 1;
        const ms = await sleep(milliseconds);
        return expect(ms).to.equal(milliseconds);
    });
});
