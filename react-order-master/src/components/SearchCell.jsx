import React, {createRef} from 'react';
import { Button, Input, notification } from 'antd';
import '../App.css';

const axios = require('axios');

class SearchCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      search_parameter: createRef(),
    }
  }

  _search = (searchName, searchUrl) => {
    let name = searchName === 'name' ? '顾客名' : '商品名称';
    const openNotificationWithIcon = type => {
      notification[type]({
        message: '温馨提示',
        description:
          `请输入${name}`,
        placement: 'topLeft'
      });
    };
    //let search_parameter = this.refs.search_parameter.input.value;
    let search_parameter = this.state.search_parameter.current.state.value;
    if(search_parameter === '') {
      openNotificationWithIcon('info');
    } else {
      let data = {
        name: search_parameter
      }
      if('goodsName' === searchName) {
        data = {
          data: null,
          goodsName: search_parameter
        }
      }
      let that = this;
      const url = `/api/${searchUrl}`;
      axios.post(url, data)
          .then(function (response) {
              // handle success
              console.log(response.data)
              that.props.setBookList(response.data);
              //that.setState({data: response.data})
              //that._listOrder();
          })
          .catch(function (error) {
              // handle error
              console.log(error);
          })
          .then(function () {
              // always executed
      });
    }
  }
render(){
  return (
    <div>
      <Button type="primary" className="button" onClick={ this.props.fetch }>显示所有</Button>
      <div className="button">
      参数：<Input
        //ref="search_parameter"
        ref={this.state.search_parameter}
        placeholder="Basic usage"
        style={{ width: 200, marginLeft: 16 }} />
        </div>
      <Button type="primary" className="button" onClick={ ()=>this._search('goodsName', 'findAllByGoodsName')}>搜索商品名称</Button>
      <Button type="primary" className="button" onClick={ ()=>this._search('name', 'findAllByName')}>搜索顾客名</Button>
    </div>
    );
  }
}

export default SearchCell;
