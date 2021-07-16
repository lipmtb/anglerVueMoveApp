<template>
  <div>
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="$router.back()"></i>
      <span slot="center">我的消息</span>
    </nav-bar>

    <div class="message-lists">
      <ul class="msg-lists">
        <li
          class="msg-sess-li"
          v-for="sess in myMessage"
          :key="sess._id"
          @click="toMsgSession(sess.coupleUserInfo._id, sess._id)"
          :class="{borderPoint:sess.messageCount>0}"
        >
          <div class="msg-sess-item">
            <div
              class="user-avatar"
              v-if="sess.coupleUserInfo.avatarUrl"
              :style="[getBgStyle(sess.coupleUserInfo)]"
            ></div>
            <div class="user-avatar plain-bgstyle" v-else></div>
            <p class="couple-name">{{ sess.coupleUserInfo.userName }}</p>
            <strong class="msg-count" v-show="sess.messageCount>0">新消息:{{ sess.messageCount }}</strong>
           
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import { getMsg, getCommMessage, updateMsgCount } from "network/communicate";
import { getAvatarInfo } from "network/profile";
import serverUrl from "network/server";
export default {
  name: "messagePage",
  components: {
    NavBar,
  },
  data() {
    return {
      userId: "",
      myMessage: [],
      curMessageCount: 0,
    };
  },
  created() {
    // console.log(this.$route.params.uid);
    this.userId = this.$route.params.uid;
    this.getMyMsg();
  },
  methods: {
    getBgStyle(userinfo) {
      return {
        backgroundImage: `url(${serverUrl}/images/avatar/${userinfo.avatarUrl})`,
        backgroundPositionX: -1 * userinfo.avatarRadX * 40 + "px",
        backgroundPositionY: -1 * userinfo.avatarRadY * 40 + "px",
        backgroundSize: "40px 40px",
      };
    },
    //获取我的会话消息
    getMyMsg() {
      return getMsg(this.userId, this.curMessageCount).then((reslists) => {
        // console.log("获取到我的消息会话comm:", reslists);

        let prosArr = [];
        for (let sess of reslists) {
          let pros = new Promise((resolve) => {
            //用sess.commId获取会话详细信息
            getCommMessage(sess.commId).then((comm) => {
              sess.commDetail = comm;

              let fromPros = getAvatarInfo(comm.fromUserId).then((user) => {
                sess.fromUserInfo = user;
                if (sess.userId != user._id) {
                  sess.coupleUserInfo = user;
                }
              });
              let toPros = getAvatarInfo(comm.toUserId).then((user) => {
                sess.toUserInfo = user;
                if (sess.userId != user._id) {
                  sess.coupleUserInfo = user;
                }
              });

              Promise.all([fromPros, toPros]).then(() => {
                resolve(comm);
              });
            });
          });
          prosArr.push(pros);
        }
        Promise.all(prosArr).then(() => {
          this.myMessage.push(...reslists);
          this.curMessageCount += reslists.length;
        });
      });
    },
    toMsgSession(coupleId, sessId) {
      this.$router.push("/communicate/" + coupleId);
      updateMsgCount(sessId).then((res) => {
          // console.log("更新会话消息数",res);
      });
    },
  },
};
</script>

<style scoped>
.message-lists {
  padding: 0 0.26em;
}

/* 头像默认 */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.4px solid #eee;
  background-color: rgba(255, 255, 255, 0.781);
  background-repeat: no-repeat;
}

.plain-bgstyle {
  background: url("~assets/img/defaultAvatar.png") no-repeat center/contain;
}

.msg-sess-li {
  box-shadow: 1px 1px 5px #eee;
  padding: 1em 0;
}
.msg-sess-item {
  display: flex;
}

.borderPoint{
 font-weight:700
}
.msg-sess-item p.couple-name {
  font-size: 2em;
  width: 160px;
  margin-left: 0.2em;
}
.msg-sess-item strong.msg-count {
  font-size: 1em;
    color:red;
  line-height: 40px;
}
</style>