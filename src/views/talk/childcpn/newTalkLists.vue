<template>
  <div class="new-talk-essays">
    <talk-lists :talk-lists="hotNewLists"></talk-lists>
    <div class="more-hot-footer">
      <span
        class="more-text"
        @click="getNewTalkBySkipNum"
        :style="{ textDecoration: moreTextStyle }"
        >{{ moreText }}</span
      >
    </div>
  </div>
</template>

<script>
import TalkLists from "components/content/talk/talkLists";
import { getNewTalkLazy } from "network/getTalk";
import { getAvatarInfo } from "network/profile";
import serverUrl from "network/server";

import customFormatedDate from "util/customTime";
export default {
  name: "newTalkEssayLists",
  data() {
    return {
      curNewTalkCount: 0,
      hotNewLists: [],
      hasMoreNewTalk: true,
      moreText: "更多",
      moreTextStyle: "underline",
    };
  },
  components: {
    TalkLists,
  },
  created() {
    this.getNewTalkBySkipNum();
  },
  methods: {
    getNewTalkBySkipNum() {
      if (this.hasMoreNewTalk) {
        getNewTalkLazy(this.curNewTalkCount, 2).then((essayData) => {
          // console.log("获取最新帖子：", essayData);
          if (essayData.length < 2) {
            this.hasMoreNewTalk = false;
            this.moreText = "没有更多了。。。";
            this.moreTextStyle = "none";
          }
          let avatarAll = [];
          for (let i = 0; i < essayData.length; i++) {
            if (essayData[i].imgArr.length > 0) {
              essayData[i].imgArr[0] =
                serverUrl + "/images/talk/" + essayData[i].imgArr[0];
            }
            essayData[i].publishTime = customFormatedDate(
              essayData[i].publishTime
            );
            let pros = new Promise((resolve) => {
           
              getAvatarInfo(essayData[i].anglerId).then((anglerAvatar) => {
                if (anglerAvatar.avatarUrl) {
                  essayData[i].avatarUrl =
                    serverUrl + "/images/avatar/" + anglerAvatar.avatarUrl;
                  essayData[i].avatarRadX = anglerAvatar.avatarRadX;
                  essayData[i].avatarRadY = anglerAvatar.avatarRadY;
                }
                resolve(anglerAvatar);
              });
            });
            avatarAll.push(pros);
          }
          Promise.all(avatarAll).then(() => {
            if (essayData.length > 0) {
              this.hotNewLists.push(...essayData);
              this.curNewTalkCount += essayData.length;
            }
          });
        });
      }
    },
  },
};
</script>

<style>
.more-hot-footer {
  margin-top: 1em;
}

.more-hot-footer::after {
  content: "";
  display: block;
  clear: both;
  width: 0;
  height: 0;
  visibility: hidden;
}

.more-hot-footer span.more-text {
  float: right;
  margin-right: 3.4em;
  font-size: 0.6em;
  color: #4ba4ee;
}
</style>