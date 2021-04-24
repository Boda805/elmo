import React from "react";
import { PageHeader } from "antd"

const Header = () => {
    
    
    return (
        <div>
            <PageHeader
                title="ELMO"
                subTitle="Exchange L2 Money Optimistically"
                style={{ cursor: "pointer", paddingTop: "4px", paddingLeft: "36px", paddingRight: "12px", paddingBottom: "6px" }}
            />   
        </div>
    );
}

export default Header;