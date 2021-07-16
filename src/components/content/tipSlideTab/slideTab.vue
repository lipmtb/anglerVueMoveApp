<template>
  <div class="tip-slide-tab">
      <ul class="tip-class">
          <li class="tip-classname" v-for="(classitem,idx) in tipClass" :class="{'avtiveClassName':activeTypeIdx==idx}" @click="onClickClassify(idx)"   :key="classitem._id" >
              <i :class="['iconfont',classitem.iconClass]"></i>
              <a href="javascript:void(0)" :class="{'avtiveClassName':activeTypeIdx==idx}">{{classitem.className}}</a>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
    name:"slideTab",
    props:{
        tipClass:{
            type:Array,
            default(){
                return [];
            }
        },
        activeTypeIdx:{
            type:Number,
            default(){
                return 0;
            }
        }
    },
    methods:{
        onClickClassify(idx){
          
            this.$emit("changetiptype",idx);
        }
    }
}
</script>

<style>
 div.tip-slide-tab{
     width:60px;
     background-color:#eee;
 }

 ul li.tip-classname{
     padding:1.4em 0;
 }
 .avtiveClassName{
     color:red;
     background-color:#fff;
 }
</style>