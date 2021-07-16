<template>
  <div class="user-info-wrapper">
    <div class="communicate-with-choose" v-show="$store.state.anglerId">
      <span class="secret-text" @click="toCommunicate">私信</span>
    </div>

    <tab-control
      :tabLists="sendTypeLists"
      :active="curActive"
      @chtab="changeTab"
      :class="{ fixedToView: isFixed, showTabClass: !isFixed }"
    ></tab-control>

    <!-- 回顶部按钮 -->
    <back-top v-show="showBack" @click.native="backTopHandle"></back-top>
    <!-- 滚动组件 -->
    <scroll-cpn
      class="user-send-show"
      @onpullingup="pullingUpData"
      ref="scrolllists"
      :style="{ height: calcHeight + 'px' }"
      @chfix="fixTabEvent"
    >
      <nav-bar>
        <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
        <span slot="center">用户主页</span>
      </nav-bar>
      <user-home
        :user-info="userInfo"
        :has-care="hasCare"
        :care-num="careNum"
        :fan-num="fanNum"
        @careuserevent="toCareUser"
        @cancelCareEvent="cancelCareUser"
      ></user-home>
      <div class="user-animate">
        <h3
          class="animate-text"
          :style="{ color: runColor, fontSize: fontLarge + 'px' }"
        >
          动态
        </h3>
      </div>
      <tab-control
        :tabLists="sendTypeLists"
        :active="curActive"
        @chtab="changeTab"
        :class="{ fixedToView: isFixed }"
      ></tab-control>
      <talk-lists
        :talk-lists="sendTalkLists"
        v-show="curActive == 'talk'"
      ></talk-lists>
      <tip-lists
        :slide-tip-lists="sendTipLists"
        v-show="curActive == 'tip'"
      ></tip-lists>
    </scroll-cpn>
  </div>
</template>

<script>
import scrollCpn from "components/common/scroll/scroll";
import backTop from "components/content/backTop/backTop";
import NavBar from "components/common/NavBar";
import TabControl from "components/common/tabControl";
import UserHome from "components/content/user/userHome";
import TalkLists from "components/content/talk/talkLists";
import TipLists from "components/content/tipSlideTab/slideTipLists";
import {
  getAvatarInfo, //获取展示的用户基本信息
  careUserById, //关注
  cancelCareUser, //取消关注
  hasCareUser, //是否关注过
  getCareAndFanCount, //获取关注数和粉丝数
  getUserSendTalk, //用户发布过的钓友圈
  getUserSendTip, //用户发布过的技巧
} from "network/profile"; //用anglerId用户头像信息

import serverUrl from "network/server";
import customFormattedDate from "util/customTime";

export default {
  name: "userInfoPage",
  data() {
    return {
      userId: "", //展示的用户的唯一标识
      userInfo: {}, //展示的用户的信息
      hasCare: false, //当前登录用户是否关注过展示的用户
      careNum: 0,
      fanNum: 0,
      curActive: "talk",
      sendTypeLists: [
        {
          index: 0,
          tabName: "talk",
          tabStr: "钓友圈",
        },
        {
          index: 1,
          tabName: "tip",
          tabStr: "技巧",
        },
      ],
      sendTalkLists: [],
      curTalkCount: 0,
      sendTipLists: [],
      curTipCount: 0,
      hasMoreTalk: true,
      hasMoreTip: true,
      runColor: "#000",
      fontLarge: 16,
      calcHeight: 800, //滚动的默认高度
      isFixed: false, //是否固定tab-control
      showBack: false,
    };
  },
  created() {
    // console.log("userinfo created");
    this.userId = this.$route.params.uid;
    this.getUserInfo().then(async () => {
      this.hasCareUserById();
      this.getUserCareAndFanFn();
      await this.getSendTalkEssay();
      await this.getSendTipEssay();
      this.$nextTick(() => {
        // console.log("nextTick");
        this.$refs.scrolllists.bscroll.refresh();
      });
    });
  },
  mounted() {
    let that = this;
    setInterval(() => {
      that.runColor = "#" + Math.random().toString().substr(2, 6).toString(16);
    }, 100);
    this.calcHeight = document.documentElement.clientHeight;
  },
  components: {
    NavBar,
    UserHome,
    TabControl,
    TalkLists,
    TipLists,
    scrollCpn,
    backTop,
  },
  methods: {
    backHistory() {
      this.$router.back();
    },
    //获取展示的用户基本信息
    getUserInfo() {
      return getAvatarInfo(this.$route.params.uid).then((userRes) => {
        // console.log("获取到用户的基本信息:", userRes);
        if (userRes.avatarUrl) {
          userRes.avatarUrl = serverUrl + "/images/avatar/" + userRes.avatarUrl;
        }
        this.userInfo = userRes;
        return userRes;
      });
    },
    //获取关注数和粉丝数
    getUserCareAndFanFn() {
      getCareAndFanCount(this.userId).then((res) => {
        // console.log("获取到关注数和粉丝数", res);
        this.careNum = res.careCount;
        this.fanNum = res.fanCount;
      });
    },
    //当前浏览用户是否关注过
    hasCareUserById() {
      // console.log("是否关注过",this.$store.state.anglerId);
      return hasCareUser(this.$store.state.anglerId, this.userId).then(
        (hasres) => {
          // console.log("是否关注过：", hasres);
          if (hasres.careState == 1) {
            this.hasCare = true;
          }
        }
      );
    },
    //关注某个用户
    toCareUser() {
      // console.log(this.$store.state.anglerId, "关注：", this.userInfo._id);
      careUserById(this.$store.state.anglerId, this.userId).then((careRes) => {
        if (careRes.errMsg) {
          // console.log("关注失败");
          return;
        }
        this.hasCare = true;
        this.fanNum++;
        // console.log("关注成功", careRes);
      });
    },
    //取消关注
    cancelCareUser() {
      cancelCareUser(this.$store.state.anglerId, this.userId).then((res) => {
        if (res.errMsg == 1) {
          // console.log("取消关注成功");
          this.hasCare = false;
          this.fanNum--;
        }
      });
    },
    //切换钓友圈和技巧
    changeTab(tabtype) {
      let that = this;
      this.curActive = tabtype;
      this.$nextTick(() => {
        // console.log("nextTick");
        that.$refs.scrolllists.bscroll.refresh();
      });
    },
    //获取钓友圈帖子
    getSendTalkEssay() {
      if (!this.hasMoreTalk) {
        return Promise.resolve(false);
      }
      return getUserSendTalk(this.userId, this.curTalkCount).then((lists) => {
        // console.log("获取用户发布过的钓友圈帖子", lists);
        if (lists.length === 0) {
          this.hasMoreTalk = false;
        }
        for (let item of lists) {
          if (item.imgArr.length > 0) {
            item.imgArr[0] = serverUrl + "/images/talk/" + item.imgArr[0];
          }
          if (item.avatarUrl) {
            item.avatarUrl = serverUrl + "/images/avatar/" + item.avatarUrl;
          }
          item.publishTime = customFormattedDate(item.publishTime);
        }

        this.sendTalkLists.push(...lists);
        this.curTalkCount += lists.length;
      });
    },
    //获取技巧帖子
    getSendTipEssay() {
      if (!this.hasMoreTip) {
        return Promise.resolve(false);
      }
      return getUserSendTip(this.userId, this.curTipCount).then((lists) => {
        // console.log("获取用户发布过的技巧帖子", lists);
        if (lists.length === 0) {
          this.hasMoreTip = false;
        }
        for (let item of lists) {
          if (item.imgArr.length > 0) {
            item.imgArr[0] = serverUrl + "/images/tip/" + item.imgArr[0];
          }
          if (item.avatarUrl) {
            item.avatarUrl = serverUrl + "/images/avatar/" + item.avatarUrl;
          }
          item.publishTime = customFormattedDate(item.publishTime);
        }
        this.sendTipLists.push(...lists);
        this.curTipCount += lists.length;
      });
    },
    //上拉加载更多数据
    pullingUpData(bscroll) {
      let that = this;
      // console.log("上拉加载更多", bscroll);

      if (that.curActive == "talk") {
        that.getSendTalkEssay().then(() => {
          that.$nextTick(() => {
  
            that.$refs.scrolllists.bscroll.refresh();
          });
          bscroll.finishPullUp();
        });
        return;
      }
      if (that.curActive == "tip") {
        that.getSendTipEssay().then(() => {
           that.$nextTick(() => {
  
            that.$refs.scrolllists.bscroll.refresh();
          });
          bscroll.finishPullUp();
        });
        return;
      }
    },
    //固定tabControl
    fixTabEvent(pos) {
      // console.log(pos.y);
      if (pos.y < -200) {
        this.isFixed = true;
        this.showBack = true;
      } else {
        this.isFixed = false;
        this.showBack = false;
      }
    },
    //回到顶部
    backTopHandle(e) {
      // console.log(e);
      this.$refs.scrolllists.bscroll.scrollTo(0, 0, 500);
    },
    toCommunicate() {
     
      this.$router.push({
        path: "/communicate/" + this.userId,
      });
    },
  },
};
</script>

<style>
.communicate-with-choose {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(254, 255, 208);
  opacity: 0.68;
  padding: 0.4em 0;
  text-align: center;
  border-radius: 10px 10px 0 0;
  z-index: 666;
}
.communicate-with-choose span.secret-text {
  font-size: 1.2em;
}
.user-info-wrapper {
  padding: 0 0.2em;

}

.user-animate {
  margin-top: 0.2em;
}
h3.animate-text {
  margin-left: 0.4em;
  padding: 0.4em 1em;
  background-color: rgb(235, 235, 235);
}

/* 滚动区域 */
.user-send-show {
  overflow: hidden;
}

/* 固定tabcontrol */
.fixedToView {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6;
  background-color: #fff;
  opacity: 1;
  height: auto;
}

.showTabClass {
  height: 0;
  opacity: 0;
}
</style>