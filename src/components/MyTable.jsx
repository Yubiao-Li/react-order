import { Table, Input, Space, Button, Popconfirm, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import EditableCell from './EditableCell';
import AddFrame from './AddFrame';

function MyTable(props) {
  const [bookList, setBookList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchColumn] = useState('');
  const [editingKey, setEditingKey] = useState('');

  const fetch = pagination => {
    setLoading(true);
    axios.get(`/api/v1/book/list?currentPage=${pagination.current}&pageSize=${pagination.pageSize}`).then(res => {
      setBookList(res.data.data.data);
      setPagination({
        ...pagination,
        total: res.data.data.total,
      });
      setLoading(false);
      console.log(res.data);
    });
  };
  useEffect(() => {
    fetch(pagination);
  }, []);

  let searchInput = null;
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  // 自定义搜索
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text =>
      (searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )),
  });

  // 改
  const [form] = Form.useForm();
  const isEditing = record => record.id === editingKey;
  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...bookList];
      const index = newData.findIndex(item => key === item.id);
      axios.post(`/api//v1/book/update/${key}`, row).then(res => {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setBookList(newData);
        setEditingKey('');
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const cancel = () => {
    setEditingKey('');
  };
  const edit = record => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  // 删
  const deleteBook = key => {
    axios.post(`/api/v1/book/delete/${key}`).then(() => {
      const newData = [...bookList];
      const index = newData.findIndex(item => key === item.id);
      newData.splice(index, 1);
      setBookList(newData);
    });
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '书名',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      editable: true,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      editable: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      editable: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      editable: true,
    },
    {
      title: '发布日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: text => text.split('T')[0],
    },
    {
      title: '操作',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <a
              style={{
                marginRight: 8,
              }}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </a>
            <a disabled={editingKey !== ''} onClick={() => deleteBook(record.id)}>
              Delete
            </a>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleTableChange = (pagination, filters, sorter) => {
    fetch(pagination, filters);
  };

  return (
    <>
      <AddFrame fetch={()=>fetch(pagination)} />
      <Form form={form} component={false}>
        <Table
          dataSource={bookList}
          rowKey={record => record.id}
          pagination={pagination}
          columns={mergedColumns}
          loading={loading}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          onChange={handleTableChange}
        />
      </Form>
    </>
  );
}

export default MyTable;
