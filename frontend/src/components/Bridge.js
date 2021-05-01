import React, { useState } from "react";
import { Form, Input, Button } from 'antd';


const Bridge = ({ deposit }) => {
    const [form] = Form.useForm();
    const [amount, setAmount] = useState('');

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 6 },
      };
      const tailLayout = {
        wrapperCol: { offset: 8, span: 6 },
      };

    return (
        <Form {...layout} form={form} name="control-hooks">
            <Form.Item name="deposit" label="Deposit" rules={[{ required: true }]}>
                <Input onChange={e => setAmount(e.target.value)}/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                    <Button onClick={() => deposit(amount)} type="primary" htmlType="submit">
                        Deposit
                    </Button>
            </Form.Item>
        </Form>
    )
}

export default Bridge;