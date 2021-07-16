import {talkInstance} from "./request";

export function addTalkFormData(config){
    let formdata=new FormData();
    formdata.append("talkTitle",config.title);
    formdata.append("talkContent",config.content);
    for(let imgfile of config.imgs){
        formdata.append("talkImgs",imgfile);
    }
  

    return talkInstance({
        url:'/talk/addTalk',
        method:'post',
        data:formdata,
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
}