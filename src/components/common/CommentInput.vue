<template>
  <div class="my-comment-area" :style="{opacity:alpanum}">
      <input type="text" v-model.trim="commentVal" class="input-comment-area" @click="focusInputComment"/>
      <button class="add-comm-btn" @click="addComment" :disabled="canComment">
          <slot><span>评论</span></slot>
      </button>
  </div>
</template>

<script>
// 评论输入组件
export default {
    name:'commentInput',
    props:{
        addCommentFn:{
            type:Function,
            required:true
        }
    },
    data(){
        return {
            commentVal:'666',
            alpanum:0.4,
            canComment:false
        }
    },
    mounted(){
      
        document.defaultView.addEventListener("scroll",function(e){
            
            this.alpanum=0.4;

        }.bind(this),false)
    },
    methods:{
        focusInputComment(){
            console.log("click commentiput");
            this.alpanum=1;
        },
        addComment(){
            this.canComment=true;
            if(this.commentVal.length<1){
                this.canComment=false;
             
                return;
            }
            this.addCommentFn(this.commentVal).then((errnum)=>{
                // console.log("评论返回errMsg",errnum);
                if(errnum==1){
                    this.commentVal="";
                }
                this.canComment=false;
            });
        }
    }
}
</script>

<style>

div.my-comment-area{
    display: flex;
    position:fixed;
    bottom:0;
    left:0;
    right:0;


}

div.my-comment-area .input-comment-area{
    flex:1;
       outline:none;
       line-height:1;
       text-indent: 0.6em;
       border-right:0;
       border-radius:5px 0 0 5px;
}


    button.add-comm-btn{
        border:none;
        background-color:#034b4b;
        color:#fff;
        width:80px;
        padding:0.4em 0;
        border-radius:0 5px 5px 0;
    }
</style>