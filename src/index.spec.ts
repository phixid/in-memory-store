import { Store } from './index';
import { sleep } from './test-utils';

const testIndex = 1;

const testStore = new Store(10);
const futureTimestamp = Date.now() + 10000;
const pastTimestamp = Date.now() - 10000;
const mockUser = { firstname: 'Kristof', lastname: 'Hermans' };

describe('A generic store class', () => {
    describe('constructor', () => {
        test('constructor provides defaults', () => {
            const defaultStore = new Store();
            const { cleanIntervalMs, expireTimeMs } = defaultStore.getConfiguration();
            expect(cleanIntervalMs).toEqual(0);
            expect(expireTimeMs).toEqual(3600000);
        });
    });

    describe('set', () => {
        test('sets a value in store at a provided key', () => {
            testStore.set('Kristof Hermans', mockUser);
            const testUser = testStore.get('Kristof Hermans');

            expect(testUser && testUser.data).toEqual(mockUser);
        });

        test('store entry gets a timestamp for invalidation', () => {
            testStore.set('time-entry', mockUser);
            const testUser = testStore.get('time-entry');

            expect(testUser && testUser.data).toEqual(mockUser);
            expect(testUser && testUser.expires).toBeGreaterThan(
                Date.now(),
            );
        });

        test('key needs to be a string or a number', () => {
            testStore.set('user', mockUser);
            testStore.set(testIndex, mockUser);
            const testUser = testStore.get('user');
            const testUser2 = testStore.get(testIndex);

            expect(testUser && testUser.data).toEqual(mockUser);
            expect(testUser2 && testUser2.data).toEqual(mockUser);

            // @ts-ignore
            testStore.set({ name: 'Kristof' }, mockUser);
            // @ts-ignore
            expect(testStore.get({ name: 'Kristof' })).toEqual(null);
        });
    });

    describe('get', () => {
        test('gets an entry from the store', () => {
            testStore.set('user', mockUser);
            const testUser = testStore.get('user');

            expect(testUser && testUser.data).toEqual(mockUser);
        });

        test('returns null when no entry is found for a key passed to the getter', () => {
            expect(testStore.get('notFound')).toEqual(null);
        });

        test('returns null when no key is passed to the getter', () => {
            // @ts-ignore
            expect(testStore.get()).toEqual(null);
        });

        test('returns null when the entry expired', () => {
            testStore.set('testExpired', mockUser, pastTimestamp);
            expect(testStore.get('testExpired')).toEqual(null);
        });
    });

    describe('delete', () => {
        test('deletes an entry from the store', () => {
            testStore.set('testDelete', mockUser, futureTimestamp);
            testStore.delete('testDelete');
            expect(testStore.get('testDelete')).toEqual(null);
        });

        test('does nothing when no key is passed', () => {
            testStore.set('user1', mockUser, futureTimestamp);
            testStore.set('user2', mockUser, futureTimestamp);

            // @ts-ignore
            testStore.delete();
            const storeAfterDelete = testStore.getAll();

            expect(storeAfterDelete).toHaveProperty('user1');
            expect(storeAfterDelete).toHaveProperty('user2');
        });

        test('does nothing when a non-existent key is passed', () => {
            testStore.set('user1', mockUser, futureTimestamp);
            testStore.set('user2', mockUser, futureTimestamp);

            testStore.delete('gregoire');
            const storeAfterDelete = testStore.getAll();

            expect(storeAfterDelete).toHaveProperty('user1');
            expect(storeAfterDelete).toHaveProperty('user2');
        });
    });

    describe('cleaning mechanism', () => {
        test('will periodically clean when given a cleaning interval', async (done) => {
            const selfCleaningStore = new Store(10, 0.001);
            selfCleaningStore.set('user1', mockUser, pastTimestamp);
            selfCleaningStore.set('user2', mockUser, futureTimestamp);

            await sleep(1);

            expect(selfCleaningStore.getAll()).toEqual({
                user2: {
                    data: mockUser,
                    expires: futureTimestamp,
                },
            });
            done();
        });

        test('will not clean if not given a cleaning interval', async (done) => {
            testStore.set('kristof', mockUser, pastTimestamp);

            await sleep(1);

            expect(testStore.getAll()).not.toEqual({});
            done();
        });
    });
});
