import React from "react";


const Development = ({ address, tokenName, tokenSymbol }) => {
    return(
        <div>
            <ul>Your address is: {address}</ul>
            <ul>Your token name is: {tokenName}</ul>
            <ul>Your token symbol is: {tokenSymbol}</ul>
        </div>
    );
}


export default Development;