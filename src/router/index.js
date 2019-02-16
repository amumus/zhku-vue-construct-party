import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Table from '@/page/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/table',
      name: 'Table',
      component: Table
    },
  ]
})
