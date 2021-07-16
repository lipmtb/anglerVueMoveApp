<template>
  <div id="tip-wrapper" @scroll="onTipPageScroll">
    <!-- 技巧导航 -->
    <nav-bar class="tip-nav"><span slot="center">技巧</span></nav-bar>
    <!-- 搜索 -->
    <search-cpn class="tip-search" @onsearchTip="onsearchtip"></search-cpn>

    <div class="search-show" v-show="isShowSearch">
      <div class="search-success" v-if="searchLists.length > 0">
        <div class="search-oper clear-fix">
          <span class="left" style="color: green">搜索结果</span>
          <i
            class="iconfont iconshang right"
            :class="{ rotateIcon: isRotateIcon }"
            @click="toggleArrow"
          ></i>
        </div>

        <slide-tip-lists
          :slide-tip-lists="searchLists"
          :class="{ searchOriginLists: true, searchShowStyle: !isRotateIcon }"
          :style="{ height: searchResLength }"
        ></slide-tip-lists>
      </div>
      <h3 v-else style="color: red">没有找到{{ searchKey }}相关的内容</h3>
    </div>

    <!-- 发布和登录 -->
    <div class="add-or-login clear-fix">
      <a
        href="javascript:void(0)"
        v-if="$store.state.anglerId"
        @click="toAddTipPage"
        >发布技巧</a
      >
      <a
        v-else
        href="javascript:void(0)"
        @click="ToLoginPage"
        style="color: blue"
        >登录</a
      >
    </div>

    <!-- 技巧类型和技巧列表slide -->
    <div class="tip-datas-wrapper">
      <slide-tab
        :tip-class="tipClassWithLists"
        :active-type-idx="curTipType"
        @changetiptype="onChangeTip"
      ></slide-tab>
      <div class="tip-ref-data" @scroll="onTipListsScroll">
        <slide-tip-lists
          v-for="tipclass in tipClassWithLists"
          :slide-tip-lists="tipclass.tipLists"
          :key="tipclass._id"
        ></slide-tip-lists>
      </div>
    </div>
    <!-- select options切换技巧类型 -->
    <div class="tiptype-all-datas">
      <span class="filter-before">筛选</span>
      <select v-model="selecttype" @change="onTyleSelectChange">
        <option
          :value="item.className"
          v-for="item in tipClassWithLists"
          :key="item._id"
        >
          {{ item.className }}
        </option>
      </select>
      <div class="cur-type-lists">
        <slide-tip-lists :slide-tip-lists="curTypeLists"></slide-tip-lists>
        <div class="bottom-show-div">
          <span v-if="!hasMoreData">~到底了~</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar"; //导航组件
import SearchCpn from "components/common/SearchCpn"; //搜索组件
import SlideTab from "components/content/tipSlideTab/slideTab";
import slideTipLists from "components/content/tipSlideTab/slideTipLists";

import {
  getAllTipEssays,
  getTipEssaysByClassName,
  searchTipByKey,
} from "network/getTipClassify";
import { getAvatarInfo } from "network/profile";
import serverUrl from "network/server";
import customFormattedDate from "util/customTime";
export default {
  name: "tip",
  data() {
    return {
      isRotateIcon: true, //搜索结果箭头动画
      searchLists: [],
      searchKey: "",
      isShowSearch: false,
      tipClassWithLists: [], //slidedata数据
      curTipType: 0, //当前选中的类型
      curScrollNum: 0,
      scrollRef: [],
      scrollSum: [],
      canScroll: true, //onTipListsScroll 点击左侧类型时，右边滚动完才能true
      selecttype: "饵料",
      curTypeLists: [],
      curTypeCount: 0,
      canGetMore: true, //避免频繁到底请求
      hasMoreData: true,
    };
  },
  components: {
    NavBar,
    SearchCpn,
    SlideTab,
    slideTipLists,
  },
  created() {
    // console.log("tip page created");
    getAllTipEssays().then((allTipdatas) => {
      // console.log("获取所有技巧类型及其相关的帖子", allTipdatas);
      let allPromise = [];
      for (let item of allTipdatas) {
        let tiplists = item.tipLists;
        let prosAll = [];
        for (let i = 0; i < tiplists.length; i++) {
          if (tiplists[i].imgArr.length > 0) {
            tiplists[i].imgArr[0] =
              serverUrl + "/images/tip/" + tiplists[i].imgArr[0];
          }
          let pros = new Promise((resolve) => {
            getAvatarInfo(tiplists[i].anglerId).then((user) => {
              if (user.avatarUrl) {
                tiplists[i].avatarUrl =
                  serverUrl + "/images/avatar/" + user.avatarUrl;
                tiplists[i].avatarRadX = user.avatarRadX;
                tiplists[i].avatarRadY = user.avatarRadY;
              }
              resolve(user);
            });
          });
          prosAll.push(pros);

          tiplists[i].publishTime = customFormattedDate(
            tiplists[i].publishTime
          );
        }
        allPromise.push(Promise.all(prosAll));
      }

      Promise.all(allPromise).then(() => {
        this.tipClassWithLists = allTipdatas;
        //记录每种类型的个数
        for (let tipclass of this.tipClassWithLists) {
          this.scrollRef.push(tipclass.tipLists.length);
        }
        //统计每种类型scorllTop
        for (let i = 0; i < this.scrollRef.length; i++) {
          let sum = 0;
          for (let j = 0; j <= i; j++) {
            sum += this.scrollRef[j] * 160;
          }
          this.scrollSum[i] = sum;
          sum = 0;
        }
      });
    });
 //获取底部的当前类型
    this.getCurTipTypeLists().then(() => {
      this.canGetMore = true;
    });
  },
  computed: {
    searchResLength() {
      return this.searchLists.length * 160 + "px";
    },
  },
  methods: {
    toggleArrow() {
      this.isRotateIcon = !this.isRotateIcon;
    },
    //搜索
    onsearchtip(keywords) {
      this.isShowSearch = false;
      searchTipByKey(keywords).then((searchRes) => {
        // console.log("搜索结果：", searchRes);
        let prosAll = [];
        for (let i = 0; i < searchRes.length; i++) {
          if (searchRes[i].imgArr.length > 0) {
            searchRes[i].imgArr[0] =
              serverUrl + "/images/tip/" + searchRes[i].imgArr[0];
          }
          let pros = new Promise((resolve) => {
            getAvatarInfo(searchRes[i].anglerId).then((user) => {
              if (user.avatarUrl) {
                searchRes[i].avatarUrl =
                  serverUrl + "/images/avatar/" + user.avatarUrl;
                searchRes[i].avatarRadX = user.avatarRadX;
                searchRes[i].avatarRadY = user.avatarRadY;
              }
              resolve(user);
            });
          });
          prosAll.push(pros);
          searchRes[i].publishTime = customFormattedDate(
            searchRes[i].publishTime
          );
        }
        Promise.all(prosAll).then(() => {
          this.searchLists = searchRes;
          this.searchKey = keywords;
          this.isShowSearch = true;
        });
      });
    },
    //获取底部的当前类型
    getCurTipTypeLists() {
      this.canGetMore = false;
      return getTipEssaysByClassName(this.selecttype, this.curTypeCount).then(
        (dalists) => {
          // console.log("获取当前类型", dalists);
          if (dalists.errMsg) {
            return;
          }

          if (dalists.length < 4) {
            this.hasMoreData = false;
          }
          let prosAll = [];
          for (let i = 0; i < dalists.length; i++) {
            if (dalists[i].imgArr.length > 0) {
              dalists[i].imgArr[0] =
                serverUrl + "/images/tip/" + dalists[i].imgArr[0];
            }

            let pros = new Promise((resolve) => {
              getAvatarInfo(dalists[i].anglerId).then((user) => {
                if (user.avatarUrl) {
                  dalists[i].avatarUrl =
                    serverUrl + "/images/avatar/" + user.avatarUrl;
                  dalists[i].avatarRadX = user.avatarRadX;
                  dalists[i].avatarRadY = user.avatarRadY;
                }
                resolve(user);
              });
            });
            prosAll.push(pros);
            dalists[i].publishTime = customFormattedDate(
              dalists[i].publishTime
            );
          }
          Promise.all(prosAll).then(() => {
            this.curTypeLists.push(...dalists);
            this.curTypeCount += dalists.length;
          });
        }
      );
    },
    ToLoginPage() {
      this.$router.push("/loginReg");
    },
    toAddTipPage() {
      this.$router.push({
        path: "/addTip",
      });
    },
    //选择某种技巧类型时
    onChangeTip(tIdx) {
      // console.log("改变技巧类型", tIdx);
      this.canScroll = false; //让onTipListsScroll事件不起效果,不然冲突
      this.curTipType = tIdx;
      let scrollLen = 0;
      for (let i = 0; i < tIdx; i++) {
        scrollLen += this.tipClassWithLists[i].tipLists.length;
      }
      // console.log(scrollLen);
      let originScollNum = this.curScrollNum;
      let i = originScollNum;
      this.curScrollNum = scrollLen * 160;
      let that = this;
      function run(snum) {
        if (originScollNum > that.curScrollNum && snum < that.curScrollNum) {
          clearInterval(timer); //到达位置时再让onTipListsScroll事件起效果

          that.canScroll = true;
          that.curTipType = tIdx;
          return;
        }
        if (originScollNum < that.curScrollNum && snum > that.curScrollNum) {
          clearInterval(timer);
          that.canScroll = true;
          that.curTipType = tIdx;
          return;
        }
        //下面的这行会触发onTipListsScroll
        document.querySelector(".tip-ref-data").scrollTop = snum;
      }

      let timer = setInterval(() => {
        run(i);
        if (originScollNum < this.curScrollNum) {
          i += 20;
        } else {
          i -= 20;
        }
      }, 10);
    },
    onTipListsScroll(e) {
      //滚动右边时,改变类型
      // console.log(e.currentTarget.scrollTop);
      let curTop = e.currentTarget.scrollTop;
  
      // console.log(this.scrollRef,this.scrollSum,curTop);
      if (this.canScroll) {
        this.curTipType = this.scrollSum.findIndex((item) => item > curTop);
      }
    },
    //切换类型（select options）
    onTyleSelectChange() {
      // console.log(this.selecttype);
      this.curTypeLists = [];
      this.curTypeCount = 0;
      this.hasMoreData = true;
      this.getCurTipTypeLists().then(() => {
        this.canGetMore = true;
      });
    },
    onReachBottom() {
      let that = this;
      if (this.canGetMore) {
        that.getCurTipTypeLists().then(() => {
          setTimeout(function () {
            that.canGetMore = true;
          }, 1000);
        });
      }
    },
    onTipPageScroll(e) {
      // console.log("****");
      // console.log(e.currentTarget.scrollHeight,e.currentTarget.scrollTop);
      if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop == 1000) {
        // console.log("reachBottom");
        this.onReachBottom();
      }
    },
  },
};
</script>

<style>
#tip-wrapper {
  height: 1000px;
  padding-bottom: 300px;

  overflow: scroll;
}
.tip-nav {
  background-color: rgb(181, 248, 118);
  box-shadow: 1px 1px 5px #eee;
}

.tip-search {
  margin-top: 1em;
}

.search-oper {
  padding: 0.4em;
}

.search-oper i.iconshang {
  transition: all 500ms ease;
}

.search-oper .rotateIcon {
  transform: rotateX(-180deg);
}

.searchOriginLists {
  transition: height 500ms linear, opacity 1s ease;
  opacity: 1;
  overflow: hidden;
}
.searchShowStyle {
  opacity: 0;
  height: 0 !important;
}

.add-or-login a {
  float: right;
  padding: 0.2em 0.5em;
  background-color: rgb(252, 250, 177);
  border-radius: 5px;
  margin-top: 1em;
  font-size: 0.6em;
}

.tip-datas-wrapper {
  display: flex;
  height: 460px;
}

.tip-datas-wrapper .tip-ref-data {
  height: 100%;
  padding-bottom: 200px;
  overflow: scroll;
}

.tiptype-all-datas {
  margin-top: 1em;
  padding-top: 0.4em;
  border-top: 4px solid #eee;
}
.tiptype-all-datas select {
  outline: none;
  border: 1px solid #eee;
}
.bottom-show-div {
  text-align: center;
  margin-top: 1em;
}

/*筛选 */
.filter-before {
  font-size: 0.8em;

  margin-right: 0.2em;
}
</style>