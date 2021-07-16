<template>
  <tab-bar
    :tab-data="tabBarDatas"
    :class="{ anglerTabBar: isShowTabBar }"
  ></tab-bar>
</template>

<script>
import TabBar from "components/common/TabBar";
export default {
  name: "anglerTabBar",
  components: {
    TabBar,
  },
  computed: {
    isShowTabBar() {
     
      if(this.$route.meta.type=='showtab'){
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      tabBarDatas: [
        {
          path: "/talk",
          icon: "iconliaotian2",
          activeIcon: "iconweibiaoti--",
          text: "钓友圈",
        },
        // {
        //   path: "/service",
        //   icon: "iconfuwu2",
        //   activeIcon: "iconfuwu3",
        //   text: "服务",
        // },
        {
          path: "/tip",
          icon: "icongonglve",
          activeIcon: "icongonglve1",
          text: "技巧",
        },
        {
          path: "/profile",
          icon: "iconzhuye",
          activeIcon: "iconzhuye-copy-copy",
          text: "我的",
        },
      ],
    };
  },
};
</script>

<style>
/*angler tabBar :weibo:anglerWebApp */
@import url("//at.alicdn.com/t/font_2533296_tt1k5wopz7k.css");
.anglerTabBar {
  display: none !important;
}
</style>