import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
function Order({
  stripePayID,
  status,
  cart,
  amount,
  createdAt,
  _id,
  delivery_time,
  est_delivery_time,
  refreshOrders,
  setError,
  ...misc
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showDetails, setShowDetails] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [cartData, setCartData] = useState();
  const [isCancelDisabled, setIsCancelDisabled] = useState(
    ["ADMIN_CANCELLED", "USER_CANCELLED"].findIndex((x) => x === status) > -1
  );
  const [hideCancel, setHideCancel] = useState(
    ["PAID","PREPARING","PREPARED", "DELIVERED"].findIndex((x) => x === status) > -1
  );
  const statusData = {
    ADMIN_CANCELLED:
      "Cancelled by SamosaBucket admin. Please contact us if this seems to be a mistake.",
    PENDING: "Pending for confirmation, a D'Street Staff will soon start preparing your order.",
    DELIVERED: "Delivered",
    USER_CANCELLED: "Cancelled by you",
    PREPARED:"Your dish is prepared please hold on.",
    PAID:
      "Amount received. Thank You",
    PREPARING: "We are preparing (cooking) your order.",
  };

  useEffect(() => {
    if (showDetails === true) {
      setIsDetailsLoading(true);

      Axios.post(
          "/adminproduct/list",
        cart.map((x) => x.itemId),
        {
          withCredentials: true,
        }
      )
        .then((res) => {
          setCartData(
            res.data.map((itemData) => {
              return {
                ...cart.find((x) => x.itemId === itemData._id),
                name: itemData.name,
              };
            })
          );
          setIsDetailsLoading(false);
        })
        .catch((err) => {
          if (err.response)
            setError(
              err.response.data.message || "Error while getting order details"
            );
        });
    }
    return () => {};
  }, [showDetails]);

  const cancelOrder = () => {
    if (isCancelDisabled == true) {
      return;
    }
    setIsCancelLoading(true);
    Axios.put(
        "/order/" + _id,
      {
        status: "USER_CANCELLED",
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        setIsCancelDisabled(
          ["ADMIN_CANCELLED", "USER_CANCELLED"].findIndex(
            (x) => x === res.data.status
          ) > -1
        );
        setHideCancel(
          ["PAID","PREPARING","PREPARED", "DELIVERED"].findIndex(
            (x) => x === res.data.status
          ) > -1
        );
        refreshOrders("Order has been cancelled successfully.");
      })
      .catch((err) => {
        refreshOrders();
        if (err.response?.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };

  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <div className='column is-half'>
    <div className="columns is-mobile is-centered is-vcentered box p-0 mb-5">
      <div className="column is-12 pl-3 pt-0 p-2">
        <p > <span className="title is-4">Order Number </span> <b>{_id}</b></p><br/>
        <p>
          <b>Status:</b> {statusData[status]}
          <br />
          <b>Amount:</b> ₹{amount}
          <br />
          Requested delivery{" "}
          {moment.utc(delivery_time).local().format("DD-MMM-YY hh:mm a")}
          <br />
          Estimated delivery{" "}
          {moment.utc(est_delivery_time).local().format("DD-MMM-YY hh:mm a")}
        </p>
        <p className="subtitle is-6">
          Order created{" "}
          {moment(createdAt).format("ddd, MMM Do, YYYY \\at hh:mm A")}
        </p>
        <div className="field is-grouped">
          <div className="control">
            {!hideCancel && (
              <button
                className="button is-danger is-small mr-1"
                disabled={isCancelDisabled}
                onClick={cancelOrder}
              >
                {!isCancelDisabled ? "MODIFY OR CANCEL ORDER" : "ORDER CANCELLED"}
              </button>
            )}
            <button
              className={
                "button is-info is-small " + (isDetailsLoading ? "is-loading is-small" : "")
              }
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? "HIDE DETAILS" : "SHOW DETAILS"}
            </button>
          </div>
        </div>
        {showDetails && cartData?.length > 0 && (
          <div className={isDetailsLoading ? "is-loading" : ""}>
            <table className="table is-fullwidth p-2">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map((x, index) => (
                  <tr key={x.itemId + index + "row" + stripePayID}>
                    <td>{index + 1}</td>
                    <td>{x.name}</td>
                    <td>₹{x.price}</td>
                    <td>{x.qty}</td>
                    <td>₹{x.price * x.qty}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4"></th>
                  <th>₹{amount}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
<br />
{isCancelDisabled  && 'If cancelled by mistake please contact the counter'}<br />

      </div>
    </div></div>
  );
}

export default Order;
