# @phixid/in-memory-store

## Installation
```shell script
npm install @phixid/in-memory-store
```

## Usage
Include the module at the top of your project files as follows.

for Node.js:
```js
const { Store } = require('@phixid/in-memory-store');
```

for ES6 and above:
```js
import { Store } from '@phixid/in-memory-store';
```

### Basic Store
A basic Store which will expire items after an hour and does not clean itself:
```js
const myPersonalStore = new Store();
```

### Configured Store
There are only two configuration parameters for the Store. The first sets the amount of 
time (expressed in seconds) before an item in the store will be expired, this defaults 
to 3600 (an hour). The second will be a time interval (expressed in seconds) at which 
the store will check all entries and delete all those that have expired, this defaults 
to 0 (will not clean by default).

## API reference

### <a name="set"></a> set
Give it a key (string or number) and a value (any type) and it will put it in the Store.
```js
myPersonalStore.set('uniqueKey', 'this is going to be stored');
```

### <a name="get"></a> get
Give it a key and it will retrieve the entry from the Store.
```js
myPersonalStore.get('uniqueKey');
```

This gives you back an object containing the data and the time this data will be expired.
If no entry was found for the given key, or the entry has already expired, this will return `null`.
When a valid entry exists the output format will be something like:
```js
{
  data: 'this is going to be stored',
  expires: 1582724680622
}
```

### <a name="delete"></a> delete
Give it a key and it will delete the entry from the Store. This operation does not return anything.
The next time you check the Store for an entry with this key, it will not be there.
```js
myPersonalStore.delete('uniqueKey');
```

### <a name="memo"></a> memo
This is an all in one operation. Give it a key and a callback function and it will try 
to get an entry from the Store. If this does not succeed because it does not exist 
or it has already expired, it will invoke the callback and put the return value in the Store.
The return type is the same as the the one from [get](#get).
```js
myPersonalStore.memo('uniqueKey', () => 'this will be stored if there is nothing stored already')
```
