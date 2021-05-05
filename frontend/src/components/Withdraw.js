import React, { useState } from "react";
import { Form, Input, Button } from 'antd';


const Withdraw = ({ withdraw }) => {
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
            <Form.Item name="withdraw" label="Withdraw" rules={[{ required: true }]}>
                <Input onChange={e => setAmount(e.target.value)}/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                    <Button onClick={() => withdraw(amount)} type="primary" htmlType="submit">
                        Withdraw
                    </Button>
            </Form.Item>
        </Form>
    )
}

export default Withdraw;