import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../components/HIndex.vue'
import Images from '../components/HImages.vue'
import Models from '../components/HModels.vue'
import Tools from '../components/HTools.vue'

import Start from '../views/Start.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Controller from '../views/Controller.vue'
import Welcome from '../components/Welcome.vue'
import ImageSet from '../components/ImageSet.vue'
import AuditImageSet from '../components/AuditImageSet.vue'
import Node from '../components/Node.vue'
import Model from '../components/Model.vue'
import Users from '../components/UserManager.vue'
import Category from '../components/Category.vue'
import Task from '../components/Task.vue'
import History from '../components/History.vue'
import Setting from '../components/Setting.vue'
import Test from '../components/Test.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/index',
    component: Home,
    children: [
      {
        path: '/index',
        name: 'Index',
        component: Index
      },
      {
        path: '/images',
        name: 'Images',
        component: Images
      },
      {
        path: '/models',
        name: 'Models',
        component: Models
      },
      {
        path: '/tools',
        name: 'Tools',
        component: Tools
      }
    ]
  },
  {
    path: '/login',
    redirect: '/start/login',
    name: 'Start',
    component: Start,
    children: [
      {
        path: '/start/login',
        name: 'Login',
        component: Login
      },
      {
        path: '/start/register',
        name: 'Register',
        component: Register
      }
    ]
  },
  {
    path: '/controller',
    redirect: '/controller/welCome',
    name: 'Controller',
    component: Controller,
    children: [
      {
        path: '/controller/welCome',
        component: Welcome
      },
      {
        path: '/controller/users',
        component: Users
      },
      {
        path: '/controller/category',
        component: Category
      },
      {
        path: '/controller/imageSet',
        component: ImageSet
      },
      {
        path: '/controller/auditImageSet',
        component: AuditImageSet
      },
      {
        path: '/controller/node',
        component: Node
      },
      {
        path: '/controller/model',
        component: Model
      },
      {
        path: '/controller/task',
        component: Task
      },
      {
        path: '/controller/history',
        component: History
      },
      {
        path: '/controller/setting',
        component: Setting
      },
      {
        path: '/controller/test',
        component: Test
      }
    ]
  },
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
