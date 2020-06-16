/*
  包含n个action creator
  异步action
  同步action
*/

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST
}from './action-types'
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList
}from '../api/index.js'

//同步成功响应
const authSuccess = (user) => ({type:AUTH_SUCCESS,data:user})
//同步错误信息
const errorMsg = (msg) => ({type:ERROR_MSG,data:msg})
// 同步接收用户
const receiveUser = (user) => ({type:RECEIVE_USER,data:user})
// 同步重置用户
export const resetUser = (msg) => ({type:RESET_USER,data:msg})
//同步获取用户列表
export const receiveUserList = (userList) =>({type:RECEIVE_USER_LIST,data:userList})

    // 注册异步action
export const register = (user) => {
    const {username, password, password2, type} = user
    // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
    if(!username||!password) {
        return errorMsg('用户名和密码必须指定!')
    } else if(password!==password2) {
        return errorMsg('2次密码要一致!')
    }
    // 表单数据合法, 返回一个发ajax请求的异步action函数
    return async dispatch => {


        // 发送注册的异步ajax请求
        /*const promise = reqRegister(user)
        promise.then(response => {
          const result = response.data  // {code: 0/1, data: user, msg: ''}
        })*/
        const response = await reqRegister({username, password, type})
        const result = response.data //  {code: 0/1, data: user, msg: ''}
        if(result.code===0) {// 成功
            // 分发授权成功的同步action
            dispatch(authSuccess(result.data))
        } else { // 失败
            // 分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}

// 登陆异步action
export const login = (user) => {

    const {username, password} = user
    // 做表单的前台检查, 如果不通过, 返回一个errorMsg的同步action
    if(!username) {
        return errorMsg('用户名必须指定!')
    } else if(!password) {
        return errorMsg('密码必须指定!')
    }

    return async dispatch => {
        // 发送注册的异步ajax请求
        /*const promise = reqLogin(user)
        promise.then(response => {
          const result = response.data  // {code: 0/1, data: user, msg: ''}
        })*/
        const response = await reqLogin(user)
        const result = response.data
        if(result.code===0) {// 成功
            // 分发授权成功的同步action
            dispatch(authSuccess(result.data))
        } else { // 失败
            // 分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}
// 更新用户异步action
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user)
        const result =response.data
        if(result.code === 0){  //更新成功
            dispatch(receiveUser(result.data))
        }else {
            dispatch(resetUser(result.msg))

        }
    }
}
// 获取用户异步action
export const getUser = () =>{
    return async dispatch =>{
        const response = await reqUser()
        const result = response.data
        if(result.code === 0){
            dispatch(receiveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
// 获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        // 执行异步ajax请求
        const response = await reqUserList(type)
        const result = response.data
        // 得到结果后, 分发一个同步action
        if(result.code===0) {
            dispatch(receiveUserList(result.data))
        }
    }
}