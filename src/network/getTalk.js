import {talkInstance} from "./request";

export function getTalkRunImg(){
    return talkInstance({
        url:'/talk/runTalkImg'
    })
}


//获取热门talk
export function getHotTalkLazy(skipNum,limitNum){
    return talkInstance({
        url:'/talk/hotTalk',
        params:{
            skip:skipNum,
            limit:limitNum
        }
    })
}

//获取最新talk
export function getNewTalkLazy(skipNum,limitNum){
    return talkInstance({
        url:'/talk/newTalk',
        params:{
            skip:skipNum,
            limit:limitNum
        }
    })
}
//获取talk详情
export function getTalkDetail(talkId){
    return talkInstance({
        url:'/talk/talkDetail',
        params:{
            talkId:talkId
        }
    })
}

//获取talk的评论和评论talk帖子
export function getTalkComment(talkId,skipnum){
    return talkInstance({
        url:'/talk/commentList',
        params:{
            talkId:talkId,
            skipNum:skipnum
        }
    })
}


//评论talk
export function commentTalkEssay(anglerName,commentTalkId,text){
    return talkInstance({
        url:'/talk/commentTalk',
        data:{
            anglerName:anglerName,
            commentTalkId:commentTalkId,
            commentText:text
        },
        method:'post'
    })
}