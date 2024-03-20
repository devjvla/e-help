import { useEffect, useRef, useState } from "react";

/* Redux */
import { useSelector } from "react-redux";
import { userSignin } from "../store/user.slice";
import { useAppDispatch } from "../store";

const Signin = () => {
  const dispatch = useAppDispatch();

  let email_address = useRef("");
  let password      = useRef("");

  const handleSignin = () => {
    dispatch(userSignin({ 
      email_address: email_address.current, 
      password: password.current 
    }));
  }

  return(
    <>
      <div className="container">
        <p>Sign in to e-Help</p>
        <input type="text" placeholder="Username" onChange={(e) => email_address.current = e.target.value}></input>
        <input type="password" placeholder="Password" onChange={(e) => password.current = e.target.value}></input>
        <button type="button" onClick={handleSignin}>Sign in</button>
      </div>
    </>
  );
}

export default Signin;