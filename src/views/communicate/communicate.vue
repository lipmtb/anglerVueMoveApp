<template>
  <div class="communicate-with-who">
    <!-- 评论输入 -->
    <comment-input :add-comment-fn="onComment">
      <span>发送</span>
    </comment-input>
    <!-- 导航返回 -->
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center" v-if="toUser">{{toUser.userName}}</span>
    </nav-bar>

    <div class="msg-show-wrapper" v-if="recordLists.length > 0">
      <scroll-cpn class="scroll-chat-wrapper" ref="scrolllists">
        <chat-lists :chat-data-lists="recordLists"></chat-lists>
        <ul class="empty-space" ref="ulspace">
          <li class="empty-item" style="height: 60px"></li>
          <li class="empty-item" style="height: 60px"></li>
          <li class="empty-item" style="height: 60px"></li>
          <li class="empty-item" style="height: 60px"></li>
          <li class="empty-item" style="height: 60px"></li>
        </ul>
      </scroll-cpn>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import CommentInput from "components/common/CommentInput";
import ChatLists from "components/content/chat/ChatLists";
import scrollCpn from "components/common/scroll/scroll";

import { sendCommMsg, getHisMsg } from "network/communicate";
import { getAvatarInfo } from "network/profile"; //获取用户详细信息
import serverUrl from "network/server";
import customFormatedTime from "util/customTime";
import io from "socket.io-client";
export default {
  name: "communicateWithWho",
  components: {
    NavBar,
    CommentInput,
    ChatLists,
    scrollCpn,
  },
  data() {
    return {
      fromUserId: "",
      toUserId: "",
      fromUser: {}, //当前用户的详细信息
      toUser: {}, //聊天对象的详细信息
      socket: null,
      recordLists: [], //聊天记录
      curRecordCount: 0,
    };
  },
  created() {
    this.fromUserId = this.$store.state.anglerId;
    this.toUserId = this.$route.params.uid;
  },
  mounted() {
    // console.log(
    //   "mounted communicate cpn mounted",
    //   "from" + this.fromUserId,
    //   this.toUserId
    // );
    this.getEachUserInfo().then(() => {
      this.getHistoryMsg().then(() => {
        this.$nextTick(() => {
          if (this.$refs.scrolllists) {
            this.$refs.scrolllists.bscroll.refresh();
            this.$refs.scrolllists.bscroll.scrollToElement(this.$refs.ulspace,500);
          }
        });
      }); //获取之前的消息记录
    });
    this.socket = io(serverUrl);
    this.socket.on(this.fromUserId, this.handleNewMsg); //监听自己发送的消息是否成功
    this.socket.on(this.toUserId + this.fromUserId, this.handleCouple); //监听自己发送的消息是否成功
  },
  methods: {
    backHistory() {
      this.$router.back();
    },
    //获取当前双方的信息
    async getEachUserInfo() {
      let from = await getAvatarInfo(this.fromUserId);
      let cp = await getAvatarInfo(this.toUserId);
      if (from.avatarUrl) {
        from.avatarUrl = serverUrl + "/images/avatar/" + from.avatarUrl;
      }
      if (cp.avatarUrl) {
        cp.avatarUrl = serverUrl + "/images/avatar/" + cp.avatarUrl;
      }
      this.fromUser = from;
      this.toUser = cp;
      return cp;
    },
    //获取历史消息记录
    getHistoryMsg() {
      return getHisMsg(this.fromUserId, this.toUserId).then((msglists) => {
        // console.log("获取历史消息结果", msglists); //commentUserId,commentTime,commentText
        for (let msg of msglists) {
          if (msg.commentUserId == this.fromUserId) {
            msg.userInfo = this.fromUser;
            msg.isFrom=true;
          } else {
            msg.userInfo = this.toUser;
            msg.isFrom=false;
          }
          msg.commentTime = customFormatedTime(msg.commentTime);
        }
        this.recordLists.push(...msglists);
        this.curRecordCount += msglists.length;
      });
    },
    //自己发送的消息从服务端socket返回
    handleNewMsg(da) {
      // console.log("服务端成功存储我发的数据", da);
      let newMsg = {
        commentUserId: this.fromUserId,
        commentText: da,
        userInfo: this.fromUser,
        commentTime: "刚刚",
        isFrom:true,
        _id: Math.random().toString().substr(2, 6),
      };
      this.recordLists.push(newMsg);
      this.curRecordCount += 1;
      this.$nextTick(() => {
        if (this.$refs.scrolllists) {
          this.$refs.scrolllists.bscroll.refresh();
            this.$refs.scrolllists.bscroll.scrollBy(0,-60,500);
        }

      });
    },
    //对方发来的新消息
    handleCouple(da) {
      // console.log("服务端成功存储对方的数据", da);
      let newMsg = {
        commentUserId: this.toUserId,
        commentText: da,
        userInfo: this.toUser,
        commentTime: "刚刚",
          isFrom:false,
        _id: Math.random().toString().substr(2, 6),
      };
      this.recordLists.push(newMsg);
      this.curRecordCount += 1;
      this.$nextTick(() => {
        if (this.$refs.scrolllists) {
          this.$refs.scrolllists.bscroll.refresh();
           this.$refs.scrolllists.bscroll.scrollBy(0,-60,500);
        }
      });
    },
    //发送一条消息
    onComment(commentText) {
      // console.log(this.$store.state.anglerId, "评论:", commentText);
      return sendCommMsg(this.fromUserId, this.toUserId, commentText).then(
        (errobj) => {
          if (errobj.errnum == 1) {
            console.log("发送消息成功");
          }
          return errobj.errnum;
        }
      );
    },
  },
};
</script>

<style>
.communicate-with-who {
  padding: 0 0.2em;
  padding-right:1.4em;
}

.msg-show-wrapper {
  height: 100vh;
}
.scroll-chat-wrapper {
  height: calc(100% - 80px);
  overflow: hidden;
}
</style>