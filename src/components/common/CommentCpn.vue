<template>
  <div class="comment-wrapper">
    <div class="comment-leader" :class="{ 'fix-leader': fixLeader }">
      <button @click="backToPage" v-show="showBackBtn">返回</button>
      <span class="comm-leader-text">全部评论</span>
      <b class="comm-count">{{ commentLists.length }}</b>
    </div>
    <ul class="comment-lists">
      <li
        class="comment-item"
        v-for="commentitem in commentLists"
        :key="commentitem._id"
      >
        <div class="avatar-left" v-if="commentitem.avatarUrl">
          <img
            class="user-avatar-img"
            :src="commentitem.avatarUrl"
            alt=""
            width="24"
            height="24"
          />
        </div>

        <div class="comm-right">
          <div class="comm-main">
            <a href="javascript:void(0)">{{ commentitem.anglerName }}</a>
            <p class="comment-text-pass">{{ commentitem.commentText }}</p>
          </div>
          <div class="comm-footer">
            <span>{{ commentitem.commentTime | formattedDate }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="more-comm-wrapper clear-fix">
      <a
        href="javascript:void(false)"
        class="more-comment-text right"
        @click="showMoreComment"
        >{{ hasCommentTip }}</a
      >
    </div>
  </div>
</template>

<script>
// 评论列表显示
export default {
  name: "commentListsCpn",
  props: {
    commentLists: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      fixLeader: false,
      hasMoreComment: true,
      hasCommentTip:'更多评论',
      showBackBtn:false
    };
  },
  filters: {
    formattedDate(datestr) {
      // console.log(datestr);
      return new Date(datestr).toLocaleTimeString();
    },
  },
  mounted() {
    document.defaultView.addEventListener(
      "scroll",this.onCommentScroll,
      false
    );
  },
  destroyed(){

    document.defaultView.removeEventListener("scroll",this.onCommentScroll);
  },
  methods: {
    showMoreComment() {
      if (this.hasMoreComment) {
        console.log("正在获取更多评论");
        this.$parent.getTalkDetailComment().then((resnum) => {
          if (resnum <5) {
            this.hasMoreComment=false;
            this.hasCommentTip="没有更多了。。。"
          }
        });
      }
    },
     onCommentScroll () {
      //  console.log(e,this);
        let commentLeader = document.querySelector("div.talk-detail ul.comment-lists");
        if (commentLeader) {
          let bounding = commentLeader.getBoundingClientRect();
          // console.log(bounding);
          if (bounding.y > 0) {
            this.fixLeader = false;
            this.showBackBtn=false;
            return;
          } else {
            this.fixLeader = true;
            this.showBackBtn=true;
          }
        }
      },
      backToPage(){
        this.$router.back();
      }
  }
};
</script>

<style>
div.comment-leader .comm-leader-text {
  margin: 0 0.4em;
}
div.fix-leader {
  position: fixed;
  top: 0.2em;
  left: 0;
}
ul.comment-lists li.comment-item {
  list-style: none;
  display: flex;
  margin-top: 1em;
}

ul.comment-lists li.comment-item div.avatar-left {
  width: 24px;
  padding-left: 2px;
  margin: 0 0.4em;
  padding-top: 0.5em;
}
ul.comment-lists li.comment-item div.comm-right {
  width: 80%;
  padding: 0.4em;
  border-bottom: 0.4px solid rgb(207, 204, 204);
}

ul.comment-lists li.comment-item .comm-main p.comment-text-pass {
  color: #000;
  margin: 0.4em 0;
  padding-right: 1.2em;
}
ul.comment-lists li.comment-item .comm-footer {
  font-size: 0.4em;
}
div.more-comm-wrapper {
  margin-top: 1em;
}
div.more-comm-wrapper a.more-comment-text {
  font-size: 0.6em;
  color: rgb(91, 195, 255);
  text-decoration: underline;
  margin-right: 0.4em;
}
</style>