import {tipInstance} from "./request";
//获取技巧类型列表
export function getTipType(){
    return tipInstance({
        url:'/tip/tipClass'
    })
}

//获取某个技巧帖子的详情
export function getTipById(tid){
    return tipInstance({
        url:'/tip/tipEssayDetail',
        params:{
            tipId:tid
        }
    })
}

//评论技巧帖子
export function commentTip(anglerName,tipId,commentText){
    return tipInstance({
        url:'/tip/commentTip',
        method:'post',
        data:{
            anglerName:anglerName,
            commentTipId:tipId,
            commentText:commentText
        }
    })
}
//获取技巧帖子评论
export function getTipComment(tipId,skip){
    return tipInstance({
        url:'/tip/commentList',
        params:{
            tipId:tipId,
            skipNum:skip
        }
    })
}
//收藏技巧
export function collectTip(anglerId,tipId){
    return tipInstance({
        url:'/tip/collectTip',
        method:'post',
        data:{
            anglerId:anglerId,
            tipId:tipId
        }
    })
}
//是否收藏过技巧
export function hasAnglerCollect(anglerId,tipId){
    return tipInstance({
        url:'/tip/hasCollectTip',
        method:'get',
        params:{
            anglerId:anglerId,
            tipId:tipId
        }
    })
}
//取消收藏技巧
export function cancelCollect(anglerId,tipId){
    return tipInstance({
        url:'/tip/cancelCollect',
        method:'post',
        data:{
            anglerId:anglerId,
            tipId:tipId
        }
    })
}

//获取所有技巧类型和对应的帖子,$lookup
export function getAllTipEssays(){
    return tipInstance({
        url:'/tip/tipClassSomeEssays'
    })
}

//根据技巧类型名获取帖子列表
export function getTipEssaysByClassName(tipName,skipnum){
    return tipInstance({
        url:'/tip/getTipByClassName',
        params:{
            tipType:tipName,
            skipNum:skipnum
        }
    })
}


//搜索技巧帖子
export function searchTipByKey(keyword){
    return tipInstance({
        url:'/tip/searchTipByKey',
        params:{
            keystr:keyword
        }
    })
}