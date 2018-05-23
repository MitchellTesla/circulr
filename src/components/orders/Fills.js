import React from 'react'
import FillFormater from '../../modules/fills/formatters'
import {Spin} from 'antd'

export default class Fills extends React.Component {

  state = {
    pageSize: 10,
    pageIndex: 1,
    total: 0,
    loading: true,
    fills: []
  };

  componentDidMount() {
    const {pageSize, pageIndex} = this.state;
    const {order} = this.props;
    window.RELAY.ring.getFills({pageSize, pageIndex, orderHash: order.originalOrder.hash}).then(res => {
      if (!res.error) {
        this.setState({fills: res.result.data, loading: false, total: res.result.total})
      }else{
        this.setState({loading: false})
      }
    })
  }


  render(){
    const {fills,loading} = this.state;
    return(
      <Spin spinning={loading}>
      <table style={{overflow:'auto'}} className="table table-dark table-striped text-left">
        <thead>
        <tr>
          <th>环路</th>
          <th>数量</th>
          <th>价格</th>
          <th>金额</th>
          <th>LRC撮合费</th>
          <th>LRC撮合奖励</th>
          <th>时间</th>
        </tr>
        </thead>
        <tbody>
        {fills.length > 0 && fills.map((fill,index) =>{
          const fm = new FillFormater.FillFm(fill)
           return <tr key={index}>
              <td>{fm.getRingIndex()}</td>
              <td>{fm.getAmount()}</td>
              <td>{fm.getPrice()}</td>
              <td>{fm.getTotal()}</td>
              <td>{fm.getLRCFee()}</td>
              <td>{fm.getLRCReward()}</td>
              <td>{fm.getCreateTime()}</td>
            </tr>
        }
        ) }
        {
          fills.length ===0 && <div>
            NO Data
          </div>
        }
        </tbody>
      </table>
      </Spin>
    )
  }
}
