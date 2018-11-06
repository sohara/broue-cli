## Module Report
### Unknown Global

**Global**: `Ember.onerror`

**Location**: `app/app.js` at line 14

```js

/* eslint no-console: "off" */
Ember.onerror = function (error) {
  console.log(error);
  throw error;
```

### Unknown Global

**Global**: `Ember.Handlebars`

**Location**: `app/helpers/simple-format.js` at line 13

```js
    fstr = fstr.replace(simpleFormatRE2, "</p>\n\n<p>"); // 2+ newline  -> paragraph
    fstr = fstr.replace(simpleFormatRE3, "$1<br/>"); // 1 newline   -> br
    fstr = new Ember.Handlebars.SafeString("<p>" + fstr + "</p>");
    return fstr;
  }
```

### Unknown Global

**Global**: `Ember.Binding`

**Location**: `app/components/convertible-text-field.js` at line 72

```js
      }
      if (typeof(this.myBinding) === 'undefined' ||  this.myBinding._from !== fromPath ) {
        this.myBinding = Ember.Binding.from(fromPath).to('valueProperty');
        this.myBinding.connect(this);
      }
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/application.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/brew.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/index.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/login.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;

export default Ember.Controller.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/notes.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { oneWay } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/user.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { alias, oneWay } = computed;

```

### Unknown Global

**Global**: `Ember.Inflector`

**Location**: `app/routes/modal-edit.js` at line 26

```js
    var parentResource = this.get('parentResource');
    var items = this.store.findAll(parentResource);
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
    this.controllerFor(inflector.pluralize(parentResource)).set('model', items);
  },
```

### Unknown Global

**Global**: `Ember.Inflector`

**Location**: `app/routes/modal-edit.js` at line 26

```js
    var parentResource = this.get('parentResource');
    var items = this.store.findAll(parentResource);
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
    this.controllerFor(inflector.pluralize(parentResource)).set('model', items);
  },
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/components/flash-messages/component.js` at line 2

```js
import Ember from 'ember';
const { inject } = Ember;

export default Ember.Component.extend({
```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/brews/edit.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/fermentables/edit.js` at line 3

```js
import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';
const { computed, inject } = Ember;
const { alias, oneWay } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/hops/edit.js` at line 3

```js
import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';
const { computed, inject } = Ember;
const { alias, oneWay } = computed;

```

### Unknown Global

**Global**: `Ember.inject`

**Location**: `app/controllers/yeasts/edit.js` at line 2

```js
import Ember from 'ember';
const { computed, inject } = Ember;
const { oneWay } = computed;

```
