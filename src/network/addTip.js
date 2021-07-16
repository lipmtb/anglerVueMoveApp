import {tipInstance} from "./request";

export function addTipFormData(config){
    let formdata=new FormData();
    formdata.append("anglerName",config.anglerName);
    formdata.append("anglerId",config.anglerId);
    formdata.append("tipType",config.tipType);
    formdata.append("tipTitle",config.title);
    formdata.append("tipContent",config.content);
    for(let imgfile of config.imgs){
        formdata.append("tipImgs",imgfile);
    }
  

    return tipInstance({
        url:'/tip/addTipEssay',
        method:'post',
        data:formdata,
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
}