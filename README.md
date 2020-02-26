# @phixid/in-memory-store

## Installation
```$xslt
npm install @phixid/in-memory-store
```

## Usage
Include the module at the top of your project files as follows.

for Node.js:
```$xslt
const { Store } = require('@phixid/in-memory-store');
```

for ES6 and above:
```$xslt
import { Store } from '@phixid/in-memory-store';
```

### Basic Store
A basic Store which will expire items after an hour and does not clean itself:
```$xslt
const myPersonalStore = new Store();
```

### Configured Store
There are only two configuration parameters for the Store. The first sets the amount of 
time (expressed in seconds) before an item in the store will be expired, this defaults 
to 3600 (an hour). The second will be a time interval (expressed in seconds) at which 
the store will check all entries and delete all those that have expired, this defaults 
to 0 (will not clean by default).

## API reference
### set
### get
### delete
### memo
