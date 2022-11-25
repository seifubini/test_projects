import React, {useContext, useState } from "react";
import axios from 'axios';
import { Redirect } from 'router';
import clientConfig from '../clientConfig';
import AppContext from "../AppContext";
import "./assets/css/login.css";

const Login = () =>  {

  const [ store, setStore ] = useContext( AppContext );

  const [ loginFields, setLoginFields ] = useState({
    username: '',
    password: '',
    userNiceName: '',
    userEmail: '',
    loading: false,
    error: ''
  });

  const createMarkup = ( data ) => ({
    __html: data
  });

  const onFormSubmit = ( event ) => {
    event.preventDefault();

    const siteUrl = clientConfig.siteUrl;

    const loginData = {
      username: loginFields.username,
      password: loginFields.password,
    };

    setLoginFields( { ...loginFields, loading: true } );

    axios.post( `${siteUrl}/wp-json/jwt-auth/v1/token`, loginData )
      .then( res => {

        if ( undefined === res.data.token ) {
          setLoginFields( {
            ...loginFields,
            error: res.data.message }
            );
          return;
        }

        const { token, user_nicename, user_email } = res.data;

        localStorage.setItem( 'token', token );
        localStorage.setItem( 'userName', user_nicename );

        setStore({
          ...store,
          userName: user_nicename,
          token: token
        });

        setLoginFields( {
          ...loginFields,
          loading: false,
          token: token,
          userNiceName: user_nicename,
          userEmail: user_email,
        } )

        console.log('logged in');
      } )
      .catch( err => {
        setLoginFields( { ...loginFields, error: err.response.data.message, loading: false } );
      } )
  };

  const handleOnChange = ( event ) => {
    setLoginFields( { ...loginFields, [event.target.name]: event.target.value } );
  };

  const { username, password, userNiceName, error, loading } = loginFields;

  if ( store.token ) {
    return ( <Redirect to={`/dashboard`} noThrow /> )
  } else {
    return (
      <div className="d-flex flex-column flex-lg-row">
      <div className="Auth-background">
        <a href="#" className="text-center mb-10">
            <img src='{process.env.PUBLIC_URL+ "/logo192.png"}' className="max-h-70px" alt="" />
        </a>
      </div>
      <div className="Auth-form-container">
      { error && <div className="alert alert-danger" dangerouslySetInnerHTML={ createMarkup( error ) }/> }
        <form onSubmit={ onFormSubmit } className="Auth-form">
          <span className="text-left">
           {"<"} Back
          </span>
          <div className="text-right">
            New to Alter?{" "}
            <span className="link-primary">
              Sign Up
            </span>
          </div>
          <div className="Auth-form-content">
            <h2 className="Auth-form-title">Login</h2>
            <p className="Auth-form-label"> please Enter your details below.</p>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input type="text"
                className="form-control"
                name="username"
                value={ username }
                onChange={ handleOnChange } />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input type="password"
                className="form-control"
                name="password"
                value={ password }
                onChange={ handleOnChange } />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>

      </div>
    )
  }

};

export default Login;