(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("moment"), require("pdfmake-browser"), require("roboto-base64"));
	else if(typeof define === 'function' && define.amd)
		define(["moment", "pdfmake-browser", "roboto-base64"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("moment"), require("pdfmake-browser"), require("roboto-base64")) : factory(root["moment"], root["pdfmake-browser"], root["roboto-base64"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _layout = __webpack_require__(1);

	var _headTable = __webpack_require__(2);

	var _headTable2 = _interopRequireDefault(_headTable);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _pdfmakeBrowser = __webpack_require__(4);

	var _pdfmakeBrowser2 = _interopRequireDefault(_pdfmakeBrowser);

	var _robotoBase = __webpack_require__(5);

	var _robotoBase2 = _interopRequireDefault(_robotoBase);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaultStyle = {
	  fontSize: 10
	};

	exports.default = function (options) {
	  return new _pdfmakeBrowser2.default(getTemplate(options), {
	    Roboto: _robotoBase2.default
	  });
	};

	function getTemplate(options) {
	  var organizationAddress = options.organizationAddress || null;
	  var billingAddress = options.billingAddress || {};
	  var date = options.date || (0, _moment2.default)();
	  var dueDate = options.dueDate || (0, _moment2.default)().add(10, "days");
	  var invoiceNumber = options.invoiceNumber || "";
	  var customerName = options.customerName || "";
	  var items = options.items || [];
	  var subTotal = options.subTotal || 0;
	  var adjustment = options.adjustment || 0;
	  var taxGroups = options.taxGroups || [];
	  var total = options.total || 0;
	  var currency = options.currency || "CHF";
	  var note = options.note;
	  var invertHeader = options.invertHeader || false;

	  var leftFields = [];
	  var organizationAddressText = organizationAddress ? getFlatAddressText(organizationAddress) : "";
	  if (organizationAddressText) {
	    leftFields.push({
	      text: organizationAddressText,
	      fontSize: 8,
	      color: "gray",
	      margin: [0, 0, 0, 10]
	    }, "");
	  }
	  if (billingAddress.name) {
	    leftFields.push({
	      text: billingAddress.name
	    }, "");
	  }
	  if (billingAddress.attn) {
	    leftFields.push({
	      text: billingAddress.attn
	    }, "");
	  }
	  if (billingAddress.street) {
	    leftFields.push({
	      text: billingAddress.street
	    }, "");
	  }
	  var location = (billingAddress.postCode || "") + (billingAddress.city && billingAddress.postCode ? " " : "") + (billingAddress.city || "");
	  if (location) {
	    leftFields.push({
	      text: location
	    }, "");
	  }

	  var rightFields = [];
	  if (organizationAddressText) {
	    rightFields.push({
	      text: ""
	    }, "");
	  }
	  if (date) {
	    rightFields.push({
	      text: "Datum:"
	    }, {
	      text: date.format("DD.MM.YYYY")
	    });
	  }
	  if (dueDate) {
	    rightFields.push({
	      text: "Zahlbar bis:"
	    }, {
	      text: dueDate.format("DD.MM.YYYY")
	    });
	  }
	  if (invoiceNumber) {
	    rightFields.push({
	      text: "Rechnungsnummer:"
	    }, {
	      text: invoiceNumber.toString()
	    });
	  }
	  if (customerName) {
	    rightFields.push({
	      text: "Kunde:"
	    }, {
	      text: customerName
	    });
	  }

	  var oldLeftFields = leftFields;
	  leftFields = invertHeader ? rightFields : leftFields;
	  rightFields = invertHeader ? oldLeftFields : rightFields;

	  var headTableBody = _headTable2.default.getBody(leftFields, rightFields);

	  var doc = {
	    defaultStyle: defaultStyle,
	    pageMargins: [60, 110, 60, 150],
	    content: [{
	      margin: [0, 30, 0, 0],
	      layout: "noBorders",
	      table: {
	        widths: ["auto", "auto", "*", "auto", "auto"],
	        body: headTableBody
	      }
	    }, {
	      fontSize: 18,
	      text: "Rechnung",
	      margin: [0, 50, 0, 0]
	    }, {
	      margin: [0, 25, 0, 0],
	      layout: _layout.table,
	      table: {
	        headerRows: 1,
	        widths: ["*", 70, 70, 70],
	        body: [["Beschreibung", {
	          text: "Menge",
	          alignment: "right"
	        }, {
	          text: "Preis",
	          alignment: "right"
	        }, {
	          text: "Betrag",
	          alignment: "right"
	        }]]
	      }
	    }]
	  };

	  items.forEach(function (item) {
	    var description = void 0;
	    if (item.description) {
	      description = {
	        stack: [item.name, {
	          margin: [0, 2, 0, 0],
	          text: item.description,
	          color: "gray"
	        }]
	      };
	    } else {
	      description = item.name;
	    }

	    doc.content[2].table.body.push([description, {
	      text: item.quantity.toFixed(2),
	      alignment: "right"
	    }, {
	      text: item.rate.toFixed(2),
	      alignment: "right"
	    }, {
	      text: item.total.toFixed(2),
	      alignment: "right"
	    }]);
	  });

	  var tableFooter = [];

	  if (subTotal && subTotal !== total) {
	    if (adjustment || taxGroups.length) {
	      tableFooter.push(["Zwischensumme", {
	        text: subTotal.toFixed(2),
	        alignment: "right"
	      }]);
	    }
	  }

	  if (taxGroups.length) {
	    tableFooter = tableFooter.concat(taxGroups.map(function (taxGroup) {
	      return [taxGroup.name, {
	        text: taxGroup.amount.toFixed(2),
	        alignment: "right"
	      }];
	    }));
	  }

	  if (adjustment) {
	    tableFooter.push(["Anpassung", {
	      text: adjustment.toFixed(2),
	      alignment: "right"
	    }]);
	  }

	  tableFooter.push(["Gesamtsumme " + currency, {
	    text: total.toFixed(2),
	    alignment: "right"
	  }]);

	  doc.content.push({
	    margin: [0, 25, 0, 0],
	    layout: _layout.footer,
	    table: {
	      headerRows: 1,
	      widths: ["*", "auto"],
	      body: tableFooter
	    }
	  });

	  if (note) {
	    doc.content.push({
	      margin: [0, 20, 0, 0],
	      color: "gray",
	      fontSize: 8,
	      table: {
	        dontBreakRows: true,
	        body: [[{
	          text: note
	        }]]
	      },
	      layout: "noBorders"
	    });
	  }

	  return doc;
	}

	function getFlatAddressText(address) {
	  var location = [address.postCode, address.city].join(" ").trim();

	  return [address.name, address.street, location].filter(function (value) {
	    return value;
	  }).join(", ");
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var table = exports.table = {
	  hLineWidth: function hLineWidth(i) {
	    return i === 1 ? 1 : 0;
	  },
	  vLineWidth: function vLineWidth() {
	    return 0;
	  },
	  paddingLeft: function paddingLeft() {
	    return 0;
	  },
	  paddingRight: function paddingRight() {
	    return 0;
	  },
	  paddingTop: function paddingTop(i) {
	    return i === 1 ? 15 : 5;
	  },
	  paddingBottom: function paddingBottom() {
	    return 5;
	  }
	};

	var footer = exports.footer = {
	  hLineWidth: function hLineWidth(i, node) {
	    return i === 0 || i === node.table.body.length || i === node.table.body.length - 1 ? 1 : 0;
	  },
	  vLineWidth: function vLineWidth() {
	    return 0;
	  },
	  paddingLeft: function paddingLeft() {
	    return 0;
	  },
	  paddingRight: function paddingRight() {
	    return 0;
	  },
	  paddingTop: function paddingTop(i, node) {
	    return i === 0 || i === node.table.body.length - 1 ? 10 : 5;
	  },
	  paddingBottom: function paddingBottom(i, node) {
	    return i === node.table.body.length - 1 || i === node.table.body.length - 2 ? 10 : 5;
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HeadTable = function () {
	  function HeadTable() {
	    _classCallCheck(this, HeadTable);
	  }

	  _createClass(HeadTable, [{
	    key: "getBody",
	    value: function getBody(leftFields, rightFields) {
	      var headTableBody = [];
	      var tableHeight = Math.max(leftFields.length, rightFields.length);

	      for (var i = 0; i < tableHeight; i += 2) {
	        var left = this.getField(leftFields[i]);
	        var left2 = this.getField(leftFields[i + 1]);

	        var right = this.getField(rightFields[i]);
	        var right2 = this.getField(rightFields[i + 1]);

	        var line = [].concat(left, left2, "", right, right2);
	        headTableBody.push(line);
	      }

	      return headTableBody;
	    }
	  }, {
	    key: "getField",
	    value: function getField(field) {
	      if (!field) return "";
	      return field;
	    }
	  }]);

	  return HeadTable;
	}();

	exports.default = new HeadTable();

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;