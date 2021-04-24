import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import Header from './Header';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Development from "./Development"

const Main = ({ balance }) => {
    const [route, setRoute] = useState();
   
    useEffect(() => {
      setRoute(window.location.pathname)
    }, [setRoute]);

    console.log(balance.toString())
  
    return (
      <div className="Main">
        <Header />
        <BrowserRouter>
          <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
            <Menu.Item key="/">
              <Link onClick={()=>{setRoute("/")}} to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/development">
              <Link onClick={()=>{setRoute("/development")}} to="/development">Development</Link>
            </Menu.Item>
            <Menu.Item key="/bridge">
              <Link onClick={()=>{setRoute("/bridge")}} to="/bridge">Bridge</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path="/"></Route>
  
            <Route exact path="/development"><Development balance={balance} /></Route>
  
            <Route exact path="/bridge"></Route>

          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  
  
  export default Main;