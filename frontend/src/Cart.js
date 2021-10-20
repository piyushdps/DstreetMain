import Axios from "axios";
import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StripeCheckout from "react-stripe-checkout";
import Login from "./Login";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
function Cart({ refreshCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState({});
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [deliveryTime, setDeliveryTime] = useState(new Date());

  useEffect(() => {
    if (error !== "")
      toast.error("Error: " + error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  }, [error]);

  const refreshCartPage = (suppressToast = false) => {
    Axios.get(  "/user/me", {
      withCredentials: true,
    })
      .then((res) => {
        setCartItems(res.data.cart);
        let amount = res.data.cart.reduce(
          (acc, ele) => acc + ele.price * ele.qty,
          0
        );
        setOrder({
          cart: res.data.cart,
          amount: amount,
          address: res.data.address,
        });
        setTotal(amount);
        setIsLoggedIn(true);
        if (!suppressToast) {
          toast.success("Cart updated!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        refreshCart();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            setIsLoggedIn(false);
            setError("Please log in first.");
          } else
            setError(err.response.status + " " + err.response.data.message);
        }
      });
  };
  useEffect(() => {
    refreshCartPage(true);
    return () => {};
  }, []);

  const makePayment = (token) => {
    const body = {
      token,
      order,
      deliveryTime,
    };
    Axios({
      url:   "/order/",
      method: "post",
      data: body,
      withCredentials: true,
    })
      .then(async (res) => {
        await Axios.delete(  "/cart/", {
          withCredentials: true,
        });
        toast.success(
          "Order successful 😎! Visit orders to see where the food at.",
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        refreshCartPage(true);
      })
      .catch((err) => {
        if (err.response)
          setError(err.response.data.message || "Error in payment.");
      });
  };

  if (!isLoggedIn)
    return <Login loginHandler={refreshCartPage} redirectTo="/cart" />;
  return (
    <>
      <div className="title is-1 has-text-centered columns is-centered mb-5">
        <span className="is-italic column is-4">Review your order</span>
      </div>
      <div className="columns is-centered is-desktop">
        <div className="column is-half">
          {cartItems.map((x) => {
            return (
              <CartItem
                {...x}
                key={"cartItem" + x.itemId}
                refreshCart={refreshCartPage}
              />
            );
          })}
          {cartItems?.length === 0 && (
            <div className="title is-6 box">
              Ahh! Seems like your cart is empty,<br/>
              Grab some dishes, and be here again, we'll get you a bill and the
              food will be on its way to your table!
            </div>
          )}
        </div>
        <div className="column is-3 box p-4">
          <div className="title is-3 mb-1">Total: ₹{total}</div>
          <div className="container p-2">

            {/* <Link to="/me">Change address</Link> */}
          </div>
          {total > 0 ? (
            <div className="container p-2">
              {/* <b>Set delivery date/time:</b>
              <br />
              <DatePicker
                selected={deliveryTime}
                onChange={(time) => {
                  setDeliveryTime(time);
                }}
                showTimeSelect
                dateFormat="Pp"
                className="input my-2"
                placeholderText="Set delivery date/time"
                required={true}
                minDate={Date.now()}
              /> */}
              <br />
              <div className="pay-btn">
                {/* <StripeCheckout
                  stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
                  token={makePayment}
                  name="Samosabucket Purchase"
                  amount={total * 100}
                > */}
                  <button className="button is-primary  mt-2" onClick = {e=>makePayment(Date)}>
                    Place Order
                  </button>
                {/* </StripeCheckout> */}
              </div>
            </div>
          ): (<h2>Your cart is Empty</h2>)}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}

export default Cart;
