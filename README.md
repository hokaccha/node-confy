# node confy

Manage settings library, like as pit.

## Install

    $ npm install confy

## Usage

### javascript code

Get config from current profile.

``` js
var confy = require('confy');

confy.get('twitter.com', { require: {
  username: '',
  password: ''
}}, function(err, result) {
  console.log(result);
});
```

If not set values, open setting your $EDITOR.

### command line

set config

```
$ confy set twitter.com
open $EDITOR
```

get config

```
$ confy get twitter.com
{ username: 'xxx', password: 'xxx' }
```

switch profile

```
$ confy use develop
```

clean all datas

```
$ confy clean
```
