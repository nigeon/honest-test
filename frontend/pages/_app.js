import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import UserContext from '../components/UserContext';

export default class MyApp extends App {
  state = {
    user: null
  };

  componentDidMount = () => {
    const user = localStorage.getItem('app-user');
    if (user) {
      this.setState({ user });
    } else {
      if(Router.pathname != '/signup'){
        Router.push('/login');
      }
    }
  };

  signup = (values) => {
    console.log('Signup with: ', values);
    localStorage.setItem('app-user', values);
    this.setState({ user: values }, () => Router.push('/'));
  };

  login = (values) => {
    console.log('Login with: ', values);
    localStorage.setItem('app-user', values);
    this.setState({ user: values }, () => Router.push('/'));
  };

  logout = () => {
    localStorage.removeItem('app-user');
    this.setState({ user: null }, () => Router.push('/login'));
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <UserContext.Provider value={{ user: this.state.user, signup: this.signup, logout: this.logout, login: this.login }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    );
  }
}