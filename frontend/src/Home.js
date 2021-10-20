import Axios from "axios";
import React, { useState, useEffect } from "react";
import Item from "./Item";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom'
function Home({ refreshCart }) {

  const search = useLocation().search;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  useEffect(() => {
    if (error != "")
      toast.error("Error: " + error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,


      })
      const id = new URLSearchParams(search).get('id');
      const password= new URLSearchParams(search).get('password');


      
  }, [error]);

  // get Items
  useEffect(() => {
    Axios.get(  "/store/")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        if (err.response)
          setError("Error: " + err.response.status + err.response.data.message);
      });
    return () => {};
  }, []);
  // get categories
  useEffect(() => {
    Axios.get(  "/store/category")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        if (err.response)
          setError("Error: " + err.response.status + err.response.data.message);
      });
    return () => {};
  }, []);

  useEffect(() => {
console.log(categories)
  }, [categories])
  const refreshCartHandler = () => {
    toast.success("Cart updated!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    refreshCart();
  };

  return (
    <div className="">
      <div className="">
        <div className=" ">
          <h1 className="has-text-centered title is-3 is-italic mb-6">
       Let's hunt your hunger
          </h1></div>
          {categories && categories.map((cat)=>{
            
            return(
            <><p className='title is-5 ml-6'> {cat[0].toUpperCase()+cat.slice(1)}</p>
            
            <div className="columns is-full is-multiline">
         
         {items &&
         items
         .filter((x) => x.category === cat).map((x) => {
             return (
               <Item
                 {...x}
                 key={"homeItem" + x._id}
                 refreshCart={refreshCartHandler}
               />
             );
           })}
           </div>
  
            
            
            
            </>
          )})}
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

export default Home;
