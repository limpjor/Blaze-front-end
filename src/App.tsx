import React from 'react';
import { Provider } from 'react-redux'
//import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import { Container,Navbar,Nav,} from 'react-bootstrap'; 
import Orders from './web/containers/Orders';
import Products from './web/containers/Products';
import configureStore from './service/store/configureStore'

const store = configureStore();


export default function App() {
  return (
    <div className="container py-4">
      <Provider store={store}>
      <Router>
        <div>
          
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/">ORDERS</Nav.Link>
                  <Nav.Link href="/products">PRODUCTS</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Switch>
            <Route path="/products">
              <Products />
            </Route>
            <Route path="/">
              <Orders />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
    </div>
    
  );
}

