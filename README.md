# pdf-invoice-simple

[![Greenkeeper badge](https://badges.greenkeeper.io/ardean/pdf-invoice-simple.svg)](https://greenkeeper.io/)
[![NPM Version][npm-image]][downloads-url] [![NPM Downloads][downloads-image]][downloads-url]

**A Simple PDF Invoice Template**

Currently german only.

## Usage

```javascript
import moment from "moment";
import simpleInvoice from "pdf-invoice-simple";

simpleInvoice({
  invertHeader: true,
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
}).download("invoice.pdf");
```

## License

[MIT](LICENSE)

[downloads-image]: https://img.shields.io/npm/dm/pdf-invoice-simple.svg
[downloads-url]: https://npmjs.org/package/pdf-invoice-simple
[npm-image]: https://img.shields.io/npm/v/pdf-invoice-simple.svg
[npm-url]: https://npmjs.org/package/pdf-invoice-simple
