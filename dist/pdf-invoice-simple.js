System.register("src/layout.js", [], function (_export) {
  "use strict";

  var table, footer;
  return {
    setters: [],
    execute: function () {
      table = {
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

      _export("table", table);

      footer = {
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

      _export("footer", footer);
    }
  };
});
System.register("src/head-table.js", ["npm:babel-runtime@5.8.38/helpers/create-class.js", "npm:babel-runtime@5.8.38/helpers/class-call-check.js"], function (_export) {
  var _createClass, _classCallCheck, HeadTable;

  return {
    setters: [function (_npmBabelRuntime5838HelpersCreateClassJs) {
      _createClass = _npmBabelRuntime5838HelpersCreateClassJs["default"];
    }, function (_npmBabelRuntime5838HelpersClassCallCheckJs) {
      _classCallCheck = _npmBabelRuntime5838HelpersClassCallCheckJs["default"];
    }],
    execute: function () {
      "use strict";

      HeadTable = (function () {
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
      })();

      _export("default", new HeadTable());
    }
  };
});
System.register("src/index.js", ["src/layout.js", "src/head-table.js", "npm:moment@2.17.1.js", "github:bpampuch/pdfmake@0.1.25.js"], function (_export) {
  "use strict";

  var tableLayout, footerLayout, headTable, moment, pdfMake, defaultStyle;

  function getTemplate(options) {
    var organizationAddress = options.organizationAddress || null;
    var billingAddress = options.billingAddress || {};
    var date = options.date || moment();
    var dueDate = options.dueDate || moment().add(10, "days");
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

    var headTableBody = headTable.getBody(leftFields, rightFields);

    var doc = {
      defaultStyle: defaultStyle,
      pageMargins: [60, 110, 60, 150],
      content: [{
        margin: [0, 30, 0, 0],
        layout: "noBorders",
        table: {
          widths: invertHeader ? ["auto", 210, 0, "auto", "auto"] : ["auto", "auto", "*", "auto", "auto"],
          body: headTableBody
        }
      }, {
        fontSize: 18,
        text: "Rechnung",
        margin: [0, 50, 0, 0]
      }, {
        margin: [0, 25, 0, 0],
        layout: tableLayout,
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
      var description = undefined;
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
      layout: footerLayout,
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
  return {
    setters: [function (_srcLayoutJs) {
      tableLayout = _srcLayoutJs.table;
      footerLayout = _srcLayoutJs.footer;
    }, function (_srcHeadTableJs) {
      headTable = _srcHeadTableJs["default"];
    }, function (_npmMoment2171Js) {
      moment = _npmMoment2171Js["default"];
    }, function (_githubBpampuchPdfmake0125Js) {
      pdfMake = _githubBpampuchPdfmake0125Js["default"];
    }],
    execute: function () {
      defaultStyle = {
        fontSize: 10
      };

      _export("default", function (options) {
        return pdfMake.createPdf(getTemplate(options));
      });
    }
  };
});
//# sourceMappingURL=pdf-invoice-simple.js.map