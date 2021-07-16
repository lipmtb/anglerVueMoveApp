<template>
  <div class="chat-lists" >
      <chat-item v-for="item in chatDataLists" :chat-data="item"  :key="item._id"></chat-item>
  </div>
</template>

<script>
import chatItem from "./ChatItem";
export default {
    name:'chatListsCpn',
    components:{
        chatItem
    },
    props:{
        chatDataLists:{
            type:Array,
            default(){
                return [];
            }
        }
    }
}
</script>

<style>

</style>