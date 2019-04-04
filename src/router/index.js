import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Table from '@/page/student/Table'
import Home from '@/page/Home'
import Form from '@/page/student/Form'
import User from '@/page/student/user'
import Main from '@/page/Main'

//视频
import AddVideo from "@/page/video/AddVideo"
import VideoList from "@/page/video/VideoList"

//文章
import AddNews from  "@/page/news/AddNews"
import  NewsList from "@/page/news/NewsList"

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
      path: '/home',
      name: 'Home',
      component: Home,
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/table', component: Table, name: '用户列表' },
        { path: '/form', component: Form, name: 'Form' },
        { path: '/user', component: User, name: '列表' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '文章管理',
      iconCls: 'el-icon-menu',//图标样式class
      children: [
        { path: '/addNews', component: AddNews, name: '添加文章' },
        { path: '/newsList', component: NewsList, name: '文章列表' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '视频管理',
      iconCls: 'el-icon-menu',//图标样式class
      children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/addVideo', component: AddVideo, name: '添加视频' },
        { path: '/videoList', component: VideoList, name: '视频列表' },
      ]
    }, {
      path: '/',
      component: Home,
      name: '积分管理',
      iconCls: 'el-icon-menu',//图标样式class
      children: [
        { path: '/main', component: Main, name: '主页', hidden: true },
        { path: '/addVideo', component: AddVideo, name: '添加视频' },
        { path: '/videoList', component: VideoList, name: '视频列表' },
      ]
    },
  ]
})
