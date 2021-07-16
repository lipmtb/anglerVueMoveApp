<template>
  <div id="profile-wrapper">
    <user-profile></user-profile>

    <user-oper :message-count="allMsgCount"></user-oper>
  </div>
</template>

<script>
import UserProfile from "components/common/UserProfile";
import UserOper from "components/common/UserOperLists";

import { getMessageCountNet } from "network/communicate";
export default {
  name: "profile",
  data() {
    return {
      allMsgCount: 0,
    };
  },
  components: {
    UserProfile,
    UserOper,
  },
  created() {
    this.getMsgCount();
  },
  methods: {
    getMsgCount() {
      if (this.$store.state.anglerId) {
        getMessageCountNet(this.$store.state.anglerId).then((res) => {
          // console.log("总消息数", res);
          this.allMsgCount = parseInt(res.count);
        });
      }
    },
  },
};
</script>

<style>
</style>