<template>
  <div id="app">
    <keep-alive include="talk,mycollectviews">
      <router-view></router-view>
    </keep-alive>
    <angler-tab-bar v-if="$route.matched[0]"></angler-tab-bar>
  </div>
</template>

<script>
import { loginRegRequest } from "network/request";
import anglerTabBar from "components/content/tabbar/anglerTabBar";
export default {
  name: "App",
  components: {
    anglerTabBar,
  },
  created(){
    loginRegRequest({
      url: "/login/isLogin",
    }).then((userinfo) => {
      console.log("是否登录", userinfo);
      this.anglerName = userinfo.anglerName;
      this.anglerId = userinfo.anglerId;
      if (userinfo.loginState == "login") {
        this.loginState = true;
        this.$store.commit("changeUserState", {
          anglerId: userinfo.anglerId,
          anglerName: userinfo.anglerName,
        });
      }else{
        console.log("登录状态刷新，未登录");
          this.$store.commit("changeUserState", {
          anglerId: "",
          anglerName: "",
        });
      }
    });
  }
};
</script>

<style>
/*基本的样式*/
@import "assets/css/base.css";
</style>
