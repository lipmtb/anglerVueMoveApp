<template>
  <div class="backTopBtn">
      <span class="back-btn">回顶部</span>
  </div>
</template>

<script>
export default {
    name:'backBtnArrow',

}
</script>

<style>
.backTopBtn{
    position:fixed;
    bottom:2em;
    right:1em;
    width:40px;
    height:40px;
    border-radius:50%;
    background-color:cornsilk;
    line-height:40px;
    text-align: center;
    z-index:999;
}
.back-btn{
    font-size:0.2em;
    color:#666;
}
</style>