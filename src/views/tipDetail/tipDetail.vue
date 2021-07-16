<template>
  <div class="talk-detail">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
    </nav-bar>

    <essay-detail :essay-data="tipData" class="talk-essay-wrapper">
      <div slot="useravatar" v-if="tipData.userInfo">
        <div
          class="user-img-bg"
          v-if="tipData.userInfo && tipData.userInfo.avatarUrl"
          :style="[bgStyleComputed]"
        ></div>
        <div v-else class="user-img-bg user-img-initial"></div>
      </div>
      <i
        class="iconfont"
        :class="{ iconshoucang: !collectTipId, iconshoucang1: collectTipId }"
        v-show="loginState"
        slot="collectSlot"
        @click="onCollectedTip"
      ></i>
    </essay-detail>

    <comment-cpn :comment-lists="commentLists"></comment-cpn>
    <comment-input
      v-if="loginState"
      :add-comment-fn="onCommentTip"
    ></comment-input>
    <router-link v-else to="/loginReg" class="re-login-btn">登录</router-link>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import EssayDetail from "components/common/EssayDetail";
import CommentCpn from "components/common/CommentCpn";
import CommentInput from "components/common/CommentInput";

import { getTipById } from "network/getTipClassify";
import {
  getTipComment,
  commentTip,
  collectTip,
  cancelCollect,
  hasAnglerCollect,
} from "network/getTipClassify";

import serverUrl from "network/server";
import customFormattedDate from "util/customTime.js";
import Notify from "components/common/notify/notify.js";
export default {
  name: "tipDetailPage",
  components: {
    NavBar,
    EssayDetail,
    CommentCpn,
    CommentInput,
  },
  data() {
    return {
      tipId: "",
      tipData: {},
      collectTipId: "",
      canClickCollect: true,
      loginState: false,
      commentLists: [],
      curCommentCount: 0,
    };
  },
  computed: {
    bgStyleComputed() {
      return {
        backgroundImage:
          "url(" +
          serverUrl +
          "/images/avatar/" +
          this.tipData.userInfo.avatarUrl +
          ")",
        backgroundPositionX: -1 * this.tipData.userInfo.avatarRadX * 44 + "px",
        backgroundPositionY: -1 * this.tipData.userInfo.avatarRadY * 44 + "px",
        backgroundSize: "44px 44px",
      };
    },
  },
  created() {
    // console.log("tipDetail created");
    this.tipId = this.$route.query.tipId;
    //获取当前tip帖子信息
    getTipById(this.tipId).then((res) => {
      if (res.errMsg == 1) {
        this.tipData = res.talkData;
        for (let i = 0; i < this.tipData.imgArr.length; i++) {
          this.tipData.imgArr[i] =
            serverUrl + "/images/tip/" + this.tipData.imgArr[i];
        }
        this.tipData.publishTime = customFormattedDate(
          this.tipData.publishTime
        );
        // console.log("tip detail帖子信息：", this.tipData);
      }
    });

    //判断用户登录状态

    if (this.$store.state.anglerId) {
      this.loginState = true;

      //登录则判断是否收藏过
      hasAnglerCollect(
        this.$store.state.anglerId,
        this.$route.query.tipId
      ).then((colres) => {
        // console.log("是否收藏结果", colres);
        this.collectTipId = colres.collectId;
      });
    } else {
      this.loginState = false;
    }

    //获取帖子评论
    this.getTalkDetailComment();
  },
  methods: {
    backHistory() {
      this.$router.back();
    },
    //收藏和取消收藏帖子
    onCollectedTip() {
      if (this.canClickCollect) {
        this.canClickCollect = false;
        if (this.collectTipId) {
          cancelCollect(this.$store.state.anglerId, this.tipId).then(
            (coRes) => {
              // console.log("取消收藏结果", coRes);
              if (coRes.collectErr == 0) {
                this.collectTipId = "";
              }
              this.canClickCollect = true;
            }
          );
          return;
        }

        collectTip(this.$store.state.anglerId, this.tipId).then(
          (collectRes) => {
            if (collectRes.collectId) {
              Notify({
                message: "收藏成功",
                duration: 2000,
              });
              this.collectTipId = collectRes.collectId;
            } else {
              // console.log("收藏失败");
              this.collectTipId = "";
            }
            this.canClickCollect = true;
          }
        );
      }
    },
    //评论帖子
    onCommentTip(commentText) {
      //  console.log(this.$store.state.anglerId,"评论",commentText);
      return commentTip(
        this.$store.state.anglerName,
        this.tipId,
        commentText
      ).then((comRes) => {
        // console.log(this.$store.state.anglerName, "评论返回：", comRes);
        if (comRes.commentItem) {
          this.commentLists.unshift(comRes.commentItem);
          this.curCommentCount += 1;
          Notify({
            message: "评论成功",
            color: "#00f",
            duration: 1000,
          });
        } else {
          // alert("评论失败");
        }
        return comRes.errMsg;
      });
    },
    //获取评论
    getTalkDetailComment() {
      return getTipComment(this.tipId, this.curCommentCount).then(
        (commentRes) => {
          // console.log("获取帖子评论成功", commentRes);
          this.commentLists.push(...commentRes.commentLists);
          this.curCommentCount += commentRes.commentLists.length;
          return commentRes.commentLists.length;
        }
      );
    },
  },
};
</script>

<style>
.talk-detail {
  padding-bottom: 200px;
}
.talk-essay-wrapper {
  margin-top: 10px;
}
img.img-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

a.re-login-btn {
  float: left;
  text-decoration: underline;
  margin: 0.4em;
  margin-top: 2em;
}


/* 头像信息 */
.user-img-bg{
  width:44px;
  height:44px;
  border-radius: 50%;
  border:1px solid #ddd;
  background-color:#fff;
}
.user-img-initial{
   background-image: url("~assets/img/defaultAvatar.png");
  background-position: center;
  background-size: contain;
}
</style>