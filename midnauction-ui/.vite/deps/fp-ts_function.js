import "./chunk-V4OQ3NZ2.js";

// node_modules/fp-ts/es6/function.js
var __spreadArray = function(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var getBooleanAlgebra = function(B) {
  return function() {
    return {
      meet: function(x, y) {
        return function(a) {
          return B.meet(x(a), y(a));
        };
      },
      join: function(x, y) {
        return function(a) {
          return B.join(x(a), y(a));
        };
      },
      zero: function() {
        return B.zero;
      },
      one: function() {
        return B.one;
      },
      implies: function(x, y) {
        return function(a) {
          return B.implies(x(a), y(a));
        };
      },
      not: function(x) {
        return function(a) {
          return B.not(x(a));
        };
      }
    };
  };
};
var getSemigroup = function(S) {
  return function() {
    return {
      concat: function(f, g) {
        return function(a) {
          return S.concat(f(a), g(a));
        };
      }
    };
  };
};
var getMonoid = function(M) {
  var getSemigroupM = getSemigroup(M);
  return function() {
    return {
      concat: getSemigroupM().concat,
      empty: function() {
        return M.empty;
      }
    };
  };
};
var getSemiring = function(S) {
  return {
    add: function(f, g) {
      return function(x) {
        return S.add(f(x), g(x));
      };
    },
    zero: function() {
      return S.zero;
    },
    mul: function(f, g) {
      return function(x) {
        return S.mul(f(x), g(x));
      };
    },
    one: function() {
      return S.one;
    }
  };
};
var getRing = function(R) {
  var S = getSemiring(R);
  return {
    add: S.add,
    mul: S.mul,
    one: S.one,
    zero: S.zero,
    sub: function(f, g) {
      return function(x) {
        return R.sub(f(x), g(x));
      };
    }
  };
};
var apply = function(a) {
  return function(f) {
    return f(a);
  };
};
function identity(a) {
  return a;
}
var unsafeCoerce = identity;
function constant(a) {
  return function() {
    return a;
  };
}
var constTrue = constant(true);
var constFalse = constant(false);
var constNull = constant(null);
var constUndefined = constant(void 0);
var constVoid = constUndefined;
function flip(f) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (args.length > 1) {
      return f(args[1], args[0]);
    }
    return function(a) {
      return f(a)(args[0]);
    };
  };
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function() {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function() {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function() {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function() {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
  return;
}
function tuple() {
  var t = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    t[_i] = arguments[_i];
  }
  return t;
}
function increment(n) {
  return n + 1;
}
function decrement(n) {
  return n - 1;
}
function absurd(_) {
  throw new Error("Called `absurd` function which should be uncallable");
}
function tupled(f) {
  return function(a) {
    return f.apply(void 0, a);
  };
}
function untupled(f) {
  return function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return f(a);
  };
}
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      var ret = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
var hole = absurd;
var SK = function(_, b) {
  return b;
};
function not(predicate) {
  return function(a) {
    return !predicate(a);
  };
}
var getEndomorphismMonoid = function() {
  return {
    concat: function(first, second) {
      return flow(first, second);
    },
    empty: identity
  };
};
var dual = function(arity, body) {
  var isDataFirst = typeof arity === "number" ? function(args) {
    return args.length >= arity;
  } : arity;
  return function() {
    var args = Array.from(arguments);
    if (isDataFirst(arguments)) {
      return body.apply(this, args);
    }
    return function(self) {
      return body.apply(void 0, __spreadArray([self], args, false));
    };
  };
};
export {
  SK,
  absurd,
  apply,
  constFalse,
  constNull,
  constTrue,
  constUndefined,
  constVoid,
  constant,
  decrement,
  dual,
  flip,
  flow,
  getBooleanAlgebra,
  getEndomorphismMonoid,
  getMonoid,
  getRing,
  getSemigroup,
  getSemiring,
  hole,
  identity,
  increment,
  not,
  pipe,
  tuple,
  tupled,
  unsafeCoerce,
  untupled
};
//# sourceMappingURL=fp-ts_function.js.map
