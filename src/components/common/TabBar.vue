<template>
  <div id="tab-bar">
      <tab-bar-item v-for="item in tabData" :item-data="item" :key="item.path"></tab-bar-item>
  </div>
</template>

<script>
import tabBarItem from "./TabBarItem";
export default {
    name:'TabBar',
    props:{
        tabData:{
            type:Array
        }
    },
    components:{
        tabBarItem
    }
}
</script>

<style>
    #tab-bar{
        position:fixed;
        bottom:0;
        left:0;
        right:0;
        height:49px;
        background-color:#eee;
        display:flex;
        padding:0.4em 0;
    }
</style>