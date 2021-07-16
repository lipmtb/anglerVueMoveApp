<template>
  <div id="add-talk-wrapper">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center">发布钓友圈</span>
    </nav-bar>

    <form-send :send-submit-fn="onAddTalk"></form-send>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar"; //导航：返回按钮和主题
import FormSend from "components/common/FormSend"; //表单选择组件
import { addTalkFormData } from "network/addTalk"; //发布钓友圈帖子网络请求
import Notify from "components/common/notify/notify.js";
export default {
  components: {
    NavBar,
    FormSend,
  },
  methods: {
    backHistory() {
      this.$router.back();
    },
    onAddTalk(options) {
      // console.log("发布钓友圈", options);
      addTalkFormData(options).then((rs) => {
        // console.log("发布结果：", rs);
        if (rs.loginErr) {
          this.$router.push("/loginReg");
          return;
        }
        if (rs.errMsg == 0) {
         Notify({
           message:'发布失败',
           color:'#f00'
         })
          return;
        }
         Notify({
           message:'发布成功',
           color:'#0f0',
           duration:500
         })
        setTimeout(() => {
          this.$router.push({
            path:'/talkDetail',
            query:{
              talkId:rs.data._id
            }
          });
        },600);
      });
    },
  },
};
</script>

<style>
</style>