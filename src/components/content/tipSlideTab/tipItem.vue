<template>
  <div class="essay-brief" @click="toTipEssayDetail(essayItemData._id)">
    <div class="essay-left" v-if="essayItemData.imgArr[0]">
      <img
        class="essay-img"
        :src="essayItemData.imgArr[0]"
        alt="文章，垂钓"
      />
    </div>
    <div class="essay-right">
        <i class="essay-type-text">{{essayItemData.tipType}}</i>
      <h2 class="essay-title">{{essayItemData.title}}</h2>
      <p class="essay-content">
      {{essayItemData.content}}
      </p>
      <div class="essay-right-footer clear-fix">
          <i class="user-avatar" :style=[avatarStyle] v-if="essayItemData.avatarUrl"></i>
        <i class="user-avatar default-avatar" v-else></i>
        <span class="user-name-text" @click.stop="toUserInfoPage(essayItemData.anglerId)">{{essayItemData.anglerName}}</span>
        <!-- <span class="essay-publishtime">{{essayItemData.publishTime}}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
//帖子简介组件
export default {
  name: "tipItem",
  props:{
    essayItemData:{
        type:Object,
        required:true
    }
  },
  computed:{
    avatarStyle(){
      return {
        backgroundImage:`url(${this.essayItemData.avatarUrl})`,
        backgroundSize:'20px 20px',
        backgroundPositonX:-1*this.essayItemData.avatarRadX*20+"px",
        backgroundPositonY:-1*this.essayItemData.avatarRadY*20+"px"

      }
    }
  },
  methods:{
     toTipEssayDetail(tId){
      console.log("toTipDetail",tId);
      this.$router.push({
        path:'/tipDetail',
        query:{
          tipId:tId
        }
      })
    },
    // 查看用户信息
    toUserInfoPage(uid){
      if(this.$route.matched[0].path=='/userInfo/:uid'){
        return;
      }
      this.$router.push({
        path:'/userInfo/'+uid
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
   padding-right:0.4em;
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
  font-size:0.4em;
  color:khaki;
}

.essay-right i.essay-type-text{
    float:right;
    font-size:0.4em;
    border:1px gold solid;
}


/* 用户头像 */
i.user-avatar{
  float:left;
  width:20px;
  height:20px;
  border-radius: 50%;
  border:0.2px solid rgb(192, 190, 190);
}
i.default-avatar{
  background:url("~assets/img/defaultAvatar.png") no-repeat center/contain;
}
</style>