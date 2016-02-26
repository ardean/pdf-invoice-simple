import Pdf from "pdfmake-browser";
import robotoFont from "roboto-buffer";

const defaultStyle = {
  fontSize: 10
};

const tableLayout = {
  hLineWidth: (i) => {
    return (i === 1) ? 1 : 0;
  },
  vLineWidth: () => {
    return 0;
  },
  paddingLeft: () => {
    return 0;
  },
  paddingRight: () => {
    return 0;
  },
  paddingTop: (i) => {
    return (i === 1) ? 15 : 5;
  },
  paddingBottom: () => {
    return 5;
  }
};

const footerLayout = {
  hLineWidth: (i, node) => {
    return (
      i === 0 ||
      i === node.table.body.length ||
      i === node.table.body.length - 1
    ) ? 1 : 0;
  },
  vLineWidth: () => {
    return 0;
  },
  paddingLeft: () => {
    return 0;
  },
  paddingRight: () => {
    return 0;
  },
  paddingTop: (i, node) => {
    return (
      i === 0 ||
      i === node.table.body.length - 1
    ) ? 10 : 5;
  },
  paddingBottom: (i, node) => {
    return (
      i === node.table.body.length - 1 ||
      i === node.table.body.length - 2
    ) ? 10 : 5;
  }
};

export default (invoice, profile) => {
  return new Pdf(getTemplate(invoice, profile), {
    Roboto: robotoFont
  });
};

function getTemplate(invoice, profile) {
  const organizationSettings = profile.organizationSettings;
  const address = organizationSettings.address;
  const billingAddress = invoice.billingAddress;

  const doc = {
    defaultStyle: defaultStyle,
    content: [{
      text: returnAddressText({
        name: organizationSettings.name,
        street: address.street,
        postCode: address.postCode,
        city: address.city
      }),
      margin: [0, 120, 0, 0],
      fontSize: 8,
      color: "gray"
    }, {
      margin: [0, 10, 0, 0],
      layout: "noBorders",
      table: {
        widths: ["auto", "*", "auto", "auto"],
        body: [
          [invoice.contactName || "", "", "Datum:", {
            text: invoice.date.format("DD.MM.YYYY"),
            alignment: "right"
          }],
          [billingAddress.street || "", "", "Zahlbar bis:", {
            text: invoice.dueDate.format("DD.MM.YYYY"),
            alignment: "right"
          }],
          [(billingAddress.postCode || "") + " " + (billingAddress.city || ""), "", "Rechnungsnummer:", {
            text: invoice.number.toString(),
            alignment: "right"
          }]
        ]
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

  invoice.itemDetails.forEach((itemDetail) => {
    let description = itemDetail.name;
    if (itemDetail.description) {
      description = {
        stack: [
          itemDetail.name, {
            margin: [0, 2, 0, 0],
            text: itemDetail.description,
            color: "gray"
          }
        ]
      };
    }

    doc.content[3].table.body.push([
      description, {
        text: itemDetail.quantity.toFixed(2),
        alignment: "right"
      }, {
        text: itemDetail.rate.toFixed(2),
        alignment: "right"
      }, {
        text: itemDetail.total.toFixed(2),
        alignment: "right"
      }
    ]);
  });

  const tableFooter = [
    ["Zwischensumme", {
      text: invoice.subTotal.toFixed(2),
      alignment: "right"
    }]
  ].concat(
    invoice.taxGroups.map((taxGroup) => {
      return [
        taxGroup.name, {
          text: taxGroup.amount.toFixed(2),
          alignment: "right"
        }
      ];
    })
  );

  if (invoice.adjustment) {
    tableFooter.push([
      "Anpassung", {
        text: invoice.adjustment.toFixed(2),
        alignment: "right"
      }
    ]);
  }

  tableFooter.push([
    "Gesamtsumme " + (invoice.currencyId || "CHF"), {
      text: invoice.total.toFixed(2),
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

  doc.content.push({
    text: profile.invoiceSettings.note || "",
    margin: [0, 20, 0, 0],
    color: "gray",
    fontSize: 8
  });

  return doc;
}

function returnAddressText(address) {
  const location = [address.postCode, address.city].join(" ").trim();

  return [address.name, address.street, location].filter((value) => {
    return value;
  }).join(", ");
}
