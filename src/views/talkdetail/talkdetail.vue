<template>
  <div class="talk-detail">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
    </nav-bar>

    <essay-detail :essay-data="talkData" v-if="talkData" class="talk-essay-wrapper">

      <div slot="useravatar" v-if="talkData.userInfo">
        <div class="user-img-bg" v-if="talkData.userInfo&&talkData.userInfo.avatarUrl" :style="[bgStyleComputed]">

        </div>
        <div v-else class="user-img-bg user-img-initial"></div>
      </div>
      <i
        class="iconfont"
        :class="{ iconshoucang: !collectTalkId, iconshoucang1: collectTalkId }"
        v-show="loginState"
        slot="collectSlot"
        :data-collect-id="collectTalkId"
        @click="onCollectedTalk"
      ></i>
    </essay-detail>

    <comment-cpn :comment-lists="commentLists"></comment-cpn>
    <comment-input
      v-if="loginState"
      :add-comment-fn="onCommentTalk"
    ></comment-input>
    <router-link v-else to="/loginReg" class="re-login-btn">登录</router-link>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import EssayDetail from "components/common/EssayDetail";
import {
  getTalkDetail,
  getTalkComment,
  commentTalkEssay,
} from "network/getTalk";

import {
  hasAnglerCollect,
  collectTalk,
  cancelCollect,
} from "network/hasCollectTalk";

import CommentCpn from "components/common/CommentCpn";
import CommentInput from "components/common/CommentInput";
import serverUrl from "network/server";

import Notify from "components/common/notify/notify";
export default {
  name: "talkDetailPage",
  components: {
    NavBar,
    EssayDetail,
    CommentCpn,
    CommentInput,
  },
  data() {
    return {
      talkId: "",
      talkData: {},
      collectTalkId: "",
      canClickCollect: true, //防抖
      loginState: false,
      commentLists: [],
      curCommentCount: 0,
    };
  },
  computed:{
    bgStyleComputed(){
      return {
          backgroundImage: "url(" +serverUrl+"/images/avatar/"+ this.talkData.userInfo.avatarUrl + ")",
        backgroundPositionX: (-1) * this.talkData.userInfo.avatarRadX * 44 + "px",
        backgroundPositionY: (-1) * this.talkData.userInfo.avatarRadY * 44 + "px",
        backgroundSize: "44px 44px",
      }
    }
  },
  created() {
    // console.log("talkDetail created");
    this.talkId = this.$route.query.talkId;
    //获取当前talk帖子信息
    getTalkDetail(this.talkId).then((res) => {
      if (res.errMsg == 1) {
        this.talkData = res.talkData;
        for (let i = 0; i < this.talkData.imgArr.length; i++) {
          this.talkData.imgArr[i] =
            serverUrl + "/images/talk/" + this.talkData.imgArr[i];
        }
        console.log("talk帖子信息：", this.talkData);
      }
    });

    //判断用户登录状态

    if (this.$store.state.anglerId) {
      this.loginState = true;

      //登录则判断是否收藏过
      hasAnglerCollect(
        this.$store.state.anglerId,
        this.$route.query.talkId
      ).then((colres) => {
        // console.log("是否收藏结果", colres);
        this.collectTalkId = colres.collectId;
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
    onCollectedTalk(e) {
      if (this.canClickCollect) {
        //防抖
        this.canClickCollect = false;
        let collectid = e.currentTarget.dataset.collectId;
        if (collectid) {
          cancelCollect(collectid).then((coRes) => {
            // console.log("取消收藏结果", coRes);
            if (coRes.errMsg == 1) {
              this.collectTalkId = "";
            }
            this.canClickCollect = true;
          });
          return;
        }

        collectTalk(this.$store.state.anglerId, this.$route.query.talkId).then(
          (collectRes) => {
            if (collectRes.collectId) {
              // alert("收藏成功");
              this.collectTalkId = collectRes.collectId;
              Notify({
                message: "收藏成功",
              });
            } else {
              // console.log("收藏失败");
              this.collectTalkId = "";
            }
            this.canClickCollect = true;
          }
        );
      }
    },
    //评论帖子
    onCommentTalk(commentText) {
      //  console.log(this.$store.state.anglerId,"评论",commentText);
      return commentTalkEssay(
        this.$store.state.anglerName,
        this.talkId,
        commentText
      ).then((comRes) => {
        // console.log(this.$store.state.anglerName, "评论返回：", comRes);
        if (comRes.commentItem) {
          this.commentLists.unshift(comRes.commentItem);
          this.curCommentCount += 1;
          Notify({
            message: "评论成功",
            color: "#0f0",
            duration: 1000,
          });
        } else {
          Notify({
            message: "评论失败",
            color: "#f00",
            duration: 1000,
          });
        }
        return comRes.errMsg;
      });
    },
    //获取评论
    getTalkDetailComment() {
      return getTalkComment(this.talkId, this.curCommentCount).then(
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