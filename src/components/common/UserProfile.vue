<template>
  <div id="user-info-state">
    <div class="login-state clear-fix" v-if="loginState">
      <div class="avatar-wrapper left">
        <div class="user-img-bg" v-if="avatarUrl" :style=[initImgStyle] >

        </div>
        <div class="user-img-bg user-img-initial" v-else >

        </div>
        <p class="ch-avatar" v-on:click="toChangeAvatar">更换头像</p>
      </div>

      <span class="user-name-text left">{{ anglerName }}</span>
    </div>
    <div v-else class="nologin-state">
      <router-link to="/loginReg" class="toLoginReg">登录/注册</router-link>
    </div>
  </div>
</template>

<script>
import { loginRegRequest } from "network/request";
import { getAvatarInfo } from "network/profile";
import serverUrl from "network/server";
// 用户登录注册组件
export default {
  name: "UserProfile",
  data() {
    return {
      anglerName: "",
      anglerId: "",
      loginState: false,
      avatarUrl: "",
      avatarRadX:0,
      avatarRadY:0
    };
  },
  computed:{
 initImgStyle() {
      return {
        backgroundImage: "url(" + this.avatarUrl + ")",
        backgroundPositionX: (-1) * this.avatarRadX * 44 + "px",
        backgroundPositionY: (-1) * this.avatarRadY * 44 + "px",
        backgroundSize: "44px 44px",
      };
    }
  },
  created() {
   
    loginRegRequest({
      url: "/login/isLogin",
    }).then((userinfo) => {
      // console.log("是否登录", userinfo);
      this.anglerName = userinfo.anglerName;
      this.anglerId = userinfo.anglerId;
      if (userinfo.loginState == "login") {
        this.loginState = true;
        this.$store.commit("changeUserState", {
          anglerId: userinfo.anglerId,
          anglerName: userinfo.anglerName,
        });
        getAvatarInfo(userinfo.anglerId).then((angler) => {
          // console.log("获取用户头像信息", angler);
          if (angler.avatarUrl) {
            this.avatarUrl = serverUrl + "/images/avatar/" + angler.avatarUrl;
            this.avatarRadX=angler.avatarRadX;
            this.avatarRadY=angler.avatarRadY; 
          }
        });
      } else {
         console.log("登录状态刷新，未登录");
        this.$store.commit("changeUserState", {
          anglerId: "",
          anglerName: "",
        });
      }
    });
  },
  methods:{
    toChangeAvatar(){
      this.$router.push('/changeImgAva');
    }
  }
};
</script>

<style>

.user-img-bg{
  width:44px;
  height:44px;
  border-radius: 50%;
  border:1px solid #ddd;
  background-color:#fff;
}
.user-img-initial{
   background-image: url("~assets/img/defaultAvatar.png");
  background-position: center;
  background-size: contain;
}

.user-img-bg:hover{
  border:1px solid #666;
}

#user-info-state {
  background-color: var(--color-profile);
}

.login-state img.avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color:#fff;
  opacity: 0.6;
}
.login-state img.avatar-img:hover{
  opacity: 1;
  border:1px solid #666;
}

.login-state span.user-name-text{
  margin-top:0.3em;
  color:#666;
  font-weight:bold;
  font-size:1.2em;
}
.avatar-wrapper p.ch-avatar{
  font-size:0.4em;
  color:#fff;

}
.avatar-wrapper p.ch-avatar:hover{
  text-decoration: underline;
  cursor:pointer;
}
#user-info-state div.login-state {
  padding: 20px 0;
  padding-left: 0.4em;
  font-size: 1.4em;
  color: rgb(90, 79, 248);
  font-weight: bold;
}
div.nologin-state {
  padding: 20px 0;
  padding-left: 0.4em;
}
div.nologin-state .toLoginReg {
  font-size: 1.4em;
}
</style>