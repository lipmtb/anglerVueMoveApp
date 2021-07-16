<template>
  <div id="talk-wrapper">
    <div id="addTalk">
      <em class="add-talk-em" @click="toAddTalk">+</em>
    </div>
    <!-- 导航 -->
    <nav-bar class="talk-nav"><span slot="center">钓友圈</span></nav-bar>
    <!-- 轮播图 -->
    <talk-swiper :img-arr="imgdatas"></talk-swiper>

    <!-- 钓友圈热门和最新 -->
    <div class="talk-tab-ch">
      <router-link to="/talk/hotTalk">热门</router-link>
      <router-link to="/talk/newTalk">最新</router-link>
    </div>
    <keep-alive><router-view></router-view></keep-alive>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import TalkSwiper from "./childcpn/talkSwiper";

import { getTalkRunImg } from "network/getTalk";
import serverUrl from "network/server.js";

export default {
  name: "talk",
  data() {
    return {
      imgdatas: [],
      curSubPage: "/talk/hotTalk",
    };
  },
  components: {
    NavBar,
    TalkSwiper,
  },
  created() {
    // console.log("talk created");
    getTalkRunImg().then((rundatas) => {
      //  console.log("轮播图数据", rundatas);
       for(let i=0;i<rundatas.length;i++){
         if(rundatas[i].imgArr.length===0){
           rundatas.splice(i,1);
           i--;
         }
       }
      //serverUrl
      for (let da of rundatas) {
        if(da.imgArr.length>0){

          da.imgArr[0] = serverUrl + "/images/talk/" + da.imgArr[0];
        }
      }
      this.imgdatas = rundatas;
    });
  },
  beforeRouteLeave(to, from, next) {
    // console.log("talkvue route leave:", this.$route.path);
    this.curSubPage = this.$route.path;
    next();
  },
  activated() {
    // console.log("talkcpn activated", this.curSubPage);
    if (this.$route.path != this.curSubPage) {
      this.$router.push(this.curSubPage);
    }
  },
  methods: {
    toAddTalk() {
    
      if (this.$store.state.anglerId) {
        this.$router.push("/addTalk");
      } else {
        this.$router.push("/loginReg");
      }
    }
  },
};
</script>

<style>
/*talkvue style */
#talk-wrapper {
  padding-bottom: 200px;
}
.talk-nav {
  background-color: var(--color-tint);
  box-shadow: 1px 1px 5px #eee;
}

#addTalk {
  position: fixed;
  width: 80px;
  height: 60px;
  background-color: yellow;
  opacity: 0.6;
  bottom: 3em;
  left: 0;
  right: 0;
  margin: auto;
}
em.add-talk-em {
  display: block;
  font-size: 1em;
  color: #fff;
  font-size: 2em;
  text-align: center;
  margin-top: 0.4em;
}

div.talk-tab-ch {
  border-top: 4px solid #eee;

  padding: 1em 0.2em;
  display: flex;
  height: 3.6em;
  font-size: 1.4em;

  text-align: center;
  color: #999;
  position:sticky;
  top:0;
  background-color: #fff;
}
div.talk-tab-ch a {
  flex: 1;
}

a.router-link-exact-active {
  border-bottom: 2px solid red;
  color: #000;
  font-weight: bold;
}
</style>