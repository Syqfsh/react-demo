 import React, { Component } from 'react'
 import {connect} from 'react-redux'
 import {
    NavBar,
     InputItem,
     TextareaItem,
     Button
 } from 'antd-mobile'
 import {Redirect} from 'react-router-dom'

 import {updateUser} from '../../redux/actions'

 import HeadSelector from '../../components/header-selector/header-selector'

class LaobanInfo extends Component {
    state = {
        header: '', // 头像名称
        post: '', // 职位
        info: '', // 个人或职位简介
        company: '', // 公司名称
        salary: '' // 工资
    }
    setHeader = (header) => {
        this.setState({header})
    }
    handleChange = (name,value) => {
        this.setState({[name]:value})
    }
    save = () => {
        this.props.updateUser(this.state)
    }
  render(){
        //如果信息已经完善，自动重定向到对应的主界面
        const {header,type} = this.props.user
      if (header){//说明信息以及完整
          const path = type==='dashen' ? '/dashen' :  '/laoban'
          return <Redirect to={path}/>
      }
     return(
        <div>
            <NavBar>老板信息完善</NavBar>
            <HeadSelector setHeader={this.setHeader}/>
            <InputItem onChange={val => this.handleChange('company',val)}>公司名称:</InputItem>
            <InputItem onChange={val => this.handleChange('post',val)}>招聘职位:</InputItem>
            <InputItem onChange={val => this.handleChange('salary',val)}>职位薪资:</InputItem>
            <TextareaItem title="职位要求："
                             rows="3"
                          onChange={val => this.handleChange('info',val)}>
            </TextareaItem>
            <Button type="primary" onClick={this.save} >保&nbsp;&nbsp;&nbsp;存</Button>
        </div>
       )
    }
  }
 export default connect(
     state => ({user:state.user}),
     {updateUser}
 )(LaobanInfo)