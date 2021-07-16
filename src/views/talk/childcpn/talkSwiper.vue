<template>
  <div class="talk-swiper">
      <run-img :img-lists="imgArr" :direction="-1" v-if="imgArr.length>0"></run-img>
  </div>
</template>

<script>
import RunImg from "components/common/RunImg";
export default {
    name:'homeSwiper',
    props:{
        imgArr:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    components:{
        RunImg
    },
    methods:{
        toImgDetail(talkId){
            this.$router.push({
                path:'/talkDetail',
                query:{
                    talkId:talkId
                }
            })
        }
    }
}
</script>

<style>

</style>