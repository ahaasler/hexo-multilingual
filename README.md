hexo-multilingual
=================

[![Build Status](https://travis-ci.org/ahaasler/hexo-multilingual.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-multilingual)
[![NPM version](https://badge.fury.io/js/hexo-multilingual.svg)](http://badge.fury.io/js/hexo-multilingual)
[![Code Climate](https://codeclimate.com/github/ahaasler/hexo-multilingual/badges/gpa.svg)](https://codeclimate.com/github/ahaasler/hexo-multilingual)
[![Test Coverage](https://codeclimate.com/github/ahaasler/hexo-multilingual/badges/coverage.svg)](https://codeclimate.com/github/ahaasler/hexo-multilingual/coverage)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-multilingual.svg)](https://gemnasium.com/ahaasler/hexo-multilingual)
[![License](https://img.shields.io/github/license/ahaasler/hexo-multilingual.svg)](LICENSE)

Multilingual base module and utilities for [Hexo](http://hexo.io/).

Installation
------------

``` bash
npm install hexo-multilingual deepmerge --save
```

> *deepmerge* is necessary because the Hexo site is what executes the filter,
not this plugin.

Configuration
-------------

### Localization

This plugin can localize configuration values for all languages of the site.

The translations should be located in the `source/_data` folder of the Hexo
site, in files named like `config_<lang>.yml`. These files are similar to the
default Hexo configuration file.

```
# Site
title: Título
subtitle: Subtítulo
description: Descripción

# Pagination
pagination_dir: pagina

# Date / time format
post_date_format: D [de] MMMM [del] YYYY

# Directory
archive_dir: archivo
category_dir: categoria
```

Generators
----------

### Post

Overrides the default post generator in Hexo. Links the same post across
multiple languages.

#### Usage

Posts should specify:

- `lang`: post language.
- `label`: post identifier across languages. Posts with the same `label` are
considered the same post in different languages.

Filters
-------

### Configuration

Replaces the configuration in each page with the appropriate localized
configuration values.

This allows to use themes without the need to implement `_c` in the theme as
helper.

Functions
---------

### `_c`: Configuration locales

This function returns localized configuration values, or the default one if the
translation is not defined.

#### Parameters

- `value`: the desired configuration value to be retrieved.
- `lang`: the language for localization.
- `config`: the Hexo configuration object.
- `locals`: the Hexo locals object.

#### Usage

Example for a generator:

```javascript
var _c = require('hexo-multilingual').util._c;
hexo.extend.generator.register('test', function(locals) {
  var description = _c('description', 'en', this.config, locals);
  // Generator code
});
```

Helpers
-------

#### `_c`: Configuration locales

This is the same as the `_c` function in util, but accessible from the theme
layouts.

#### Parameters

- `value`: the desired configuration value to be retrieved.

#### Usage

Example in a layout:

```html
<div id="footer-description">
  <p>{{ _c('description') }}</p>
</div>
```

License
-------

This module is released under the [MIT License](http://opensource.org/licenses/MIT "The MIT License").

See [LICENSE](LICENSE "The MIT License").
