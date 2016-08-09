import $ from "jquery";
import moment from "moment";
import simpleInvoice from "../src";

const pdf = simpleInvoice({
  organizationAddress: {
    name: "Orbin",
    street: "Strasse 333",
    postCode: "3474",
    city: "Stadt"
  },
  billingAddress: {
    name: "Mein Kontakt",
    attn: "Mr. Melk",
    street: "Strasse 2",
    postCode: "78556",
    city: "Andere Stadt"
  },
  date: moment(),
  dueDate: moment().add(12, "days"),
  invoiceNumber: 12,
  customerName: "MyCompany GmbH",
  items: [{
    name: "Item Name",
    description: "Item Description",
    quantity: 2,
    rate: 200,
    total: 400
  }, {
    name: "Item Name 2",
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
  currency: "EUR",
  note: "Meine Notiz"
});
pdf.getDataUrl({}, (data) => {
  $("iframe").attr("src", data);
});
