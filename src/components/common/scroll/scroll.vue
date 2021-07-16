<template>
  <div class="scroll-wrapper" ref="scrollbox">
    <div class="scroll-conten">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScorll from "better-scroll";

export default {
  name: "commontScrollWrapper",
  data() {
    return {
      bscroll: null,
      timer: false,
    };
  },
  mounted() {
    let that = this;
    this.bscroll = new BScorll(this.$refs.scrollbox, {
      pullUpLoad: true,
      probeType: 1,
      click: true,
    });

    this.bscroll.on("pullingUp", function () {
      that.$emit("onpullingup", that.bscroll);
    });

    this.bscroll.on("scroll", function (position) {
          that.$emit("chfix",position);
    });

  
  }
};
</script>

<style>
</style>