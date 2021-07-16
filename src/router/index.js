import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const router = new VueRouter({
  routes: [{
    meta: {
      type: 'showtab'
    },
    path: '',
    redirect: '/profile'
  }, {
    meta: {
      type: 'showtab'
    },
    path: '/talk',
    component: () => import("views/talk/talk"),
    children: [{
        path: '',
        redirect: 'hotTalk'
      },
      {
        path: 'hotTalk',
        component: () => import("views/talk/childcpn/hotTalkLists"),
        meta: {
          type: 'showtab'
        }
      },
      {
        path: 'newTalk',
        component: () => import("views/talk/childcpn/newTalkLists"),
        meta: {
          type: 'showtab'
        }
      }
    ]
  }, {
    meta: {
      type: 'showtab'
    },
    path: '/service',
    component: () => import("views/service/service")
  }, {
    meta: {
      type: 'showtab'
    },
    path: '/tip',
    component: () => import("views/tip/tip")
  }, {
    meta: {
      type: 'showtab'
    },
    path: '/profile',
    component: () => import("views/profile/profile")
  }, {
    path: '/loginReg',
    component: () => import("views/login/login")
  }, {
    path: '/addTalk',
    component: () => import("views/addTalk/addTalk")
  }, {
    path: '/talkDetail',
    component: () => import("views/talkdetail/talkdetail")
  }, {
    path: '/addTip',
    component: () => import("views/addTip/addTip")
  }, {
    path: '/tipDetail',
    component: () => import("views/tipDetail/tipDetail")
  }, {
    path: '/collect',
    component: () => import("views/profile/mycollect/mycollect")
  }, {
    path: '/changeImgAva',
    component: () => import("views/changeAvatar")
  }, {
    path: '/userInfo/:uid',
    component: () => import("views/userInfo/userInfo")

  }, {
    path: '/userCarePage/:uid',
    component: () => import("views/userInfo/childPage/userCare")
  }, {
    path: '/userFanPage/:uid',
    component: () => import("views/userInfo/childPage/userFan")
  },{
    path:'/communicate/:uid',
    component:()=>import("views/communicate/communicate")
  },{
    path:'/mymessage/:uid',
    component:()=>import("views/message/message")
  }],
  mode: 'history'
})

// router.beforeEach((to, from, next) => {
//   console.log('准备跳转到：', to,from);
//   next();

// })


export default router;
