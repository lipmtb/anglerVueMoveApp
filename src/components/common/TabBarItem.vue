<template>
  <div class="tab-bar-item" @click="toTabView" :style="{color:isActive?'#008c8c':'#666'}">
    <i :class="['iconfont', isActive?itemData.activeIcon:itemData.icon]"></i>
    <span class="tab-text">{{ itemData.text }}</span>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    itemData: {
      type: Object,
    },
  },
  computed:{
    isActive(){
      return this.$route.matched[0].path==this.itemData.path;
    }
  },
  methods:{
     toTabView(){
        
         if(this.$route.matched[0].path===this.itemData.path){
             return;
         }
         this.$router.push({
             path:this.itemData.path
         })
     } 
  }
};
</script>

<style scoped>
.tab-bar-item{
    flex:1;
    text-align: center;
}
    i.iconfont {
        display:block;   
    }
</style>
   