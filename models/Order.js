const mongoose = require("mongoose");
const CartItem = require("./CartItem").model("cartitem").schema;
const OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  stripePayID: {
    type: String,
    required: false,
  },
  status: {
    type: String, //PAID, PREPARING, ADMIN_CANCELLED, USER_CANCELLED, OUT_FOR_DELIVERY, DELIVERED
    default: 'PAID',
    pattern:
      "(PAID)|(PREPARING)|(ADMIN_CANCELLED)|(USER_CANCELLED)|(PENDING)|(DELIVERED)",
  },
  delivery_address: {
    type:String,
    required:false
  },
  delivery_time: {
    type: Date,
    default: Date.now(),
  },
  est_delivery_time: {
    type: Date,
    default: Date.now(),
  },
  cart: [CartItem],
  amount: {
    type: Number,
    default: 0.01,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("order", OrderSchema);
