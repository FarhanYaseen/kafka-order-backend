const Yup = require("yup");

const orderSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer Name is required"),
  items: Yup.string().required("Items are required"),
  total: Yup.number()
    .required("Total is required")
    .positive("Total must be a positive number"),
});

module.exports = { orderSchema };
