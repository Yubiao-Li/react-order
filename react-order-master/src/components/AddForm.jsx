import React from 'react';
import { Form, Input, Button, DatePicker, InputNumber } from 'antd';
import moment from "moment";
import Axios from 'axios';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const AddForm = ({ setVisiable,submit }) => {
  const onFinish = values => {
    values.pubdata = moment(values.pubdata).format(dateFormat);
    console.log('Success:', values);
    Axios.post('/api/v1/book/add/', values).then(res => {
      setVisiable(false);
      submit()
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const dateFormat = 'YYYY-MM-DD';
  return (
    <Form {...layout} name="basic" initialValues={{}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        label="书名"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="图片"
        name="image"
        rules={[
          {
            required: true,
            message: 'Please input image!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="作者"
        name="author"
        rules={[
          {
            required: true,
            message: 'Please input author!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="价格"
        name="price"
        rules={[
          {
            required: true,
            message: 'Please input price!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="发布日期"
        name="pubdata"
        rules={[
          {
            required: true,
            message: 'Please input pubdata!',
          },
        ]}
      >
        <DatePicker format={dateFormat} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddForm;
