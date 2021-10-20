import axios from 'axios';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import AdminOrder from "./AdminOrder";
import Login from "./Login";
import KitchenOrder from './KitchenOrder';
import Pusher from 'react-pusher';

const Kitchen = ({ loginHandler }) => {

    const [orders, setOrders] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [error, setError] = useState("");

    const refreshOrders = () => {
        axios.get(  "/adminorder/", {
          withCredentials: true,
        })
          .then((res) => {
            setOrders(res.data);
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) setIsLoggedIn(false);
              setError(err.response.status + " " + err.response.data.message);
            }
          });
      };
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
    
      useEffect(() => {
        loginHandler();
        Axios.get(  "/adminorder/", {
          withCredentials: true,
        })
          .then((res) => {
            setOrders(res.data);
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.status === 401) setIsLoggedIn(false);
              console.log(err.response.status + " " + err.response.data?.message);
            }
          });
        return () => {};
      }, []);
    
      if (!isLoggedIn)
        return <Login loginHandler={loginHandler} redirectTo="/adminorderstoday" />;

    return (
        <div>
            <div className="columns  is-full is-multiline  p-0 mb-5">
              {orders
                .filter((x) => ["PENDING","PREPARING"].includes(x.status) && moment(x.createdAt).utc().local().format('DD-MM-YYYY') === moment(Date.now()).format('DD-MM-YYYY'))
                .map((x) => {
                  console.log()
                  return (
                    <KitchenOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}</div> 
                 <Pusher
      channel="my-channel"
      event="my-event"
      onUpdate={e=>{
        console.log('update')
        refreshOrders()}}
    />
        </div>
    )
}

export default Kitchen
