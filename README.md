hexo-multilingual
=================

[![Build Status](https://travis-ci.org/ahaasler/hexo-multilingual.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-multilingual)
[![NPM version](https://badge.fury.io/js/hexo-multilingual.svg)](http://badge.fury.io/js/hexo-multilingual)
[![Coverage Status](https://coveralls.io/repos/ahaasler/hexo-multilingual/badge.svg?branch=master&service=github)](https://coveralls.io/github/ahaasler/hexo-multilingual?branch=master)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-multilingual.svg)](https://gemnasium.com/ahaasler/hexo-multilingual)
[![License](https://img.shields.io/github/license/ahaasler/hexo-multilingual.svg)](LICENSE)

Multilingual base module and utilities for [Hexo](http://hexo.io/).

Installation
------------

``` bash
npm install hexo-multilingual --save
```

Functions
---------

### `_c`: Configuration locales

This function returns localized configuration values, or the default one if the
translation is not defined.

This translations should be located in the `source/_data` folder of the Hexo
site, in files named like `config_<lang>.yml`.

#### Parameters

- `value`: the desired configuration value to be retrieved.
- `lang`: the language for localization.
- `config`: the Hexo configuration object.
- `locals`: the Hexo locals object.

#### Usage

Example for a generator:

```javascript
hexo.extend.generator.register('test', function(locals) {
	var description = _c('description', 'en', this.config, locals);
});
```

License
-------

This module is released under the [MIT License](http://opensource.org/licenses/MIT "The MIT License").

See [LICENSE](LICENSE "The MIT License").
