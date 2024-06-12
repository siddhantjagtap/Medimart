const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  Product_id: { type: Number, required: true },
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  Image_URL: { type: String, required: true }
});

const orderSchema = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  amount: { type: Number, required: true },
  orderDate: { type: String, required: true },
  subtotal:{type:Number,required:true},
      discount:{type:Number,required:true},
      deliveryFee:{type:Number,required:true},
  paymentStatus: { type: String, default: 'Not Completed' },
  cartItems: [cartItemSchema],
  razorpay_order_id: { type: String, required: true }, // Add this field
  razorpay_payment_id: { type: String }
});

const OrderDetail = mongoose.model('Order_Detail', orderSchema);

module.exports = OrderDetail;
