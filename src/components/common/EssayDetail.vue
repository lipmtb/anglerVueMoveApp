<template>
  <div class="essay-wrapper" v-show="essayData">
    <div class="user-info clear-fix">
      <div class="user-avatar-wrapper left">
        <slot name="useravatar"></slot>
      </div>
      <a class="user-name left">
        {{ essayData && essayData.anglerName }}
      </a>
      <div class="user-collect-info right">
        <slot name="collectSlot"></slot>
      </div>
    </div>
    <h2 class="essay-title">{{ essayData && essayData.title }}</h2>
    <p class="essay-content">{{ essayData && essayData.content }}</p>
    <ul class="img-show-wrapper" v-if="essayData && essayData.imgArr">
      <li class="img-show-item" v-for="item in essayData.imgArr" :key="item">
        <img :src="item" alt="anglerimg" />
      </li>
    </ul>
    <div class="publishTimeBox clear-fix">
      <span class="right">{{essayData.publishTime}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "essayDetailCpn",
  props: {
    essayData: {
      type: Object,
      default() {
        return {
          title: "标题",
          content: "内容加载中......",
          imgArr: [],
        };
      },
    },
  },

};
</script>

<style scoped>
div.user-info {
  padding: 0.4em;
  border-top: 1px dashed #eee;
  border-bottom: 1px dashed #eee;
}

div.user-collect-info i.iconfont {
  font-size: 1.6em;
}

.user-avatar-wrapper{
  margin-right:0.4em;
}
a.user-name {
  
  font-size: 1.6em;
}
a.user-name:hover {
  cursor: pointer;
  text-decoration: underline;
}

h2.essay-title {
  text-align: center;
}

p.essay-content {
  padding: 0.4em;
}
ul.img-show-wrapper {
  margin-top: 10px;
}
ul.img-show-wrapper li.img-show-item {
  margin-top: 6px;
}
ul.img-show-wrapper li.img-show-item img {
  width: 80%;
}

/* 发布时间 */
.publishTimeBox{
  font-size:0.4em;
  color:#ccc;
}
</style>