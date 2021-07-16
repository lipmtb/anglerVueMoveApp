<template>
  <div class="login-regist-wrapper">
    <!-- 返回按钮 -->
    <nav-bar class="login-nav-back" >
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
    </nav-bar>
    <!-- 登录注册组件 -->
    <login-reg class="login-reg-cpn"></login-reg>
  </div>
</template>

<script>
// 登录注册界面
import NavBar from "components/common/NavBar";
import LoginReg from "components/common/LoginReg";
export default {
  name: "loginPage",
  components: {
    NavBar,
    LoginReg,
  },
  methods:{
    backHistory(){
      this.$router.back();
    }
  }
};
</script>

<style>
.login-nav-back{
  box-shadow:1px 1px 2px  rgb(240, 233, 233);
}

.login-reg-cpn{
  margin-top:2em;
}
</style>