import Axios from "axios";
import React, { useEffect, useState } from "react";
import {useLocation, Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Login({ loginHandler, redirectTo ,logoutHandler}) {
  const search = useLocation().search;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);










  useEffect(() => {
   handleLogout()
  }, [])






  const handleLogout = () => {
    Axios.get(  "/user/logout", {
      withCredentials: true,
    })
      .then((res) => {
        toast.warn("You have been logged out.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        logoutHandler();
      })
      .catch((e) =>
        toast.warn("Error logging out. Try clearing cookies.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      ).finally(()=>{
        const id = new URLSearchParams(search).get('id');
        const password= new URLSearchParams(search).get('password');
        setEmail(id)
        setPassword(password)
        if(id && password){
          loginSubmit(id,password)
        }
      })
  };
















  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const loginSubmit = (id=null,pass=null) => {
    setIsLoading(true);
    Axios({
      method: "post",
      url:   "/user/login",
      data: {
        email: email||id,
        password: password||pass,
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
        // toast.error(
        //   "Error: " + JSON.stringify(err.response.data?.errors[0]?.msg),
        //   {
        //     position: "top-right",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //   }
        // );
      });
  };

  if (isLoggedIn) {
    return <Redirect to={redirectTo || "/"} />;
  }

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-half">
          <div className="card p-2">
            <div className="title has-text-centered is-italic">Login</div>
            <div className="field">
              <label className="label">E-mail</label>
              <p className="control">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={emailChange}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <p className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={passwordChange}
                />
              </p>
            </div>
            <div className="field is-grouped is-grouped-right">
              <p className="control">
                <Link className="button is-info" to="/signup">
                  NEW? CREATE AN ACCOUNT
                </Link>
              </p>
              <p className="control">
                <button
                  className={
                    "button is-primary " + (isLoading ? "is-loading" : "")
                  }
                  onClick={loginSubmit}
                >
                  LOGIN
                </button>
              </p>
            </div>
            {isError && (
              <div className="has-background-danger has-text-white my-2 p-2">
                <p>
                  Error logging you in - you might have missed or made a mistake
                  on one or more fields on the log in form above.
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

export default Login;
