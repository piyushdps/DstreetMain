import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { debounce } from "throttle-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup({ loginHandler, redirectTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [autocompleteFocus, setAutoCompleteFocus] = useState(false);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [
    mouseOnAutoCompleteSuggestions,
    setMouseOnAutoCompleteSuggestions,
  ] = useState(false);

  const setAddressForm = (data) => {
    setAutoCompleteFocus(false);
    setMouseOnAutoCompleteSuggestions(false);
    
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const phoneChange = (e) => {
    setPhone(e.target.value);
  };
  const nameChange = (e) => {
    setName(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const autocompleteQueryAndSet = (text) => {
    Axios({
      method: "get",
      url: process.env.REACT_APP_POSITIONSTACK_API,
      params: {
        access_key: process.env.REACT_APP_POSITIONSTACK_API_KEY,
        query: text,
        country: "IN",
      },
    }).then((res) => {
      setAutocompleteData(res.data.data);
    });
  };

  const debouncedAutocompleteQueryAndSet = debounce(
    200,
    autocompleteQueryAndSet
  );

 

  const signUpSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    Axios({
      method: "post",
      url:   "/user/signup",
      data: {
        email: email,
        password: password,
        name: name,
        address:"",
        phone: phone,
      },
      withCredentials: true,
    })
      .then((res) => {
        loginHandler();
        setIsLoading(false);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
        setIsLoggedIn(false);
        loginHandler();
        
      });
  };
  useEffect(() => {
    return () => {
      debouncedAutocompleteQueryAndSet.cancel();
    };
  }, []);

  if (isLoggedIn) {
    return <Redirect to={redirectTo || "/"} />;
  }

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-4">
          <div className="card p-2">
            <div className="title has-text-centered is-italic">Sign Up</div>
            <form className="form-horizontal">
              <fieldset>
                <legend></legend>

                <div className="field">
                  <label className="label" htmlFor="email">
                    Full Name
                  </label>
                  <div className="control">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input "
                      required=""
                      value={name}
                      onChange={nameChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="email">
                    E-mail
                  </label>
                  <div className="control">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      className="input "
                      required=""
                      onChange={emailChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="passwordinput-0">
                    Password
                  </label>
                  <div className="control">
                    <input
                      id="passwordinput-0"
                      name="passwordinput-0"
                      type="password"
                      className="input "
                      required=""
                      value={password}
                      onChange={passwordChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="passwordinput-0">
                    Phone
                  </label>
                  <div className="control">
                    <input
                      id="phoneinput-0"
                      name="phoneinput-0"
                      type="text"
                      className="input "
                      required=""
                      onChange={phoneChange}
                    />
                  </div>
                </div>

            

                

                <div className="field">
                  <label className="label" htmlFor="signup"></label>
                  <div className="control">
                    <button
                      id="signup"
                      name="signup"
                      className={
                        "button is-primary " + (isLoading ? "is-loading" : "")
                      }
                      onClick={signUpSubmit}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
            {isError && (
              <div className="has-background-danger has-text-white my-2 p-2">
                <p>
                  You might have missed or made a mistake on one or more fields
                  on the sign up form above. Please note that only address line
                  2 is optional, everything else is required.
                </p>
              </div>
            )}
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
    </div>
  );
}

export default Signup;
