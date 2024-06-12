// OrderHistory.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../Components/AuthProvider';
import moment from 'moment';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import LoadingGif from "../Components/LoadingGif";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNavigation from '../Components/UserNavigation';
import { FaFileInvoice } from "react-icons/fa";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GenerateInvoice from '../Components/GenerateInvoice';

function OrderHistory() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const handleViewInvoice = useCallback(async (razorpay_order_id) => {
    try {
      const response = await fetch(`${apiUrl}/getorderdetails/${razorpay_order_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice details');
      }
      const data = await response.json();
      setSelectedOrderDetails(data.order);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to fetch invoice details');
    }
  }, [apiUrl]);

  useEffect(() => {
    if (user) {
      fetchOrderHistory(user.email);
    }
  }, [user]);

  const fetchOrderHistory = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/orders/${email}`);
      const ordersData = response.data;
      setOrders(ordersData);
      setAddresses(ordersData.reduce((acc, order) => {
        acc[order._id] = {
          fullName: order.fullName,
          address: order.address,
          city: order.city,
          state: order.state,
          pincode: order.pincode,
          contactNo: order.contactNo
        };
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleBuyAgain = async (product) => {
    const { _id, Name, Price, Image_URL, Product_id, quantity } = product;
    const cartItem = {
      _id,
      Name,
      Price,
      Image_URL,
      quantity,
      Product_id,
      email: user.email
    };

    try {
      await axios.post(`${apiUrl}/addtocart`, cartItem);
      toast.success('Item Added To Cart', { autoClose: 2000 });
      navigate('/cart');
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 md:w-3/4 lg:w-[80%]">
      <div className='mb-6 bg-white flex flex-col items-center'>
        <UserNavigation />
      </div>
      {isLoading ? (
        <LoadingGif />
      ) : (
        <>
          {orders.length === 0 ? (
            <div className="text-center mb-4">
              <p className="text-lg text-gray-800">No orders ordered yet.</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#125872] text-white hover:bg-[#0d4255] text-sm px-4 py-2 rounded-md mt-4"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div className="space-y-8 mb-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-md overflow-hidden border border-gray-300 hover:border-[#125872]">
                  <div
                    className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className='flex'>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(0, 12)}...
                      </h3>
                      <div className="text-base md:text-md md:pl-[50rem] font-semibold text-gray-800">Total: ₹{order.amount}</div>
                    </div>
                    <div className="text-lg mb-4">
                      {expandedOrderId === order._id ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </div>
                  </div>
                  {expandedOrderId === order._id && (
                    <div className="p-4 md:p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">Delivery Address</h4>
                        {addresses[order._id] ? (
                          <div className="text-gray-700">
                            <div className='flex space-x-2'>
                            <p>{addresses[order._id].fullName}</p>
                            <p>|</p>
                            <p>{addresses[order._id].contactNo}</p>
                            </div>
                            
                            <p>{addresses[order._id].address}</p>
                            <p>{addresses[order._id].city}, {addresses[order._id].state} {addresses[order._id].pincode}</p>
                          </div>
                        ) : (
                          <p className="text-gray-600">Address information not available</p>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800">Ordered Products </h4>
                      {order.cartItems.map((item) => (
                        <div key={item._id} className="flex items-center mb-4">
                          {item.Image_URL && (
                            <img
                              src={item.Image_URL}
                              alt={item.Name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover mr-4 md:mr-6 rounded-md"
                            />
                          )}
                          <div className='flex justify-between items-center w-full'>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-gray-800">{item.Name}</h4>
                              <p className="text-xs md:text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-800">₹{item.Price}</p>
                            </div>
                            <button
                              onClick={() => handleBuyAgain(item)}
                              className="bg-[#125872] text-white hover:bg-[#0d4255] text-xs md:text-sm px-2 py-2 rounded-md"
                            >
                              Buy Again
                            </button>
                          </div>

                        </div>

                      ))}

                      <div className="flex justify-between mt-4">
                        <div>
                          <div className="text-xs md:text-sm text-gray-700">Payment Status: {order.paymentStatus}</div>
                          <div className="text-xs md:text-sm text-gray-700">Payment ID: {order.razorpay_order_id}</div>
                          <div className="text-xs md:text-sm text-gray-700">Order ID: {order._id}</div>
                        </div>
                        <div className=''>
                          <p className='text-xs md:text-sm text-gray-700'>Subtotal: ₹{order.subtotal}</p>
                          <p className='text-xs md:text-sm text-gray-700'>Discount: ₹ {order.discount}</p>
                          <p className='text-xs md:text-sm text-gray-700'>Delivery Fee: ₹ {order.deliveryFee}</p>
                          <div className="text-base md:text-lg font-semibold text-gray-800">Total: ₹{order.amount}</div>
                        </div>

                      </div>
                      {order.paymentStatus === 'Completed' && (
                        <button onClick={() => handleViewInvoice(order.razorpay_order_id)} className="mt-4 flex items-center text-[#125872] hover:underline">
                          <FaFileInvoice className="mr-2" /> Download Invoice
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedOrderDetails && <GenerateInvoice order={selectedOrderDetails} />}
        </>
      )}
    </div>
  );
}

export default OrderHistory;
