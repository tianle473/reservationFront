import login from '../src/main/login.vue'
import managerView from '../src/main/managerView.vue'
import choosingseat from '../src/components/choosingseat'
import user from '../src/main/userpage'
import signin from '../src/components/signin'
import history from '../src/components/history'
import choosingroom from '../src/components/choosingroom'
import { createRouter, createWebHistory,  RouteRecordRaw } from 'vue-router'
const router = createRouter({  
    history: createWebHistory(),  
    routes: [
        {
          path: '/',
          name:'home',
          components: {
            default: login,
            // 这里是es6对象增强写法
            // 同理
          },
        },
        {
          path: '/manager',
          name:'manager',
          components: {
            default: managerView,
          },
        },
        {
          path: '/user',
          name:'user',
          component:user,
            children:[
              {
                path:'/choosingseat',
                component:choosingseat
              },
              {
                path:'/choosingroom',
                component:choosingroom
              },
              {
                path:'/signin',
                component:signin
              },
              {
                path:'/history',
                component:history
              }
            ]
        }
      ],
})

export default router

