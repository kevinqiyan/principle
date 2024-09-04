(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : String(i);
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var oldArray = Array.prototype;
  var newArray = Object.create(oldArray);

  // 数组方法：可以更改原数组的
  var arrMethods = ["push", "unshift", "shift", "pop", "sort", "reserve", "splice"];
  // 重写数组方法
  arrMethods.forEach(function (it) {
    newArray[it] = function () {
      var _oldArray$it;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_oldArray$it = oldArray[it]).call.apply(_oldArray$it, [this].concat(args));
      var init;
      switch (it) {
        case 'push':
        case 'unshift':
          init = args;
          break;
        case 'splice':
          // arr.splice(0,1,{a:1}) --> 新增一条数据
          init = args.slice(2); // 取 {a:1}
          break;
      }
      console.log('init', init);
      ob.arrayWalk(init);
      return init;
      // return result
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      // data.__ob__ = this // 这样写会 爆栈
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      if (Array.isArray(data)) {
        data.__proto__ = newArray;
        this.arrayWalk(data);
      } else {
        this.walk(data);
      }
    }
    // 对象方法劫持
    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        // 这里进行踩坑了
        Object.keys(data).forEach(function (key) {
          return defineProxy(data, key, data[key]);
        });
      }
      // 数组劫持
    }, {
      key: "arrayWalk",
      value: function arrayWalk(data) {
        data.forEach(function (it) {
          return initObserve(it);
        });
      }
    }]);
    return Observe;
  }();
  function initObserve(data) {
    if (_typeof(data) !== 'object' || data === null) return;
    if (data.__ob__ instanceof Observe) return;
    return new Observe(data);
  }
  function defineProxy(target, key, value) {
    // 如果value是对象，则采用递归的形式进行数据劫持
    initObserve(value);
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        // 为了防止赋值时数据是一个对象，对对象进行数据劫持
        initObserve(value);
        value = newValue;
      }
    });
  }

  // init state
  function initState(vm) {
    var opt = vm.$options; // 获取所有的选项
    if (opt.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data_ = data;
    console.log('初始化数据', data);
    initObserve(data);
    for (var key in data) {
      proxy(vm, '_data_', key);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  // test
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      // 初始化数据
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
