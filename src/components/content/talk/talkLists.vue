<template>
  <div class="talk-lists-wrapper">
    <talk-lists-item
      v-for="talkitem in talkLists"
      :essay-item-data="talkitem"
      :key="talkitem._id"
      @clickNameFn="catchClickName"
    ></talk-lists-item>
  </div>
</template>

<script>
import talkListsItem from "./talkListsItem";
export default {
  props: {
    talkLists: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    talkListsItem,
  },
  methods: {
    catchClickName(uid) {
     if(this.$route.matched[0].path=='/userInfo/:uid'){
        return;
      }
      this.$router.push({
        path: "/userInfo/"+uid,
      });
    }
  },
};
</script>

<style>
</style>