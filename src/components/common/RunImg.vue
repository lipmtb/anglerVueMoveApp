<template>
  <div class="run-img-wrapper">
    <div class="stage-track">
      <ul
        class="img-lists"
        :style="[initStyle]"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <li class="img-item" v-for="imgitem in imgLists" :key="imgitem._id">
          <a href="javascript:void(0)" @click="onClickImg(imgitem._id)"
            ><img :src="imgitem.imgArr[0]" alt="垂钓"
          /></a>
        </li>
      </ul>

      <ul class="dotted-lists">
        <li
          class="dotted-item"
          v-for="(item, idx) in dottedLists"
          :key="item"
          :style="{ borderColor: curIdx == idx ? '#f00' : '#000' }"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "RunImg",
  props: {
    imgLists: {
      type: Array,
      default() {
        return [];
      },
    },
    direction: {
      type: Number,
      default() {
        return -1;
      },
    },
  },
  data() {
    return {
      timer: 0,
      curIdx: 0, //当前轮播展示的索引
      singleWd: 359, //每张图宽度，important
      changRatio: 0.33, //切换比率
      len: 0,
      cX: 0,
      curLeft: 0,
      initStyle: {
        left: 0,
        top: 0,
        transition: "left 500ms linear",
      },
      dottedLists: [],
    };
  },
  created() {
   
    clearInterval(this.timer);
    this.len = this.imgLists.length; //轮播的个数
    let cuLen = this.imgLists.length;
    this.curIdx = 0;
    if (this.direction > 0) {
      this.curIdx = this.len - 1;
    }

    this.dottedLists = Array.from({ length: cuLen }, (item, idx) => {
      return String.fromCharCode(65 + idx);
    });
    //  console.log("created runImg cpn",this.imgLists,this.dottedLists);
    this.timer = setInterval(() => {
      if (this.direction > 0) {
        this.curIdx--;
        this.curIdx = this.curIdx < 0 ? this.len - 1 : this.curIdx;
      } else {
        this.curIdx++;
        this.curIdx = this.curIdx > this.len - 1 ? 0 : this.curIdx;
      }
      this.initStyle.left = this.curIdx * this.singleWd * -1 + "px";
      // console.log("style curLeft", this.initStyle.left);
    }, 3000);
  },
  methods: {
    onClickImg(tId) {
      let that = this;
      // console.log("clearInterval",this);
      clearInterval(this.timer);
      setTimeout(() => {
        that.$parent.toImgDetail(tId);
      },100);
    },
    onTouchStart(e) {
      this.cX = e.changedTouches[0].clientX;
      this.curLeft = parseFloat(this.initStyle.left);
      clearInterval(this.timer);
    },
    onTouchMove(e) {
      let moveTo = this.curLeft + (e.changedTouches[0].clientX - this.cX);
      moveTo = moveTo > 0 ? 0 : moveTo; //不能滑过边界
      moveTo =
        moveTo < -1 * (this.len - 1) * this.singleWd
          ? -1 * (this.len - 1) * this.singleWd
          : moveTo;
      this.initStyle.left = moveTo + "px";
    },
    onTouchEnd() {
      let endLeft = parseFloat(this.initStyle.left);

      //移动到边界的两种情况
      if (endLeft == 0) {
        this.curIdx = 0;
        return;
      }

      if (endLeft == -1 * (this.len - 1) * this.singleWd) {
        this.curIdx = this.len - 1;

        return;
      }

      //移动到两者之间需要进一步判断（tNum）
      let divideNum = endLeft / (-1 * this.singleWd); //2.78
      let tNum = divideNum % Math.floor(divideNum); //0.78 取出小数部分
      if (divideNum < 1) {
        //小于1不用取小数，直接用
        tNum = divideNum;
      }

      // console.log("divideNum", divideNum);
      // console.log(ulbox.style.left, tNum);
      if (tNum > 0 && tNum < this.changRatio) {
        this.initStyle.left = -1 * this.singleWd * (divideNum - tNum) + "px";
        this.curIdx = divideNum - tNum;
      }

      if (tNum > 1 - this.changRatio) {
        this.initStyle.left =
          -1 * this.singleWd * (divideNum - tNum + 1) + "px";

        this.curIdx = divideNum - tNum + 1;
      }

      this.timer = setInterval(() => {
        if (this.direction > 0) {
          this.curIdx--;
          this.curIdx = this.curIdx < 0 ? this.len - 1 : this.curIdx;
        } else {
          this.curIdx++;
          this.curIdx = this.curIdx > this.len - 1 ? 0 : this.curIdx;
        }
        this.initStyle.left = this.curIdx * this.singleWd * -1 + "px";
      }, 3000);
    },
  },
};
</script>

<style scoped>
div.stage-track {
  position: relative;
  height: 300px;
  margin: 10px auto;
  overflow: hidden;
}
ul.img-lists {
  list-style: none;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0;
  margin: 0;
  width: 400%;
  height: 100%;
}

ul.img-lists li.img-item {
  float: left;
}

ul.img-lists li.img-item img {
  width: 357px;
  height: 298px;
}

ul.dotted-lists {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  width: 200px;
  margin: auto;
  padding: 0;
  text-align: center;
}

ul.dotted-lists li.dotted-item {
  display: inline-block;
  width: 5px;
  height: 5px;
  border: 1px solid #000;
  border-radius: 50%;
  margin-right: 20px;
}
</style>