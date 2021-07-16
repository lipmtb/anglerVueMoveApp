<template>
  <div class="send-form-data">
    <form action="#" @submit="sendSubmit" class="formSendField">
      <label for="title-area">
        <span class="title-text">标题</span>
        <input type="text" id="title-area" v-model.trim="title" />
      </label>

      <label for="content-area" class="content-field">
        <span class="content-text">内容</span>
        <textarea cols="20" rows="2" id="content-area" v-model.trim="content" />
      </label>

      <input
        type="file"
        id="img-area"
        multiple
        accept="image/*"
        name="content"
        style="display: none"
        @change="imgSelected"
      />
      <label for="img-area" class="clear-fix">
        <span class="img-adding">添加图片</span>
      </label>
      <ul class="cur-img-lists">
        <li class="img-item" v-for="(item,idx) in showImgLists" :key="item">
          <img
            class="img-source"
            :src="item"
            alt="垂钓图片"
            @load="revokeImg(item)"
          />
          <button type="button" class="del-btn" :data-del-idx="idx" @click="onDelImg">删除</button>
        </li>
      </ul>
      <input type="submit" value="发布" />
    </form>
  </div>
</template>

<script>
export default {
  name: "sendFromData",
  data() {
    return {
      title: "",
      content: "",
      curImgLists: [],
      showImgLists: [],
    };
  },
  props: {
    sendSubmitFn: {
      type: Function,
      required: true,
    },
  },
  methods: {
    sendSubmit(e) {
      e.preventDefault();
      let curTitle = this.title;
      let curContent = this.content;
      this.sendSubmitFn({
        title: curTitle,
        content: curContent,
        imgs: this.curImgLists,
      });
    },
    imgSelected(e) {
      // console.log("选择图片：", e.currentTarget.files);
      this.curImgLists.push(...e.currentTarget.files);
      let prosAll = [];
      for (let imgfile of e.currentTarget.files) {
        let pros = new Promise((resolve) => {
          let imageURL = document.defaultView.URL.createObjectURL(imgfile);
          resolve(imageURL);
        });
        prosAll.push(pros);
      }
      Promise.all(prosAll).then((resimg) => {
        this.showImgLists.push(...resimg);
      });
    },
    revokeImg(objectUrl) {
      console.log("释放imgUrl:", objectUrl);
      document.defaultView.URL.revokeObjectURL(objectUrl);
    },
    onDelImg(idx){
        this.showImgLists.splice(idx,1);
        this.curImgLists.splice(idx,1);
        // console.log( this.curImgLists,this.showImgLists);
        
    }
  },
};
</script>

<style scoped>
.formSendField {
  display: flex;
  flex-direction: column;
}

.formSendField label {
  margin: 0.4em 0;
}
.formSendField input#title-area {
  width: 80%;
  border: 1px solid #ddd;
  padding-left: 0.4em;
  height: 1.6em;
}

.formSendField input#title-area:focus,textarea#content-area:focus {
  outline: none;
}

.formSendField span.title-text,
span.content-text {
  margin: 0 0.4em;
}

.formSendField span.content-text {
  vertical-align: 10px;
}

.formSendField #content-area{
    width:80%;
    border: 1px solid #ddd;
    text-indent:0.4em;
    padding-top:0.2em;
}


.formSendField span.img-adding{
    float:left;
    padding:0.4em 0.6em;
    margin-left:1em;
    background-color: #32cd92;
    box-shadow: 1px 1px 10px #b6b2b2;
}
ul.cur-img-lists{
    list-style:none;
    display:flex;
    flex-wrap: wrap;
    justify-content: space-around;
    
}
ul.cur-img-lists li.img-item{
    position:relative;
   margin:0.6em 0.6em;
   
}
ul.cur-img-lists img.img-source{
    display: block;
   width:160px;
   height:160px;
   border:0.2px dotted #ddd;
}

ul.cur-img-lists button.del-btn{
    position: absolute;
    right:0.1em;
    top:0.1em;
    font-size:0.4em;
}
</style>