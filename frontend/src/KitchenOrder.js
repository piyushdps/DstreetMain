import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
function KitchenOrder({
  stripePayID = '',
  status,
  cart,
  userId,
  amount,
  createdAt,
  _id,
  refreshOrders,
  setError,
  delivery_address: address,
  delivery_time,
  est_delivery_time,
  ...misc
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showDetails, setShowDetails] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [operationSelect, setOperationSelect] = useState(status);
  const [customer, setCustomer] = useState({ email: "", phone: "", name: "" });
  const [deliveryTime, setDeliveryTime] = useState(
    moment(est_delivery_time).utc().local().toDate()
  );
  const statusData = {
    ADMIN_CANCELLED: "Order Cancelled by D'street admin",
    // OUT_FOR_DELIVERY: "Out for delivery",
    PREPARED: "Delivered",
    USER_CANCELLED: "Cancelled by user",
    PAID: "Amount received",
    PREPARING: "Preparing",
    PENDING:'PENDING'
  };
  const optionsData = [
    "ADMIN_CANCELLED",
    "PENDING",
    // "OUT_FOR_DELIVERY",
    "PREPARED",
    "PAID",
    "PREPARING",
  ];

  useEffect(() => {
   setInterval( console.log('hi') 	, 50);
    
  }, [])


  useEffect(() => {
    Axios.get(  "/user/me/" + userId, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data == null) {
          setCustomer({
            email: "User not found (deleted)",
            name: "N/A",
            phone: "N/A",
          });
          return;
        }
        setCustomer(res.data);
      })
      .catch((err) => {
        if (err.response) {
          toast.error("Error: " + err.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  }, []);
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

  const updateOrder = (E) => {
    setIsUpdateLoading(true);
    Axios.put(
        "/adminorder/" + _id,
      {
        status: E,
        est_delivery_time: deliveryTime,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        toast.success("Status updated", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        refreshOrders();
      })
      .catch((err) => {
        refreshOrders();
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };

  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
   
      <div className='column   is-one-third-desktop is-half-tablet'>
      <div className=" box pl-3 pt-0 p-2">
        <p className="title is-4">
          Order for {customer?.name}
        </p>

        {/* <br />
        <select
          className="input my-2"
          value={operationSelect}
          onChange={(e) => {
            setOperationSelect(e.target.value);
          }}
        >
          {optionsData.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select> */}
        <div className="columns">
         {status==='PENDING' &&<div className="column">
            <button className="button is-primary mr-1" onClick={e=>{updateOrder('PREPARING')}}>
              ACCEPT ORDER 
            </button>
         
          </div>}
          <div className="column">
          <button className="button is-danger mr-1" onClick={e=>updateOrder('PREPARED')}>
             ORDER PREPARED
            </button>
          </div>
          <div className="column is-three-fifths"></div>
        </div>
       
          <div
            className={
              isDetailsLoading ? "is-loading has-background-light" : ""
            }
          >
            
            <table className="table is-fullwidth p-2">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Item</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map((x, index) => (
                  <tr key={"row" + x.itemId + (index + 1)}>
                    <td>{index + 1}</td>
                    <td>{x.name}</td>
                  
                    <td>{x.qty}</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       
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
  );
}

export default KitchenOrder;
