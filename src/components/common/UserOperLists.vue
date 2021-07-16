<template>
  <div id="user-oper-lists">
    <div class="oper-item" @click="toMyCollect">我的收藏</div>
    <div class="oper-item" @click="toMyCare">我的关注</div>
    <div class="oper-item" @click="toMyFan">我的粉丝</div>
    <div class="oper-item" @click="toMyMessage">
     <span>我的消息</span>
     <span v-show="messageCount>0" class="num-style">{{messageCount}}</span>

      </div>
  </div>
</template>

<script>
import Notify from "components/common/notify/notify.js";
export default {
  name: "useroperlists",
  props:{
    messageCount:{
      type:Number,
      default(){
        return 0;
      }
    }
  },
  methods: {
    toMyCollect() {
      if (this.$store.state.anglerId) {
        this.$router.push("/collect");
      } else {
        Notify({
          message:'请先登录',
          color:'#f00',
          duration:1000
        })
      }
    },
    toMyCare() {
      if (this.$store.state.anglerId) {
        this.$router.push({
          path: "/userCarePage/" + this.$store.state.anglerId,
        });
      } else {
          Notify({
          message:'请先登录',
          color:'#f00',
          duration:1000
        })
      }
    },
    toMyFan() {
      if (this.$store.state.anglerId) {
        this.$router.push({
          path: "/userFanPage/" + this.$store.state.anglerId,
        });
      } else {
      Notify({
          message:'请先登录',
          color:'#f00',
          duration:1000
        })
      }
    },
    toMyMessage(){
      if (this.$store.state.anglerId) {
        this.$router.push({
          path: "/mymessage/" + this.$store.state.anglerId,
        });
      } else {
          Notify({
          message:'请先登录',
          color:'#f00',
          duration:1000
        })
      }
    }
  },
};
</script>

<style scoped>
#user-oper-lists {
  display: flex;
  flex-direction: column;
}

#user-oper-lists div.oper-item {
  margin: 10px 0;
  padding: 10px 0;
  padding-left: 1em;
  font-size: 1.2em;
  box-shadow: 1px 1px 5px rgb(245, 241, 241);
}

.num-style{
  color:red;
  margin-left:1em;
}
</style>