import Axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
function Item({
  imageUrl,
  name,
  description,
  price,
  _id,
  refreshCart,
  ...misc
}) {
  const [qty, setQty] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const addToCart = () => {
    Axios.post(
        "/cart/",
      {
        itemId: _id,
        qty: qty,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        refreshCart();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };
  const handleQty = (e) => {
    setQty(e.target.value);
  };
  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <div className="column   is-one-third-desktop is-full-tablet  ">
      <div className='columns  is-mobile is-centered is-vcentered box  p-0 m-5'>
      <div className="column is-3 p-1">
        <figure className="image is-square">
          <img src={imageUrl} alt={"Photo of" + name} />
        </figure>
      </div>
      <div className="column is-9 pl-3 pt-0 p-2">
        <p className="title is-5">{name}</p>
        <p className="subtitle is-6">₹{price}</p>
        <p className="subtitle is-6" style={{minHeight:45}}>{description}</p>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary is-small" onClick={addToCart}>
              ADD TO CART
            </button>
          </div>
          <div className="control">
            <div className="select is-small">
              <select onChange={handleQty} value={qty}>
                {[...Array(10)].map((x, index) => {
                  return (
                    <option key={"opt" + (index + 1) + _id}>{index + 1}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div></div>
    </div>
  );
}

export default Item;
