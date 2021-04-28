import React, { useState } from "react";
import { Form, Input, Button, Space } from 'antd';

const Transfer = ({ tokenBalance, transfer }) => {
    const [form] = Form.useForm();
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState(0);

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 6 },
      };
      const tailLayout = {
        wrapperCol: { offset: 8, span: 6 },
      };

    return(
        <div>
            <h1 style={{ textAlign:"center" }}>Balance: {tokenBalance}</h1>
            <Form {...layout} form={form} name="control-hooks">
                <Form.Item name="to" label="To" rules={[{ required: true }]}>
                    <Input onChange={e => setTo(e.target.value)}/>
                </Form.Item>

                <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                    <Input onChange={e => setAmount(e.target.value)} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button onClick={() => transfer(to, amount)} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
        
    );
}


export default Transfer;