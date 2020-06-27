import React from 'react';
import { Form, Input, Button, DatePicker, InputNumber } from 'antd';
import moment from "moment";
import Axios from 'axios';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const AddForm = ({ setVisiable,submit }) => {
  const onFinish = values => {
    values.pubdata = moment(values.pubdata).format(dateFormat);
    console.log('Success:', values);
    Axios.post('/api/save/', values).then(res => {
    //Axios.post('127.0.0.1:8003/orderservice/save', values).then(res => {
      setVisiable(false);
      submit()
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const dateFormat = 'YYYY-MM-DD';
  return (
    <Form {...layout} name="basic" initialValues={{}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        label="商品名称"
        name="goodsName"
        rules={[
          {
            required: true,
            message: 'Please input goodsName!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="收获地址"
        name="address"
        rules={[
          {
            required: true,
            message: 'Please input address!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="顾客名"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="联系手机号"
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input phone!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="数量"
        name="count"
        rules={[
          {
            required: true,
            message: 'Please input count!',
          },
        ]}
      >

      <Form.Item
        label="金额"
        name="money"
        rules={[
          {
            required: true,
            message: 'Please input money!',
          },
        ]}
      ></Form.Item>
        
        <DatePicker format={dateFormat} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddForm;

