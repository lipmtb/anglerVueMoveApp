<template>
  <div id="add-talk-wrapper">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center">发布技巧</span>
    </nav-bar>

    <!-- form-start-if -->
    <div class="form-data-select" v-if="$store.state.anglerId">
      <form @submit.prevent>
        <select class="tipTypeSel" v-model="tipType">
          <option
            :value="tipitem.className"
            v-for="tipitem of classifyLists"
            :key="tipitem._id"
          >
            {{ tipitem.className }}
          </option>
        </select>
      </form>
      <form-send :send-submit-fn="onAddTip"></form-send>
    </div>
    <!-- form-end-if -->
    <div class="login-select" v-else>
      <a href="javascript:void(0)" @click="toLogin">登录</a>
    </div>
  </div>
</template>

<script>
// 发布一条技巧帖子的页面
import NavBar from "components/common/NavBar"; //导航：返回按钮和主题
import FormSend from "components/common/FormSend"; //表单选择组件
import { addTipFormData } from "network/addTip"; //发布技巧帖子网络请求
import { getTipType } from "network/getTipClassify";
import Notify from "components/common/notify/notify.js";
export default {
  name: "addTipPage",
  data() {
    return {
      classifyLists: [],
      tipType: "钓杆",
    };
  },
  created() {
    //获取技巧类型列表
    getTipType().then((classlists) => {
      this.classifyLists = classlists;
    });
  },
  components: {
    NavBar,
    FormSend,
  },
  methods: {
    toLogin() {
      this.$router.push("/loginReg");
    },
    backHistory() {
      this.$router.back();
    },
    onAddTip(options) {
     
      // console.log("发布技巧", options);
      options.tipType = this.tipType;
      options.anglerName = this.$store.state.anglerName;
      options.anglerId = this.$store.state.anglerId;
      addTipFormData(options).then((rs) => {
        // console.log("发布结果：", rs);

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
          this.$router.replace({
            path: "/tipDetail",
            query: {
              tipId: rs.data._id,
            },
          });
        }, 500);
      });
    },
  },
};
</script>

<style>
</style>