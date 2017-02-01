import { table as tableLayout, footer as footerLayout } from "./layout";
import headTable from "./head-table";
import moment from "moment";
import pdfMake from "pdfmake";

const defaultStyle = {
  fontSize: 10
};

export default (options) => {
  return pdfMake.createPdf(getTemplate(options));
};

function getTemplate(options) {
  const organizationAddress = options.organizationAddress || null;
  const billingAddress = options.billingAddress || {};
  const date = options.date || moment();
  const dueDate = options.dueDate || moment().add(10, "days");
  const invoiceNumber = options.invoiceNumber || "";
  const customerName = options.customerName || "";
  const items = options.items || [];
  const subTotal = options.subTotal || 0;
  const adjustment = options.adjustment || 0;
  const taxGroups = options.taxGroups || [];
  const total = options.total || 0;
  const currency = options.currency || "CHF";
  const note = options.note;
  const invertHeader = options.invertHeader || false;

  let leftFields = [];
  const organizationAddressText = organizationAddress ? getFlatAddressText(organizationAddress) : "";
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
  const location = (billingAddress.postCode || "") + (billingAddress.city && billingAddress.postCode ? " " : "") + (billingAddress.city || "");
  if (location) {
    leftFields.push({
      text: location
    }, "");
  }

  let rightFields = [];
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

  const oldLeftFields = leftFields;
  leftFields = invertHeader ? rightFields : leftFields;
  rightFields = invertHeader ? oldLeftFields : rightFields;

  const headTableBody = headTable.getBody(leftFields, rightFields);

  const doc = {
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
        body: [
          ["Beschreibung", {
            text: "Menge",
            alignment: "right"
          }, {
            text: "Preis",
            alignment: "right"
          }, {
            text: "Betrag",
            alignment: "right"
          }]
        ]
      }
    }]
  };

  items.forEach((item) => {
    let description;
    if (item.description) {
      description = {
        stack: [
          item.name, {
            margin: [0, 2, 0, 0],
            text: item.description,
            color: "gray"
          }
        ]
      };
    } else {
      description = item.name;
    }

    doc.content[2].table.body.push([
      description, {
        text: item.quantity.toFixed(2),
        alignment: "right"
      }, {
        text: item.rate.toFixed(2),
        alignment: "right"
      }, {
        text: item.total.toFixed(2),
        alignment: "right"
      }
    ]);
  });

  let tableFooter = [];

  if (subTotal && subTotal !== total) {
    if (adjustment || taxGroups.length) {
      tableFooter.push(
        ["Zwischensumme", {
          text: subTotal.toFixed(2),
          alignment: "right"
        }]
      );
    }
  }

  if (taxGroups.length) {
    tableFooter = tableFooter.concat(
      taxGroups.map((taxGroup) => {
        return [
          taxGroup.name, {
            text: taxGroup.amount.toFixed(2),
            alignment: "right"
          }
        ];
      })
    );
  }

  if (adjustment) {
    tableFooter.push([
      "Anpassung", {
        text: adjustment.toFixed(2),
        alignment: "right"
      }
    ]);
  }

  tableFooter.push([
    "Gesamtsumme " + currency, {
      text: total.toFixed(2),
      alignment: "right"
    }
  ]);

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
        body: [
          [{
            text: note
          }]
        ]
      },
      layout: "noBorders"
    });
  }

  return doc;
}

function getFlatAddressText(address) {
  const location = [address.postCode, address.city].join(" ").trim();

  return [address.name, address.street, location].filter((value) => {
    return value;
  }).join(", ");
}
