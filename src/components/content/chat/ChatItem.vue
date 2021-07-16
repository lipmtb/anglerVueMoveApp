<template>
  <div class="chat-item">
    <div class="user-info-show clear-fix" v-if="chatData.userInfo">
      <div
        class="avatar-box"
        :class="{left:chatData.isFrom,right:!chatData.isFrom}"
        v-if="chatData.userInfo.avatarUrl"
        :style="[avatarStyle]"
      ></div>
      <div class="avatar-box init-bg" :class="{left:chatData.isFrom,right:!chatData.isFrom}" v-else></div>
      <a href="javascript:void(0)" class="user-name" :class="{left:chatData.isFrom,right:!chatData.isFrom}">{{
        chatData.userInfo.userName
      }}</a>
    </div>
    <div class="chat-conten clear-fix">
      <span class="chat-text" :class="{left:chatData.isFrom,right:!chatData.isFrom}" :style="{color:chatData.isFrom?'#008c8c':'#999'}">{{ chatData.commentText }}</span>
      <em class="chat-time" :class="{right:chatData.isFrom,left:!chatData.isFrom}">{{ chatData.commentTime }}</em>
    </div>
  </div>
</template>

<script>
export default {
  name: "chatItemCpn",
  props: {
    chatData: {
      type: Object,
      default() {
        return {
          userInfo:{}
        };
      },
    },
  },
  computed: {
    avatarStyle() {
      return {
        backgroundImage: `url(${this.chatData.userInfo.avatarUrl})`,
        backgroundPositionX: -1 * this.chatData.userInfo.avatarRadX + "px",
        backgroundPositionY: -1 * this.chatData.userInfo.avatarRadY + "px",
        backgroundSize: "20px 20px"
      };
    },
  },
};
</script>

<style scoped>
.chat-item{
  margin:1.4em 0;
}

.chat-item .chat-conten{
  padding:0 1em;
  text-align: center;
}
.chat-item .chat-conten span.chat-text{
  font-size:1.4em;
}
.chat-item .chat-conten em.chat-time{
  font-size:0.6em;
  color:#ddd;
}
a.user-name{
  margin:0 0.1em;
}
/* 头像信息 */
.avatar-box {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #eee;
  background-repeat: no-repeat;
}


.chat-text{
  width:70%;
  min-height:2em;
  word-break: break-all;
  word-wrap:break-word;
}
.init-bg {
  background: url("~assets/img/defaultAvatar.png") no-repeat center/contain;
}
</style>