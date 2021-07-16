<template>
  <div class="user-fan-wrapper">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center" v-show="userName">{{ userName }}的粉丝</span>
    </nav-bar>

    <user-lists-show :user-info-lists="userFanLists" @click.native="onClickCareList"></user-lists-show>

    <div class="clear-fix">
      <span
        class="more-care-btn right"
        @click="moreCareUser"
        style="color: blue; font-size: 0.6em; margin-right: 0.4em"
        v-if="hasMore"
        >更多</span
      >
      <span
        class="more-care-btn right"
        style="color: #666; font-size: 0.6em; margin-right: 0.4em"
        v-else
        >没有更多了</span
      >
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import UserListsShow from "components/common/UserLists";
import {
  getAvatarInfo,
  getUserFanById,
  getCareAndFanCount,
} from "network/profile"; //用anglerId获取用户信息
import serverUrl from "network/server";
export default {
  components: {
    NavBar,
    UserListsShow,
  },
  data() {
    return {
      userId: "",
      userName: "",
      userFanLists: [],
      curCareCount: 0,
      hasMore: true,
      canClick: true,
    };
  },
  created() {
    this.userId = this.$route.params.uid;
    this.getUserInfo().then(() => {
      this.getUserCareLists();
    });
  },
  methods: {
    //返回上一页面
    backHistory() {
      this.$router.back();
    },
    moreCareUser() {
      if (this.canClick && this.hasMore) {
        this.canClick = false;
        this.getUserCareLists().then(() => {
          this.canClick = true;
        });
      }
    },
    //获取展示的用户的基本信息
    getUserInfo() {
      return getAvatarInfo(this.userId).then((userdata) => {
        this.userName = userdata.userName;
      });
    },
    //获取用户的粉丝列表
    getUserCareLists() {
      return getUserFanById(this.userId, this.curCareCount).then((lists) => {
        // console.log("获取到用户", this.userName, "的粉丝：", lists);
        if (lists.length === 0) {
          this.hasMore = false;
          return;
        }
        let prosAll = [];

        for (let item of lists) {
          let pros = new Promise((resolve) => {
            getCareAndFanCount(item._id).then((res) => {
              item.fanNum = res.fanCount;
              resolve(res.fanCount);
            });
          });

          prosAll.push(pros);
          if (item.avatarUrl) {
            item.avatarUrl = serverUrl + "/images/avatar/" + item.avatarUrl;
          }
        }

        Promise.all(prosAll).then(() => {
          this.userFanLists.push(...lists);
          this.curCareCount += lists.length;
        });
      });
    },
    onClickCareList(e) {
      // console.log(e.target.dataset.userId);
      let uid = e.target.dataset.userId;
      if (uid) {
        this.$router.push({
          path: "/userInfo/" + uid,
        });
      }
    }
  },
};
</script>

<style>
.user-fan-wrapper {
  padding-right: 1.5em;
}
</style>