<template>
  <div class="search-wrapper">
      <input type="search" class="search-input" v-model="searchVal"/>
      <button type="button" class="search-btn" @click="onSearchTip">搜索</button>
  </div>
</template>

<script>
//搜索技巧组件
export default {
    name:'searchCpn',
    data(){
      return {
        searchVal:'11'
      }
    },
    methods:{
      onSearchTip(){
        if(this.searchVal){

        this.$emit("onsearchTip",this.searchVal);
        }
      }
    }
}
</script>

<style>
.search-wrapper{
  display:flex;
  height:36px;
}

.search-wrapper input.search-input{
  flex:1;
  border:1px solid rgb(197, 195, 195);
  border-right:0;
  padding-left:0.6em;
}

.search-wrapper input.search-input:focus{
  outline:none;
}

.search-wrapper button.search-btn{
  width:80px;
  padding:0.2em;
  background-color: rgb(89, 164, 250);
  border:none;
  border-radius:0 5px 5px 0;
  color:#fff;
}
</style>