hexo-multilingual
=================

[![Build Status](https://travis-ci.org/ahaasler/hexo-multilingual.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-multilingual)
[![NPM version](https://badge.fury.io/js/hexo-multilingual.svg)](http://badge.fury.io/js/hexo-multilingual)
[![Dependencies](https://www.bithound.io/github/ahaasler/hexo-multilingual/badges/dependencies.svg)](https://www.bithound.io/github/ahaasler/hexo-multilingual/master/dependencies/npm)
[![Dev Dependencies](https://www.bithound.io/github/ahaasler/hexo-multilingual/badges/devDependencies.svg)](https://www.bithound.io/github/ahaasler/hexo-multilingual/master/dependencies/npm)
[![License](https://img.shields.io/github/license/ahaasler/hexo-multilingual.svg)](LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/ahaasler/hexo-multilingual.svg)](https://gitter.im/ahaasler/hexo-multilingual)

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

```yaml
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

#### `list_alternates`

Inserts a list of the page alternates.

#### Parameters

- `element`: HTML text for each alternate. Default: `<li class="alternate-list-item"><a class="alternate-list-link %currentTag" href="%url" hreflang="%lang" title="%title">%lang</a></li>`. Tokens:
  - `%title`: alternate title.
  - `%lang`: language code, e.g. `en`, `es`.
  - `%path`: alternate absolute path.
  - `%url`: alternate url.
  - `%currentTag`: `current` if the alternate is the current one; nothing otherwise.
  - `%isCurrent`: `true` if the alternate is the current one; `false` otherwise.
  - `%currentIndex`: the index of the current alternate in the list, being `0` the first alternate.
- `prepend`: HTML text that will be placed before all alternates. Default: `<ul class="alternate-list">`. Tokens:
  - `%currentIndex`: the index of the current alternate in the list, being `0` the first alternate.
- `append`: HTML text that will be placed after all alternates. Default: `</ul>`. Tokens:
  - `%currentIndex`: the index of the current alternate in the list, being `0` the first alternate.
- `showCurrent`: whether the current language should be included. Default: `true`.
- `orderby`: order of the elements. `title`, `lang` or `path`. Default: `lang`.
- `order`: sort of order. `1` for ascending; `-1` for descending. Default: `1`.

#### `list_head_alternates`

Inserts a list of the page alternates for the HTML head. This is the same as
using `list_alternates` with the following configuration:

```
{
  element: '<link rel="alternate" href="%url" hreflang="%lang" />',
  prepend: '',
  append: '',
  showCurrent: false
}
```

License
-------

This module is released under the [MIT License](http://opensource.org/licenses/MIT "The MIT License").

See [LICENSE](LICENSE "The MIT License").
