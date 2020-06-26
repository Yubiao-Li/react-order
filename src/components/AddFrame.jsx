import React, { useState, useRef } from 'react';
import { Button, Modal, Input } from 'antd';
import AddForm from "./AddForm";

function AddFrame(props) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOk = e =>
  {
    console.log(e)
    props.fetch()
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        新增
      </Button>
      <Modal title="新增" visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel} footer={null}>
        <AddForm setVisiable={setVisible} submit={handleOk}/>
      </Modal>
    </div>
  );
}

export default AddFrame;
