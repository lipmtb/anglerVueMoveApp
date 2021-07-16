<template>
  <div class="collect-wrapper" @scroll="onPageScroll">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center">我的收藏</span>
    </nav-bar>

    <tab-control
      :tabLists="collectTypeName"
      :active="curActive"
      @chtab="changeTab"
    ></tab-control>

    <div class="collect-lists-wrapper">
      <div class="talk-lists-show" v-if="curActive == 'talk'">
        <talk-lists :talk-lists="collectArr['talk'].lists"></talk-lists>
        <div style="text-align: center" v-show="!collectArr['talk'].hasMore">
          <span style="color: #ddd; font-size: 0.6em">没有更多了</span>
        </div>
      </div>

      <div class="tip-lists-show" v-if="curActive == 'tip'">
        <tip-lists :slide-tip-lists="collectArr['tip'].lists"></tip-lists>
        <div style="text-align: center" v-show="!collectArr['tip'].hasMore">
          <span style="color: #ddd; font-size: 0.6em">没有更多了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import TabControl from "components/common/tabControl";
import { getMyCollectType, getAvatarInfo } from "network/profile";
import TalkLists from "components/content/talk/talkLists";
import TipLists from "components/content/tipSlideTab/slideTipLists";
import customFormatedDate from "util/customTime.js";
import serverUrl from "network/server.js";
export default {
  name: "mycollectviews",
  data() {
    return {
      collectTypeName: [
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
      canGetMore: true,
      curActive: "talk",
      collectArr: {
        talk: {
          page: 0,
          hasMore: true,
          lists: [],
        },
        tip: {
          page: 0,
          hasMore: true,
          lists: [],
        },
      },
    };
  },
  components: {
    NavBar,
    TabControl,
    TalkLists,
    TipLists,
  },
  created() {
    this.getMyCollectFn("talk");
    this.getMyCollectFn("tip");
  },
  methods: {
    //返回上个页面
    backHistory() {
      this.$router.back();
    },
    //点击tabControl切换收藏类型
    changeTab(type) {
      this.curActive = type;
    },
    //获取我的收藏
    getMyCollectFn(type) {
      let that = this;
      this.canGetMore = false; //防止频繁获取，锁头
      getMyCollectType(
        this.$store.state.anglerId,
        type,
        this.collectArr[type].page
      ).then((talklists) => {
        // console.log("获取" + type + "的收藏", talklists);
        let prosAll = [];
        for (let i = 0; i < talklists.length; i++) {
          if (talklists[i].imgArr.length > 0) {
            talklists[i].imgArr[0] =
              serverUrl + "/images/" + type + "/" + talklists[i].imgArr[0];
          }
          talklists[i].publishTime = customFormatedDate(
            talklists[i].publishTime
          );

          let pros = new Promise((resolve) => {
            getAvatarInfo(talklists[i].anglerId).then((userinfo) => {
              if (userinfo.avatarUrl) {
                talklists[i].avatarUrl =
                  serverUrl + "/images/avatar/" + userinfo.avatarUrl;
                talklists[i].avatarRadX = userinfo.avatarRadX;
                talklists[i].avatarRadY = userinfo.avatarRadY;
              }
              resolve(userinfo);
            });
          });
          prosAll.push(pros);
        }

        Promise.all(prosAll).then(() => {
          this.collectArr[type].page = this.collectArr[type].page + 1;
          this.collectArr[type].lists.push(...talklists);

          if (talklists.length < 4) {
            that.collectArr[type].hasMore = false;
          }
          that.canGetMore = true; //解锁
        });
      });
    },
    //触底加载更多
    onReachCollectBottom() {
      // console.log("****触底****");
      if (this.canGetMore && this.collectArr[this.curActive].hasMore) {
        // console.log("获取更多");
        this.getMyCollectFn(this.curActive);
      }
    },
    onPageScroll(e) {
      if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop == 900) {
        this.onReachCollectBottom();
      }
    },
  },
};
</script>

<style>
.collect-wrapper {
  padding-bottom: 200px;
  height: 900px;
  overflow-y: scroll;
}
.collect-wrapper .collect-lists-wrapper {
  height: 800px;
}
</style>