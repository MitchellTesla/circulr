import React from 'react';
import { Input,Button,Form } from 'antd';
import {connect} from 'dva';
import routeActions from 'common/utils/routeActions';
import Notification from '../../../common/loopringui/components/Notification'
import validator from 'LoopringJS/ethereum/validator'

class PrivateKey extends React.Component {

  state={
    visible:false,
    privateKey:''
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  keyChange = (e) => {
    const privateKey = e.target.value;
    this.setState({privateKey})
  };

  unlock = () => {
    const {privateKey} = this.state;
    if(this.isValidPrivateKey(privateKey)){
      this.props.dispatch({type:"wallet/unlockPrivateKeyWallet",payload:{privateKey}});
      Notification.open({type:'success',message:'解锁成功',description:'unlock'});
      routeActions.gotoPath('/wallet');
    }else{
      Notification.open({type:'error',message:'unlock failed ',description:'Invalid privateKey'})
    }
  };

  isValidPrivateKey = (key) => {
    try {
      validator.validate({value: key, type: 'ETH_KEY'});
      return true;
    } catch (e) {
      return false;
    }
  };

  render(){
    const {visible,privateKey} = this.state;
    const {form}  = this.props;
    const visibleIcon = (
      <div className="fs14 pl5 pr5">
        {visible &&
        <i className="icon-eye" onClick={this.togglePassword}/>
        }
        {!visible &&
        <i className="icon-eye-slash" onClick={this.togglePassword}/>
        }
      </div>
    );
    return (
      <div>
        <div className="tab-pane text-inverse active" id="privateKey">
          <h2 className="text-center text-primary">Paste Your PrivateKey Here</h2>
          <Form>
            <Form.Item>
              {form.getFieldDecorator('privateKey', {
                initialValue: privateKey,
                rules: [{
                  required: true,
                  message: 'invalid privateKey',
                  validator: (rule, value, cb) => this.isValidPrivateKey(value) ? cb() : cb(true)
                }]
              })(
                  <Input type={visible ? 'text' : 'password'} addonAfter={visibleIcon} onChange={this.keyChange}/>
              )}
            </Form.Item>
          </Form>
          <Button type="primary" className="btn-block btn-xlg btn-token" onClick={this.unlock}>Unlock</Button>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(PrivateKey))
