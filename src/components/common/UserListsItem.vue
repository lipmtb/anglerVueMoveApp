<template>
  <div class="userListsItem clear-fix" >
    <div class="user-avatar left" :style="[initImgStyle]" v-if="userInfo.avatarUrl"></div>
    <div class="user-avatar init-style left" v-else></div>
    <span class="user-name left" :data-user-id="userInfo._id">{{userInfo.userName}}</span>
    <div class="fan-show">
      <span class="fan-text">粉丝数</span>
      <em class="fan-num">{{userInfo.fanNum}}</em>
    </div>
  </div>
</template>

<script>
export default {
  name: "userlistsitemcpn",
  data() {
    return {};
  },
  computed: {
    initImgStyle() {
      return {
        backgroundImage: "url(" + this.userInfo.avatarUrl + ")",
        backgroundPositionX: -1 * this.userInfo.avatarRadX * 44 + "px",
        backgroundPositionY: -1 * this.userInfo.avatarRadY * 44 + "px",
        backgroundSize: "44px 44px",
      };
    },
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style scoped>
.userListsItem{
  position:relative;
  padding:0.4em 0;
  border-bottom:0.4px solid #ddd;
}
.userListsItem span.user-name{
  margin-left:.2em;
  font-size:1.2em;
    background-image: -webkit-linear-gradient(
    left top,
    #008,
    rgb(8, 170, 8),
    #e7eb1d,
    rgb(248, 85, 85)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.fan-show{
  position:absolute;
  left:4.6em;
  top:3.2em;
  font-size:0.6em;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: #fff;
}
.init-style{
  background-image: url("~assets/img/defaultAvatar.png");
  background-position: center;
  background-size: contain;
}
</style>