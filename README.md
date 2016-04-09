React A11y
==========

[![build status](https://img.shields.io/travis/reactjs/react-a11y/master.svg?style=flat-square)](https://travis-ci.org/reactjs/react-a11y)

Warns about potential accessibility issues with your React elements.

![screenshot](http://i.imgur.com/naQTETB.png)

## WIP

This is a WIP, feel free to explore, open issues, and suggest assertions :)

## Installation

Run:

```sh
npm install react-a11y
```

I want to prevent creating a new `npm` package for the fork, to reduce
confusion and ease possible merging of the forks. However, if there is
enough interest, I will probably do it anyway.

## Usage

In your main application file, require and call the module, you'll start
getting warnings in the console as your app renders.

```js
import React    from 'react'
import ReactDOM from 'react-dom'
import a11y     from 'react-a11y'

if (ENV === 'development') {
  const a11y = require('react-a11y')
  a11y(React, ReactDOM, {
    // options
  })
}
```

You probably don't want to call it if you're in production, since it patches the 
React rendering functions and this might make this slower.

## Options

These are the supported configuration options, annotated using [flow][] type
annotations

```js
a11y(React : React, ReactDOM : ReactDOM, opts : object? )
```

`React` is the React object you want to shim to allow the 
accessibility tests.

`ReactDOM` is the ReactDOM object you're using to render the
React components. This is only used on the client side, so you
can safely omit it when using `react-a11y` in node.

### `options`:
  - `plugins : [string]`
    An array of strings corresponding to names of plugins to be used.
    Eg. if the array contains `'aria-wai'` it would include the rules 
    in a (yet to be written) `react-a11y-plugin-aria-wai` module.  You
    are responsible for installing this module.

  - `rules : object`
    The configuration options for each of the rules. This uses the same format
    as [eslint][] does: 
    ```js
    const rules = {
      'img-uses-alt': 'off'
    , 'label-uses-for': [
        'warn', // other options to pass to the rule
      ]
    }

    ```

  - `reporter : object => undefined`
    Use this to modify how the warnings are displayed.
    The reporter is a function that accepts an object with
    the following keys:
    - `msg : string` - the error message
    - `tagName : string` - the tagName of the violating element (eg. `'img'`)
    - `severity : string` - the severity as configured by the user in the 
      corresponding rule configuration (one of `'off'`, `'warn'`, or `'error'`)
    - `props : object` - the props as passed to the element
    - `displayName : string?` - the `displayName` of the owner, if any
    - `DOMNode : object?` - the violating DOMNode as rendered to the browser
      DOM, this is only available on when `react-a11y` is running in the
      browser.
    - `url : string?` - The url to a webpage explaining why this rule
      is important
    The default reporter displays all the information it can, but listens
    to the deprecated options `includeSrcNode`, `warningPrefix` and
    `throwErro and `throwError`.

  - `filterFn : (string, string, string) => boolean`
    You can filter failures by passing a function to the `filterFn` option. The
    filter function will receive three arguments: the name of the Component
    instance or ReactElement, the id of the violating element, and the failure
    message.

    Note: If it is a ReactElement, the name will be the node type (eg. `div`)

    ```js
    // only show errors on CommentList
    const commentListFailures = function (name, id, msg) {
      return name === "CommentList";
    }

    a11y(React, ReactDOM, { filterFn: commentListFailures });
    ```

## Cleaning Up In Tests

Use the `restoreAll()` method to clean up mutations made to `React`.
Useful if you are using `react-a11y` in your test suite:

```js
beforeEach(() => a11y(React))
afterEach(() => a11y.restoreAll())
```

[react-a11y]: https://github.com/reactjs/react-a11y
[eslint]:     http://eslint.org
[flow]:       http://flowtype.org
