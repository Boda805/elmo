import React from "react";
import { Transfer } from "./Transfer";
import { Form, Input, Button, Checkbox } from 'antd';

const Development = ({ address, tokenName, tokenSymbol, transfer }) => {
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
      };

    return(
        <div>
            <ul>Your address is: {address}</ul>
            <ul>Your token name is: {tokenName}</ul>
            <ul>Your token symbol is: {tokenSymbol}</ul>

            <button onClick={() => transfer('0x8A4F0832F661DB078A535AC0E427C41F1BD90820', 1)} />
            
            <Form>
                <Form.Item name="Address" label="Address" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="Value" label="Value" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </div>
        
    );
}


export default Development;