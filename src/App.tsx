import React, { useState, useEffect } from 'react';
import './App.css';
import { Home, ProductList } from './pages'
import Header from './common/header';
import { Provider as MainProvider } from './context/mainContext';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function App() {

  return (
    <MainProvider>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/products' component={ProductList} />
        </Switch>
      </BrowserRouter>
    </MainProvider>
  );
}

export default App;
