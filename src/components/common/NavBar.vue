<template>
  <div class="nav-bar">
    <div class="nav-left">
      <slot name="left"></slot>
    </div>
    <div class="nav-center">
      <slot name="center"></slot>
    </div>
    <div class="nav-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'commonNavBar'
};
</script>

<style scoped>
div.nav-bar{
    height:44px;
    text-align: center;
    display:flex;

}


div.nav-left,div.nav-right{
    width:60px;
    line-height:44px;
}

div.nav-center{
    flex:1;
   
    line-height:44px;
}
</style>