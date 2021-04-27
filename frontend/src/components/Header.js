import React from "react";
import { PageHeader, Button } from "antd"
import { ConnectWallet } from "./ConnectWallet";

const Header = ({ connectWallet, address }) => {
    
    if (address === undefined) {
    return (
        <div>
            <PageHeader
                title="ELMO"
                subTitle="Exchange L2 Money Optimistically"
                style={{ cursor: "pointer", paddingTop: "4px", paddingLeft: "36px", paddingRight: "12px", paddingBottom: "6px" }}
                extra={[
                    <ConnectWallet connectWallet={connectWallet}/>,
                  ]}
            />   
        </div>
    );}

    else {
        return (
            <div>
                <PageHeader
                    title="ELMO"
                    subTitle="Exchange L2 Money Optimistically"
                    style={{ cursor: "pointer", paddingTop: "4px", paddingLeft: "36px", paddingRight: "12px", paddingBottom: "6px" }}
                    extra={[
                        <Button type="primary">{address}</Button>,
                    ]}
                />   

            </div>
        );}
    
}

export default Header;