import $ from "jquery";
import moment from "moment";
import simpleInvoice from "../src";

const invoice = {
  contactName: "Mein Kontakt",
  number: 12,
  date: moment(),
  dueDate: moment(),
  billingAddress: {
    street: "Strasse 2",
    postCode: "78556",
    city: "Andere Stadt"
  },
  itemDetails: [{
    name: "Item Name",
    quantity: 2,
    rate: 200,
    total: 400
  }],
  subTotal: 400,
  taxGroups: [{
    name: "Mehrwertsteuer",
    amount: 10
  }],
  adjustment: 20,
  total: 430,
  currencyId: "EUR"
};

const profile = {
  organizationSettings: {
    name: "Orbin",
    address: {
      street: "Strasse 333",
      postCode: "3474",
      city: "Stadt"
    }
  },
  invoiceSettings: {
    note: "Meine Notiz"
  }
};

const pdf = simpleInvoice(invoice, profile);
pdf.getBase64((data) => {
  $("iframe").attr("src", `data:application/pdf;base64,${data}`);
});
