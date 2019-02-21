import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Table from '@/page/nav1/Table'
import Main from '@/page/Home'
import Form from '@/page/nav1/Form'
import User from '@/page/nav1/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/table',
      name: 'Table',
      component: Table
    },
    {
      path: '/',
      component: Home,
      name: '导航一',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/table', component: Table, name: 'Table' },
        { path: '/form', component: Form, name: 'Form' },
        { path: '/user', component: user, name: '列表' },
      ]
    },
  ]
})
