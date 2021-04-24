(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UseShoppingCart = {}, global.React));
}(this, (function (exports, react_1) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var react_1__default = /*#__PURE__*/_interopDefaultLegacy(react_1);

    function fromStorage(value) {
        return value !== null ? JSON.parse(value) : null;
    }
    function readItem(storage, key) {
        try {
            var storedValue = storage.getItem(key);
            return fromStorage(storedValue);
        }
        catch (e) {
            return null;
        }
    }
    function toStorage(value) {
        return JSON.stringify(value);
    }
    function writeItem(storage, key, value) {
        try {
            if (value !== null) {
                storage.setItem(key, toStorage(value));
            }
            else {
                storage.removeItem(key);
            }
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    function useInitialState(storage, key, defaultState) {
        var defaultStateRef = react_1__default['default'].useRef(defaultState);
        return react_1__default['default'].useMemo(function () { var _a; return (_a = readItem(storage, key)) !== null && _a !== void 0 ? _a : defaultStateRef.current; }, [
            key,
            storage,
        ]);
    }
    var useInitialState_1 = useInitialState;
    function useStorageWriter(storage, key, state) {
        var _a = react_1__default['default'].useState(undefined), writeError = _a[0], setWriteError = _a[1];
        react_1__default['default'].useEffect(function () {
            writeItem(storage, key, state).catch(function (error) {
                if (!error || !error.message || error.message !== (writeError === null || writeError === void 0 ? void 0 : writeError.message)) {
                    setWriteError(error);
                }
            });
            if (writeError) {
                return function () {
                    setWriteError(undefined);
                };
            }
        }, [state, key, writeError, storage]);
        return writeError;
    }
    var useStorageWriter_1 = useStorageWriter;
    function useStorageListener(storage, key, defaultState, onChange) {
        var defaultStateRef = react_1__default['default'].useRef(defaultState);
        var onChangeRef = react_1__default['default'].useRef(onChange);
        var firstRun = react_1__default['default'].useRef(true);
        react_1__default['default'].useEffect(function () {
            var _a;
            if (firstRun.current) {
                firstRun.current = false;
                return;
            }
            onChangeRef.current((_a = readItem(storage, key)) !== null && _a !== void 0 ? _a : defaultStateRef.current);
        }, [key, storage]);
        react_1__default['default'].useEffect(function () {
            function onStorageChange(event) {
                var _a;
                if (event.key === key) {
                    onChangeRef.current((_a = fromStorage(event.newValue)) !== null && _a !== void 0 ? _a : defaultStateRef.current);
                }
            }
            if (typeof window !== 'undefined') {
                window.addEventListener('storage', onStorageChange);
                return function () {
                    window.removeEventListener('storage', onStorageChange);
                };
            }
        }, [key]);
    }
    var useStorageListener_1 = useStorageListener;


    var common = /*#__PURE__*/Object.defineProperty({
    	useInitialState: useInitialState_1,
    	useStorageWriter: useStorageWriter_1,
    	useStorageListener: useStorageListener_1
    }, '__esModule', {value: true});

    function useStorageState(storage, key, defaultState) {
        if (defaultState === void 0) { defaultState = null; }
        var _a = react_1__default['default'].useState(common.useInitialState(storage, key, defaultState)), state = _a[0], setState = _a[1];
        common.useStorageListener(storage, key, defaultState, setState);
        var writeError = common.useStorageWriter(storage, key, state);
        return [state, setState, writeError];
    }
    var _default$1 = useStorageState;


    var state = /*#__PURE__*/Object.defineProperty({
    	default: _default$1
    }, '__esModule', {value: true});

    var FORCE_STATE_ACTION = '__FORCE_STATE_INTERNAL_API__';
    function isForceStateAction(action) {
        return (typeof action === 'object' &&
            action !== null &&
            'type' in action &&
            action.type === FORCE_STATE_ACTION);
    }
    function addForceStateActionToReducer(reducer) {
        return function (state, action) {
            if (isForceStateAction(action))
                return action.payload;
            return reducer(state, action);
        };
    }
    function useStorageReducer$1(storage, key, reducer, defaultInitialArg, defaultInit) {
        if (defaultInit === void 0) { defaultInit = function (x) { return x; }; }
        var defaultState = defaultInit(defaultInitialArg);
        var _a = react_1__default['default'].useReducer(addForceStateActionToReducer(reducer), common.useInitialState(storage, key, defaultState)), state = _a[0], dispatch = _a[1];
        common.useStorageListener(storage, key, defaultState, function (newValue) {
            dispatch({ type: FORCE_STATE_ACTION, payload: newValue });
        });
        var writeError = common.useStorageWriter(storage, key, state);
        return [state, dispatch, writeError];
    }
    var _default = useStorageReducer$1;


    var reducer = /*#__PURE__*/Object.defineProperty({
    	default: _default
    }, '__esModule', {value: true});

    state.default;

    var useStorageReducer = reducer.default;

    function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
    const isClient = typeof window === 'object';

    const formatCurrencyString = ({
      value,
      currency,
      language = isClient ? navigator.language : 'en-US'
    }) => {
      value = parseInt(value);
      const numberFormat = new Intl.NumberFormat(language, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol'
      });
      const parts = numberFormat.formatToParts(value);
      let zeroDecimalCurrency = true;

      for (const part of parts) {
        if (part.type === 'decimal') {
          zeroDecimalCurrency = false;
          break
        }
      }

      value = zeroDecimalCurrency ? value : value / 100;
      return numberFormat.format(value.toFixed(2))
    };

    function useLocalStorageReducer(key, reducer, initialState) {
      const dummyStorage = {
        getItem() {
          return null
        },
        setItem() {},
        removeItem() {}
      };
      return useStorageReducer(
        isClient ? window.localStorage : dummyStorage,
        key,
        reducer,
        initialState
      )
    }

    const getCheckoutData = {
      stripe(cart) {
        const lineItems = [];
        for (const sku in cart.cartDetails)
          lineItems.push({ price: sku, quantity: cart.cartDetails[sku].quantity });

        const options = {
          mode: 'payment',
          lineItems,
          successUrl: cart.successUrl,
          cancelUrl: cart.cancelUrl,
          billingAddressCollection: cart.billingAddressCollection
            ? 'required'
            : 'auto',
          submitType: 'auto'
        };

        if (_optionalChain([cart, 'access', _ => _.allowedCountries, 'optionalAccess', _2 => _2.length])) {
          options.shippingAddressCollection = {
            allowedCountries: cart.allowedCountries
          };
        }

        return options
      }
    };

    function checkoutHandler(cart, checkoutOptions) {
      let serviceProperty = '';
      if (cart.stripe) serviceProperty = 'stripe';

      const needsCheckoutData = cart.mode === 'client-only';

      return async function (parameters) {
        if (!serviceProperty) {
          throw new Error(
            'No compatible API has been defined, your options are: Stripe'
          )
        }

        if (!checkoutOptions.modes.includes(cart.mode)) {
          throw new Error(
            `Invalid checkout mode '${
          cart.mode
        }' was chosen. The valid modes are ${new Intl.ListFormat().format(
          checkoutOptions.modes
        )}.`
          )
        }

        let options = { sessionId: _optionalChain([parameters, 'optionalAccess', _3 => _3.sessionId]) };
        if (needsCheckoutData) options = getCheckoutData.stripe(cart);

        const { error } = await checkoutOptions[serviceProperty](
          await cart[serviceProperty],
          options,
          parameters
        );
        if (error) return error
      }
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const cartInitialState = {
      lastClicked: '',
      shouldDisplayCart: false,
      stripe: null
    };
    function cartReducer(cart, action) {
      switch (action.type) {
        case 'store-last-clicked':
          return {
            ...cart,
            lastClicked: action.id
          }

        case 'cart-click':
          return {
            ...cart,
            shouldDisplayCart: !cart.shouldDisplayCart
          }

        case 'cart-hover':
          return {
            ...cart,
            shouldDisplayCart: true
          }

        case 'close-cart':
          return {
            ...cart,
            shouldDisplayCart: false
          }

        case 'stripe-changed':
          return {
            ...cart,
            stripe: action.stripe
          }

        default:
          return cart
      }
    }

    const cartValuesInitialState = {
      cartDetails: {},
      totalPrice: 0,
      cartCount: 0
    };

    function Entry(
      product,
      quantity,
      currency,
      language,
      price_metadata,
      product_metadata
    ) {
      const id =
        product.id || product.price_id || product.sku_id || product.sku || v4();

      if (!product.price_data && price_metadata) {
        product.price_data = {
          ...price_metadata
        };
      } else if (product.price_data && price_metadata) {
        product.price_data = {
          ...product.price_data,
          ...price_metadata
        };
      }

      if (!product.product_data && product_metadata) {
        product.product_data = {
          ...product_metadata
        };
      } else if (product.product_data && product_metadata) {
        product.product_data = {
          ...product.product_data,
          ...product_metadata
        };
      }

      return {
        ...product,
        id,
        quantity,
        get value() {
          return this.price * this.quantity
        },
        get formattedValue() {
          return formatCurrencyString({
            value: this.value,
            currency,
            language
          })
        }
      }
    }
    function cartValuesReducer(state, action) {
      function createEntry(product, count, price_metadata, product_metadata) {
        const entry = Entry(
          product,
          count,
          action.currency,
          action.language,
          price_metadata,
          product_metadata
        );

        return {
          cartDetails: {
            ...state.cartDetails,
            [entry.id]: entry
          },
          totalPrice: state.totalPrice + product.price * count,
          cartCount: state.cartCount + count
        }
      }

      function updateEntry(sku, count, price_metadata, product_metadata) {
        const cartDetails = { ...state.cartDetails };
        const entry = cartDetails[sku];
        if (entry.quantity + count <= 0) return removeEntry(sku)

        if (!entry.price_data && price_metadata) {
          entry.price_data = {
            ...price_metadata
          };
        } else if (entry.price_data && price_metadata) {
          entry.price_data = {
            ...entry.price_data,
            ...price_metadata
          };
        }

        if (!entry.product_data && product_metadata) {
          entry.product_data = {
            ...product_metadata
          };
        } else if (entry.product_data && product_metadata) {
          entry.product_data = {
            ...entry.product_data,
            ...product_metadata
          };
        }

        cartDetails[sku] = Entry(
          entry,
          entry.quantity + count,
          action.currency,
          action.language,
          price_metadata,
          product_metadata
        );

        return {
          cartDetails,
          totalPrice: state.totalPrice + entry.price * count,
          cartCount: state.cartCount + count
        }
      }

      function removeEntry(sku) {
        const cartDetails = { ...state.cartDetails };
        const totalPrice = state.totalPrice - cartDetails[sku].value;
        const cartCount = state.cartCount - cartDetails[sku].quantity;
        delete cartDetails[sku];

        return { cartDetails, totalPrice, cartCount }
      }

      function updateQuantity(sku, quantity) {
        const entry = state.cartDetails[sku];
        return updateEntry(sku, quantity - entry.quantity)
      }

      switch (action.type) {
        case 'add-item-to-cart':
          if (action.count <= 0) break
          if (action.product.id in state.cartDetails)
            return updateEntry(
              action.product.id,
              action.count,
              action.price_metadata,
              action.product_metadata
            )
          return createEntry(
            action.product,
            action.count,
            action.price_metadata,
            action.product_metadata
          )

        case 'increment-item':
          if (action.count <= 0) break
          if (action.id in state.cartDetails)
            return updateEntry(action.id, action.count)
          break

        case 'decrement-item':
          if (action.count <= 0) break
          if (action.id in state.cartDetails)
            return updateEntry(action.id, -action.count)
          break

        case 'set-item-quantity':
          if (action.count < 0) break
          if (action.id in state.cartDetails)
            return updateQuantity(action.id, action.quantity)
          break

        case 'remove-item-from-cart':
          if (action.id in state.cartDetails) return removeEntry(action.id)
          break

        case 'clear-cart':
          return cartValuesInitialState

        case 'load-cart':
          if (!action.shouldMerge) state = { ...cartValuesInitialState };

          for (const sku in action.cartDetails) {
            const entry = action.cartDetails[sku];
            if (action.filter && !action.filter(entry)) continue

            state = createEntry(entry, entry.quantity);
          }
          return state

        default:
          return state
      }

      console.warn('Invalid action arguments', action);
      return state
    }

    const _jsxFileName = "/home/nwzx/webdev/use-shopping-cart/src/index.js";
    const CartContext = react_1.createContext([
      {
        lastClicked: '',
        shouldDisplayCart: false,
        ...cartValuesInitialState
      },
      () => {}
    ]);

    function CartProvider({
      children,
      mode,
      stripe,
      successUrl,
      cancelUrl,
      currency,
      language = isClient ? navigator.language : 'en-US',
      billingAddressCollection = false,
      allowedCountries = null
    }) {
      const [cart, cartDispatch] = react_1.useReducer(cartReducer, cartInitialState);

      react_1.useEffect(() => {
        cartDispatch({ type: 'stripe-changed', stripe });
      }, [stripe]);

      const [cartValues, cartValuesDispatch] = useLocalStorageReducer(
        'cart-values',
        cartValuesReducer,
        cartValuesInitialState
      );

      // combine dispatches and
      // memoize context value to avoid causing re-renders
      const contextValue = react_1.useMemo(
        () => [
          {
            ...cart,
            ...cartValues,
            mode,
            successUrl,
            cancelUrl,
            currency,
            language,
            billingAddressCollection,
            allowedCountries
          },
          (action) => {
            cartDispatch(action);
            cartValuesDispatch({ ...action, currency, language });
          }
        ],
        [
          cart,
          cartDispatch,
          cartValues,
          cartValuesDispatch,
          mode,
          successUrl,
          cancelUrl,
          currency,
          language,
          billingAddressCollection,
          allowedCountries
        ]
      );

      return (
        react_1__default['default'].createElement(CartContext.Provider, { value: contextValue, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, children)
      )
    }

    const useShoppingCart = () => {
      const [cart, dispatch] = react_1.useContext(CartContext);

      const {
        lastClicked,
        shouldDisplayCart,
        cartCount,
        cartDetails,
        totalPrice,
        currency,
        language
      } = cart;

      const addItem = (product, count = 1, price_metadata, product_metadata) => {
        dispatch({
          type: 'add-item-to-cart',
          product,
          count,
          price_metadata,
          product_metadata
        });
      };

      const removeItem = (id) => dispatch({ type: 'remove-item-from-cart', id });
      const setItemQuantity = (id, quantity) =>
        dispatch({ type: 'set-item-quantity', id, quantity });
      const incrementItem = (id, count = 1) =>
        dispatch({ type: 'increment-item', id, count });
      const decrementItem = (id, count = 1) =>
        dispatch({ type: 'decrement-item', id, count });
      const clearCart = () => dispatch({ type: 'clear-cart' });

      const storeLastClicked = (id) => dispatch({ type: 'store-last-clicked', id });
      const handleCartClick = () => dispatch({ type: 'cart-click' });
      const handleCartHover = () => dispatch({ type: 'cart-hover' });
      const handleCloseCart = () => dispatch({ type: 'close-cart' });

      const loadCart = (cartDetails, shouldMerge = true) =>
        dispatch({ type: 'load-cart', cartDetails, shouldMerge });

      const redirectToCheckout = checkoutHandler(cart, {
        modes: ['client-only', 'checkout-session'],
        stripe(stripe, options) {
          return stripe.redirectToCheckout(options)
        }
      });

      const checkoutSingleItem = checkoutHandler(cart, {
        modes: ['client-only'],
        stripe(stripe, options, { sku, quantity = 1 }) {
          options.lineItems = [{ price: sku, quantity }];
          return stripe.redirectToCheckout(options)
        }
      });

      const shoppingCart = {
        cartDetails,
        cartCount,
        totalPrice,
        get formattedTotalPrice() {
          return formatCurrencyString({
            value: totalPrice,
            currency,
            language
          })
        },

        addItem,
        removeItem,
        setItemQuantity,
        incrementItem,
        decrementItem,
        clearCart,
        lastClicked,
        storeLastClicked,
        shouldDisplayCart,
        handleCartClick,
        handleCartHover,
        handleCloseCart,
        redirectToCheckout,
        checkoutSingleItem,
        loadCart
      };
      react_1.useDebugValue(shoppingCart);
      return shoppingCart
    };

    function DebugCart(props) {
      const cart = useShoppingCart();
      const cartPropertyRows = Object.entries(cart)
        .filter(([, value]) => typeof value !== 'function')
        .map(([key, value]) => (
          react_1__default['default'].createElement('tr', { key: key, __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
            , react_1__default['default'].createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, key)
            , react_1__default['default'].createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
              , typeof value === 'object' ? (
                react_1__default['default'].createElement('button', { onClick: () => console.log(value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, "Log value" )
              ) : (
                JSON.stringify(value)
              )
            )
          )
        ));

      return (
        react_1__default['default'].createElement('table', {
          style: {
            position: 'fixed',
            top: 50,
            right: 50,
            backgroundColor: '#eee',
            textAlign: 'left',
            maxWidth: 500,
            padding: 20,
            borderSpacing: '25px 5px'
          },
          ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
        
          , react_1__default['default'].createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
            , react_1__default['default'].createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , react_1__default['default'].createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Key")
              , react_1__default['default'].createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}, "Value")
            )
          )
          , react_1__default['default'].createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, cartPropertyRows)
        )
      )
    }

    exports.CartContext = CartContext;
    exports.CartProvider = CartProvider;
    exports.DebugCart = DebugCart;
    exports.formatCurrencyString = formatCurrencyString;
    exports.isClient = isClient;
    exports.useShoppingCart = useShoppingCart;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
