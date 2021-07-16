<template>
  <div class="update-avatar-wrapper">
    <nav-bar>
      <i class="iconfont iconfanhui" slot="left" @click="backHistory"></i>
      <span slot="center">更换头像</span>
    </nav-bar>

    <div class="ch-wrapper">
      <div class="init-avatar-show">
        <div class="init-img" v-if="avatarUrl" :style="[initImgStyle]"></div>
        <div class="init-img init-plain-img" v-else></div>
        <p class="cur-avatar-text">头像预览</p>
      </div>

      <div class="new-avatar-show">
        <div
          class="avatar-box"
          :class="{ 'avatar-box-selected': tempObjectUrl }"
        >
          <img
            class="temp-img-sel"
            :src="tempObjectUrl"
            v-show="tempObjectUrl"
            alt="tempAvatar"
          />
          <!-- 遮罩 -->
          <div class="mod" v-show="tempObjectUrl"></div>
          <div
            class="move-curtain"
            v-show="tempObjectUrl"
            :style="[newImgStyle]"
            @touchstart="startCurtain"
            @touchmove="moveCurtain"
            @touchend="endCurtain"
          >
            <span class="direction-area"></span>
            <span class="direction-area"></span>
            <span class="direction-area"></span>
            <span class="direction-area"></span>
          </div>
        </div>
        <input
          type="file"
          name="newFile"
          id="filesel"
          style="display: none"
          @change="onSelectFile"
        />
        <label for="filesel" class="new-label-field">
          <span href="javascript:void(0)">选择新头像</span>
        </label>

        <button
          class="confirm-btn"
          :class="{ notAllowedBtn: hasSelected }"
          @click="submitNewAvatar"
          :disabled="hasSelected"
        >
          确认更换
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/NavBar";
import { getAvatarInfo ,changeAvatar} from "network/profile";
import serverUrl from "network/server";
export default {
  name: "changeAvatarCpn",
  data() {
    return {
      anglerId: "", //用户唯一标识
      avatarUrl: "", //用户当前头像
      avatarRadX: 0, //头像背景图移动比率backgroundPositionX:-1*avatarRadX*offsetWidth
      avatarRadY: 0,
      hasSelected: true, //控制能不能提交新头像
      tempObjectUrl: "", //新头像地址
      outerLeft: 0, //窗格的offsetParent的视口位置
      outerTop: 0,
      maxLeft: 0, //窗格不能划出固定区域
      maxTop: 0,
      curtainDx: 0, //滑动窗格的相对，touch点到窗格左边界距离
      curtainDy: 0,
      curtainLeft: 0, //控制窗格移动
      curtainTop: 0,
      fileData:null
    };
  },
  computed: {
    //预览头像样式
    initImgStyle() {
      return {
        backgroundImage: "url(" + this.avatarUrl + ")",
        backgroundPositionX: (-1) * this.avatarRadX * 120 + "px",
        backgroundPositionY: (-1) * this.avatarRadY * 120 + "px",
        backgroundSize: "120px 120px",
      };
    },
    //窗格背景图样式
    newImgStyle() {
      return {
        backgroundImage: "url(" + this.tempObjectUrl + ")",
        backgroundPositionX: (-1) * this.avatarRadX * 160 + "px",
        backgroundPositionY: (-1) * this.avatarRadY * 160 + "px",
        backgroundSize: "160px 160px",
        left: this.curtainLeft,
        top: this.curtainTop,
      };
    },
  },
  created() {
    this.anglerId = this.$store.state.anglerId;
    getAvatarInfo(this.anglerId).then((angler) => {
      //获取用户头像信息
      // console.log("获取用户头像信息222", angler);
      if (angler.avatarUrl) {
        this.avatarUrl = serverUrl + "/images/avatar/" + angler.avatarUrl;
        this.avatarRadX = angler.avatarRadX;
        this.avatarRadY = angler.avatarRadY;
       
      }
    });
  },
  components: {
    NavBar,
  },
  methods: {
    backHistory() {
      this.$router.back();
    },
    submitNewAvatar() {
      let that=this;
      that.hasSelected=true;
      // console.log("提交新头像");
      // console.log(this.anglerId,this.avatarRadX,this.avatarRadY,this.fileData);
      changeAvatar(this.anglerId,this.fileData,this.avatarRadX,this.avatarRadY).then((docs)=>{
        if(docs.errMsg){
          // console.log("提交失败");
           that.hasSelected=false;
          return;
        }
     
        // console.log(docs);
        setTimeout(()=>{
          that.$router.push("/profile");
        },1000);

      }).catch((error)=>{
        // alert("提交失败");
           that.hasSelected=false;
          //  console.log("更新头像失败",error);
      })
    },
    onSelectFile(e) {
      //  console.log("选择图片：", e.currentTarget.files);
      let newFile = e.currentTarget.files[0];
      this.fileData=e.currentTarget.files;
      if (this.tempObjectUrl) {
        document.defaultView.URL.revokeObjectURL(this.tempObjectUrl);
      }
      let imgTempObj = document.defaultView.URL.createObjectURL(newFile);
      // console.log("objectUrl", imgTempObj);
      this.tempObjectUrl = imgTempObj;
      this.avatarUrl = imgTempObj;
      this.avatarRadX = 0;
      this.avatarRadY = 0;
      this.hasSelected=false;
    },
    startCurtain(e) {
      // console.log("start",e.changedTouches[0].clientX,e.changedTouches[0].clientY);
      // console.log("start",e.currentTarget.offsetParent.offsetLeft,e.changedTouches[0].clientX);
      this.outerLeft = e.currentTarget.offsetParent.offsetLeft;
      this.outerTop = e.currentTarget.offsetParent.offsetTop;
      this.maxLeft =
        e.currentTarget.offsetParent.offsetWidth - e.currentTarget.offsetWidth;
      this.maxTop =
        e.currentTarget.offsetParent.offsetHeight -
        e.currentTarget.offsetHeight;
      this.curtainDx =
        e.changedTouches[0].clientX -
        this.outerLeft -
        parseFloat(this.curtainLeft);
      this.curtainDy =
        e.changedTouches[0].clientY -
        this.outerTop -
        parseFloat(this.curtainTop);
    },
    moveCurtain(e) {
      //  console.log("move",e.changedTouches[0].clientX,e.changedTouches[0].clientY);
      let newLeft =
        e.changedTouches[0].clientX - this.outerLeft - this.curtainDx;
      let newTop = e.changedTouches[0].clientY - this.outerTop - this.curtainDy;
      if (newLeft <= 0) {
        newLeft = 0;
      }
      if (newLeft >= this.maxLeft) {
        newLeft = this.maxLeft;
      }
      if (newTop <= 0) {
        newTop = 0;
      }
      if (newTop >= this.maxTop) {
        newTop = this.maxTop;
      }
      this.curtainLeft = newLeft + "px";
      this.avatarRadX = newLeft / 160;
      this.avatarRadY = newTop / 160;
      this.curtainTop = newTop + "px";
    },
    endCurtain(e) {
      // console.log(this.avatarRadX, this.avatarRadY);
      //  console.log("end",e.changedTouches[0].clientX,e.changedTouches[0].clientY);
    },
  },
};
</script>

<style>
.update-avatar-wrapper {
  text-align: center;
}
.init-avatar-show {
  padding: 1em 0;
}

.init-avatar-show .init-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #eee;
  background-repeat: no-repeat;
  margin: 1em auto;
}

.init-avatar-show .init-plain-img {
  background-image: url("~assets/img/defaultAvatar.png");

  background-position: center;
  background-size: contain;
}
.init-avatar-show p.cur-avatar-text {
  font-weight: bold;
}
.new-avatar-show {
  padding-top: 1em;
  border-top: 1px solid #eee;
}
.new-avatar-show .avatar-box {
  position: relative;
  width: 160px;
  height: 160px;
  background-image: url("~assets/img/icon.png");
  background-repeat: no-repeat;
  background-position: -72px -1506px;
  background-size: 749% 1350%;
  margin: 0 auto;
}
/*选择了新的，不显示背景图 */
.new-avatar-show div.avatar-box-selected {
  background-image: none;
}

.new-avatar-show .avatar-box img.temp-img-sel {
  width: 100%;
  height: 100%;
}

.new-avatar-show .avatar-box .mod {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.8;
}

/*滑动窗格 */
.avatar-box .move-curtain {
  position: absolute;

  cursor: move;
  width: 120px;
  height: 120px;
  border: 1px solid #fff;
  background-color: #fff;
}

.avatar-box .move-curtain span.direction-area {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: rgb(41, 40, 40);
}
.avatar-box .move-curtain span.direction-area:nth-child(1) {
  left: -10px;
  top: -10px;
}

.avatar-box .move-curtain span.direction-area:nth-child(2) {
  right: -10px;
  top: -10px;
}
.avatar-box .move-curtain span.direction-area:nth-child(3) {
  bottom: -10px;
  left: -10px;
}

.avatar-box .move-curtain span.direction-area:nth-child(4) {
  bottom: -10px;
  right: -10px;
}

/*end */
.new-label-field {
  display: block;
  text-align: center;
  padding: 0.6em 0;
}
.new-label-field:hover {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}

button.confirm-btn {
  background-color: rgb(50, 248, 155);
  color: #fff;
  outline: none;
  border: none;
  padding: 0.4em 1em;
  border-radius: 10px;
  cursor: pointer;
}

button.notAllowedBtn {
  background-color: #f4f5f7;
  cursor: not-allowed;
}
</style>