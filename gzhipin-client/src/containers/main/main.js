/*
  主界面组件
 */
import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import {getRedirectTo} from '../../utils/index'
import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import {getUser} from "../../redux/actions"
import  NavFooter from "../../components/nav-footer/nav-footer"

class Main extends Component {
    navList = [
        {
            path: '/laoban',// 路由路径
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]

    componentDidMount() {
        //登陆过（cookie中有userid），但没有登陆（redux管理的user中没有_id）发请求获取对应的user
        const userid = Cookies.get('userid')
        const {_id} = this.props.user
        if (userid && !_id) {
            //发送异步请求，获取user
            this.props.getUser()
        }

    }

    render() {

        //读取cookies中的userid
        const userid = Cookies.get('userid')
        //如果没有，自动重定向到登陆界面
        if (!userid) {
            return <Redirect to='/login'/>
        }
        //如果有，读取redux中的user状态
        const {user} = this.props
        //如果user没有_id，返回null(不做任何显示)
        if (!user._id) {
            return null
        } else {
            //如果有_id，显示对应界面
            //如果请求根路径，则根据user的type和header来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname
            if (path === '/') {
                //得到一个重定向的路由路径
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path}/>
            }
        }
        const {navList} = this
        const pathname = this.props.location.pathname//請求路徑
        const currentNav = navList.find(nav => nav.path === pathname)//得到當前的nav,可能沒有
        if(currentNav){
            //决定哪个路由需要隐藏
            if(user.type === 'laoban'){
                navList[1].hide = true
            }else {
                navList[0].hide = true
            }
        }
        return (

            <div>
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {

                        navList.map(nav => <Route path={nav.path} component={nav.component} key={nav.path}/>)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={this.navList} /> : null}
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {getUser}
)(Main)
/*
1.实现自动登陆：
   1.componentDidmount()
     登陆过（cookies中有userid）,但现在没有登陆（redux管理的user中没有_id) 发请求获取对应的user：
   2.render()
      1）.如果cookies中没有userid，直接重定向到Login
      2）.判断redux管理的user中是否有_id，如果没有，暂时不做任何显示
      3）.如果有，说明当前已经登陆，显示对应的界面
      4）.如果请求根路径：根据user的type和header来计算出一个重定向的路由路径，并自动重定向
 */