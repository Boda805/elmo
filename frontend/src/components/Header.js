import React from "react";
import { PageHeader } from "antd"
import { ConnectWallet } from "./ConnectWallet";

const Header = ({ connectWallet }) => {
    
    
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
    );
}

export default Header;