<template>
  <div class="slide-tip-lists">
      <tip-item v-for="tipitem in slideTipLists" :essay-item-data="tipitem" :key="tipitem._id"></tip-item>
  </div>
</template>

<script>
//一种技巧列表
import TipItem from "./tipItem";
export default {
    name:'slideTipListsCpn',
    props:{
        slideTipLists:{
            type:Array,
            required:true,
            default(){
                return [];
            }
        }
    },
    components:{
        TipItem
    }
}
</script>

<style>

</style>