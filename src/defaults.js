/**
 * Throws an error based on the warning
 * If the last argument is a DOM node, it
 * coerces it to a string before throwing.
 * @returns {undefined}
 */
const throwError = function (...args) {
  const last = args[args.length - 1]
  if ( last.outerHTML ) {
    args[args.length - 1] = `Element: \n  ${last.outerHTML}`
  }

  const error = new Error(args.join(' '))
  error.element = last

  throw error
}

/**
 * Show a warning
 * @returns {undefined}
 */
const showWarning = function (...args) {
  console.warn(...args)
}

/**
 * Creates a reporter function based on deprecated options
 * @arg {object} opts - The options passed by the user
 * @returns {function} The reporter
 */
const mkReporter = function (opts) {
  const {
    doThrow        = false
  , warningPrefix  = ''
  } = opts

  return function (info) {
    const {
      msg
    , owner
    , DOMNode
    } = info

    // build warning
    const warning = [
      owner
    , warningPrefix.concat(msg)
    ].concat(DOMNode || [])

    if ( doThrow ) {
      throwError(...warning)
    } else {
      showWarning(...warning)
    }
  }
}

/**
 * Generate a deprecation warning when a key is present
 * in the options object
 * @arg {object} opts - the options object under scrutiny
 * @arg {string} name - the name of the deprecated option
 * @arg {string} msg  - an optional reason for the deprecation
 * @returns {undefined}
 */
const deprecate = function (opts, name, msg = '') {
  if ( name in opts ) {
    console.warn(`react-a11y: the \`${name}\` options is deprecated. ${msg}`)
  }
}

/**
 * Make a certain option mandatory
 * @arg {object} opts - the options object under scrutiny
 * @arg {string} name - the name of the mandatory option
 * @arg {string} msg  - an optional reason
 * @returns {undefined}
 */
const mandatory = function (opts, name, msg = '') {
  if ( !(name in opts) ) {
    throw new Error(`react-a11y: the \`${name}\` option is mandatory. ${msg}`)
  }
}

// always resolve to true
const always = () => true

// deprecation message
const msg = 'Use the `reporter` option to change how warnings are displayed.'

/**
 * Normalize and validate the options that the user passed in.
 * @arg {object} opts - The opts the user passed in
 * @returns {object} the validated options
 */
export default function (opts = {}) {
  deprecate(opts, 'includeSrcNode', msg)
  deprecate(opts, 'throw',          msg)
  deprecate(opts, 'warningPrefix',  msg)
  mandatory(opts, 'ReactDOM')

  const {
    reporter     = mkReporter(opts) // make a reporter based on options
  , filterFn     = always
  , plugins      = []
  , rules        = {}
  } = opts

  return {
    filterFn
  , reporter
  , plugins
  , rules
  }
}

