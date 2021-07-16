<template>
  <div class="user-home-wrapper">
    <div class="user-info-model clear-fix">
      <!-- 用户头像和姓名 -->
      <div class="user-name-avatar left">
        <div
          class="user-avatar"
          v-if="userInfo.avatarUrl"
          :style="[avatarBgstyle]"
        ></div>
        <div class="user-avatar plain-bgstyle" v-else></div>
        <span class="user-name left">{{ userInfo.userName }}</span>
      </div>

      <!-- 是否关注 -->
      <div class="user-oper right" v-if="$store.state.anglerId">
        <a
          href="javascript:void(0)"
          v-if="hasCare"
          class="has-care-btn"
          @click="cancelCare"
          >取消关注</a
        >
        <a href="javascript:void(0)" v-else class="to-care-btn" @click="toCare"
          >关注</a
        >
      </div>

      <div class="no-login right" v-else>
        <a href="javascript:void(false)" v-on:click="$router.push('/loginReg')">登录</a>
      </div>
    </div>

    <!-- 用户关注和粉丝 -->
    <div class="user-ref">
      <div class="sect care-show" @click="toCarePageDetail">
        <span class="section-text">关注</span>
        <em class="section-num">{{ careNum }}</em>
      </div>
      <div class="sect fan-show" @click="toFanPageDetail">
        <span class="section-text">粉丝</span>
        <em class="section-num">{{ fanNum }}</em>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userHomeCpn",
  data() {
    return {
      showCare: false,
    };
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    hasCare: {
      type: Boolean,
      default() {
        return false;
      },
    },
    careNum: {
      type: Number,
      default() {
        return 0;
      },
    },
    fanNum: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  computed: {
    avatarBgstyle() {
      return {
        backgroundImage: `url(${this.userInfo.avatarUrl})`,
        backgroundPositionX: -1 * this.userInfo.avatarRadX + "px",
        backgroundPositionY: -1 * this.userInfo.avatarRadY + "px",
        backgroundSize: "80px 80px",
      };
    },
  },
  created() {
    console.log("userhome created");
  },
  methods: {
    toCare() {
      //关注
      this.$emit("careuserevent");
    },
    cancelCare() {
      //取消关注
      this.$emit("cancelCareEvent");
    },
    toCarePageDetail() {
      let that = this;
      this.$router.push({
        path: "/userCarePage/"+that.userInfo._id,
      });
    },
    toFanPageDetail() {
      let that = this;
      this.$router.push({
        path: "/userFanPage/"+that.userInfo._id
      });
    },
  },
};
</script>

<style>
.user-avatar {
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 0.4px solid #eee;
  background-color: rgba(255, 255, 255, 0.781);
  background-repeat: no-repeat;
}
.user-name-avatar span.user-name {
  font-size: 2.8em;
  font-weight: bold;
  margin-top: 0.2em;
  margin-left: 0.2em;
  background-image: -webkit-linear-gradient(
    left top,
    #008,
    #060,
    #008c8c,
    #600
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.plain-bgstyle {
  background: url("~assets/img/defaultAvatar.png") no-repeat center/contain;
}

/* 关注按钮 */
a.to-care-btn {
  padding: 0.2em 0.4em;
  background-color: coral;
  border-radius: 5px;
  color: #fff;
}

.user-oper a {
  font-size: 0.6em;
}

.user-ref {
  display: flex;
  height: 44px;
  line-height: 44px;
  text-align: center;
  margin-top:0.4em;
}

.user-ref div.sect {
  flex: 1;
  box-shadow: 1px 1px 4px #aaa;
}

.no-login a{
  font-size:0.6em;
  color:cornflowerblue;
  text-decoration: underline;
}
</style>