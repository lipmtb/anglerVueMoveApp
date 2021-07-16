<template>
  <div class="essay-brief" @click="toTalkDetail(essayItemData._id)">
    <div class="essay-left" v-if="essayItemData.imgArr[0]">
      <img
        class="essay-img"
        :src="essayItemData.imgArr[0]"
        alt="文章，垂钓"
      />
    </div>
    <div class="essay-right">
      <h2 class="essay-title">{{essayItemData.title}}</h2>
      <p class="essay-content">
      {{essayItemData.content}}
      </p>
      <div class="essay-right-footer">
        <span class="user-name-text">{{essayItemData.anglerName}}</span>
        <span class="essay-publishtime">{{essayItemData.publishTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
//帖子简介组件
export default {
  name: "essayBriefItem",
  props:{
    essayItemData:{
        type:Object,
        required:true
    }
  },
  methods:{
     toTalkDetail(tId){
      console.log("toTalkdetail",tId);
      this.$router.push({
        path:'/talkDetail',
        query:{
          talkId:tId
        }
      })
    }
  }
};
</script>

<style>
.essay-brief {
  display: flex;
  height: 160px;
  padding: 1em 0 1em;
  border-bottom: 1px dotted #ddd;
}
.essay-brief .essay-left{
  width:128px;
}
.essay-brief .essay-left img.essay-img {
  width: 128px;
  height: 140px;
}

.essay-brief .essay-right{
  flex:1;
 
}
.essay-brief .essay-right h2.essay-title {
  text-align: center;
}

.essay-brief .essay-right p.essay-content {
  min-height:2em;
  max-height: 3.4em;
  overflow: hidden;
  text-indent: 1em;
  font-size: 1.2em;
  color: #000;
  word-wrap: break-word;
  word-break: break-all;
}
.essay-right-footer{
  margin-top:1em;
}
.essay-right-footer::after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}
.essay-right-footer span.user-name-text {
  float: left;
  margin-left:0.4em;
}

.essay-right-footer span.essay-publishtime {
  float: right;
  margin-right:0.4em;
  margin-top:0.2em;
  font-size:0.6em;
  color:khaki;
}
</style>