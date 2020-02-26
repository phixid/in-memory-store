import { expect } from 'chai';
import { fake } from 'sinon';

import { Store } from './index';
import { sleep } from './test-utils';

const testIndex = 1;
const testStore = new Store(10);
const testString = 'test';
const testUser = {
  firstname: 'Kristof',
  lastname: 'Hermans',
};

const futureTimestamp = Date.now() + 10000;
const pastTimestamp = Date.now() - 10000;

describe('A generic store class', () => {
  afterEach(() => {
    testStore.clear();
  });

  describe('constructor', () => {
    it('constructor provides defaults', () => {
      const defaultStore = new Store();
      const { cleanIntervalMs, expireTimeMs } = defaultStore.getConfiguration();
      expect(cleanIntervalMs).to.equal(0);
      expect(expireTimeMs).to.equal(3600000);
    });
  });

  describe('set', () => {
    it('sets a value in store at a provided key', () => {
      testStore.set('Kristof Hermans', testUser);
      const actualUser = testStore.get('Kristof Hermans');

      expect(actualUser).to.equal(testUser);
    });

    it('key needs to be a string or a number', () => {
      testStore.set('user', testUser);
      testStore.set(testIndex, testUser);
      const actualUser = testStore.get('user');
      const actualUser2 = testStore.get(testIndex);

      expect(actualUser).to.equal(testUser);
      expect(actualUser2).to.equal(testUser);

      // @ts-ignore
      testStore.set({ name: 'Kristof' }, testUser);
      // @ts-ignore
      expect(testStore.get({ name: 'Kristof' })).to.equal(null);
    });

    it('can not alter the store constructor or __proto__ properties', () => {
      testStore.set('constructor', testString);
      testStore.set('__proto__', testString);
      const testConstructor = testStore.get('constructor');
      const testProto = testStore.get('__proto__');

      expect(testConstructor).to.not.equal(testString);
      expect(testProto).to.not.equal(testString);
    });
  });

  describe('get', () => {
    it('gets an entry from the store', () => {
      testStore.set('user', testUser);
      const actualUser = testStore.get('user');

      expect(actualUser).to.equal(testUser);
    });

    it('returns null when no key is passed to the getter', () => {
      // @ts-ignore
      expect(testStore.get()).to.equal(null);
    });

    it('returns null when no entry is found for a key passed to the getter', () => {
      expect(testStore.get('notFound')).to.equal(null);
    });

    it('return null when the entry for the key does not have an expire time', () => {
      // @ts-ignore
      testStore._store.testNoExpiration = testUser;
      expect(testStore.get('testNoExpiration')).to.equal(null);
    });

    it('returns null when the entry expired', () => {
      testStore.set('testExpired', testUser, pastTimestamp);
      expect(testStore.get('testExpired')).to.equal(null);
    });
  });

  describe('memo', () => {
    describe('when the store has a valid entry', () => {
      it('checks the store for the provided key and returns the valid entry', async () => {
        testStore.set('user', testUser);
        const actualUser = await testStore.memo('user',async () => {});

        expect(actualUser).to.equal(testUser);
      });
    });

    describe('when the store has no valid entry', () => {
      it('invokes a provided callback, stores the return value and returns a store entry', async () => {
        const callback = fake.returns(42);
        const storedValue = await testStore.memo('invalidKey', callback);

        expect(callback.called).to.equal(true);
        expect(storedValue).to.equal(42);
      });

      it('waits for a Promise to be resolved before updating the store', async () => {
        const callback = async () => 42;
        const storedValue = await testStore.memo('invalidKey', callback);

        expect(storedValue).to.equal(42);
      });
    });
  });

  describe('delete', () => {
    it('deletes an entry from the store', () => {
      testStore.set('testDelete', testUser, futureTimestamp);
      testStore.delete('testDelete');
      expect(testStore.get('testDelete')).to.equal(null);
    });

    it('does nothing when no key is passed', () => {
      testStore.set('user1', testUser, futureTimestamp);
      testStore.set('user2', testUser, futureTimestamp);

      // @ts-ignore
      testStore.delete();
      const storeAfterDelete = testStore.getAll();

      expect(storeAfterDelete).to.have.property('user1');
      expect(storeAfterDelete).to.have.property('user2');
    });

    it('does nothing when a non-existing key is passed', () => {
      testStore.set('user1', testUser, futureTimestamp);
      testStore.set('user2', testUser, futureTimestamp);

      testStore.delete('Magali');
      const storeAfterDelete = testStore.getAll();

      expect(storeAfterDelete).to.have.property('user1');
      expect(storeAfterDelete).to.have.property('user2');
    });

    it('can not delete the store constructor or __proto__ properties', () => {
      testStore.delete('constructor');
      testStore.delete('__proto__');
      const testConstructor = testStore.get('constructor');
      const testProto = testStore.get('__proto__');

      expect(testConstructor).to.not.equal(undefined);
      expect(testProto).to.not.equal(undefined);
    });
  });

  describe('cleaning mechanism', () => {
    it('will periodically clean when given a cleaning interval', async () => {
      const selfCleaningStore = new Store(10, 0.001);
      selfCleaningStore.set('user1', testUser, pastTimestamp);
      selfCleaningStore.set('user2', testUser, futureTimestamp);

      await sleep(1);

      return expect(selfCleaningStore.getAll()).to.deep.equal({
        user2: {
          data: testUser,
          expires: futureTimestamp,
        },
      });
    });

    it('will not clean if not given a cleaning interval', done => {
      testStore.set('kristof', testUser, pastTimestamp);

      sleep(1).then(_ => {
        expect(testStore.getAll()).not.to.equal({});
        done();
      });
    });
  });
});
