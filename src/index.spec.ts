import {expect} from 'chai';

import {Store} from './index';
import {sleep} from './test-utils';

const testIndex = 1;

const testStore = new Store(10);
const futureTimestamp = Date.now() + 10000;
const pastTimestamp = Date.now() - 10000;
const mockUser = {firstname: 'Kristof', lastname: 'Hermans'};

describe('A generic store class', () => {
    describe('constructor', () => {
        it('constructor provides defaults', () => {
            const defaultStore = new Store();
            const {cleanIntervalMs, expireTimeMs} = defaultStore.getConfiguration();
            expect(cleanIntervalMs).to.equal(0);
            expect(expireTimeMs).to.equal(3600000);
        });
    });

    describe('set', () => {
        it('sets a value in store at a provided key', () => {
            testStore.set('Kristof Hermans', mockUser);
            const testUser = testStore.get('Kristof Hermans');

            expect(testUser && testUser.data).to.equal(mockUser);
        });

        it('store entry gets a timestamp for invalidation', () => {
            testStore.set('time-entry', mockUser);
            const testUser = testStore.get('time-entry');

            expect(testUser && testUser.data).to.equal(mockUser);
            expect(testUser && testUser.expires).to.be.above(
                Date.now(),
            );
        });

        it('key needs to be a string or a number', () => {
            testStore.set('user', mockUser);
            testStore.set(testIndex, mockUser);
            const testUser = testStore.get('user');
            const testUser2 = testStore.get(testIndex);

            expect(testUser && testUser.data).to.equal(mockUser);
            expect(testUser2 && testUser2.data).to.equal(mockUser);

            // @ts-ignore
            testStore.set({name: 'Kristof'}, mockUser);
            // @ts-ignore
            expect(testStore.get({name: 'Kristof'})).to.equal(null);
        });
    });

    describe('get', () => {
        it('gets an entry from the store', () => {
            testStore.set('user', mockUser);
            const testUser = testStore.get('user');

            expect(testUser && testUser.data).to.equal(mockUser);
        });

        it('returns null when no entry is found for a key passed to the getter', () => {
            expect(testStore.get('notFound')).to.equal(null);
        });

        it('returns null when no key is passed to the getter', () => {
            // @ts-ignore
            expect(testStore.get()).to.equal(null);
        });

        it('returns null when the entry expired', () => {
            testStore.set('testExpired', mockUser, pastTimestamp);
            expect(testStore.get('testExpired')).to.equal(null);
        });
    });

    describe('delete', () => {
        it('deletes an entry from the store', () => {
            testStore.set('testDelete', mockUser, futureTimestamp);
            testStore.delete('testDelete');
            expect(testStore.get('testDelete')).to.equal(null);
        });

        it('does nothing when no key is passed', () => {
            testStore.set('user1', mockUser, futureTimestamp);
            testStore.set('user2', mockUser, futureTimestamp);

            // @ts-ignore
            testStore.delete();
            const storeAfterDelete = testStore.getAll();

            expect(storeAfterDelete).to.have.property('user1');
            expect(storeAfterDelete).to.have.property('user2');
        });

        it('does nothing when a non-existing key is passed', () => {
            testStore.set('user1', mockUser, futureTimestamp);
            testStore.set('user2', mockUser, futureTimestamp);

            testStore.delete('gregoire');
            const storeAfterDelete = testStore.getAll();

            expect(storeAfterDelete).to.have.property('user1');
            expect(storeAfterDelete).to.have.property('user2');
        });
    });

    describe('cleaning mechanism', () => {
        it('will periodically clean when given a cleaning interval', async () => {
            const selfCleaningStore = new Store(10, 0.001);
            selfCleaningStore.set('user1', mockUser, pastTimestamp);
            selfCleaningStore.set('user2', mockUser, futureTimestamp);

            await sleep(1);

            return expect(selfCleaningStore.getAll()).to.deep.equal({
                user2: {
                    data: mockUser,
                    expires: futureTimestamp,
                },
            });
        });

        it('will not clean if not given a cleaning interval', (done) => {
            testStore.set('kristof', mockUser, pastTimestamp);

            sleep(1)
                .then(_ => {
                    expect(testStore.getAll()).not.to.equal({});
                    done();
                });
        });
    });
});
