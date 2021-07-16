<template>
  <div class="user-list-shows">
      <user-info-item v-for="userinfo in userInfoLists" :user-info="userinfo" :key="userinfo._id" ></user-info-item>
  </div>
</template>

<script>
import UserInfoItem from "./UserListsItem";
export default {
    name:'userListsCpn',
    components:{
        UserInfoItem
    },
    props:{
        userInfoLists:{
            type:Array,
            default(){
                return [];
            }
        }
    }
}
</script>

<style scoped>
.user-list-shows{
    padding:0.4em 0.2em;
}
</style>