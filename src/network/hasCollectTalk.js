import {talkInstance} from "./request";

//是否收藏过
export function hasAnglerCollect(anglerId,collectTalkId){
    return talkInstance({
        url:'/talk/hasCollectTalk',
        params:{
            anglerId:anglerId,
            talkId:collectTalkId
        }
    })
}

//收藏
export function collectTalk(anglerId,collectTalkId){
    return talkInstance({
        url:'/talk/collectTalk',
        params:{
            anglerId:anglerId,
            talkId:collectTalkId
        }
    })
}

//取消收藏
export function cancelCollect(collectId){
    return talkInstance({
        url:'/talk/cancelCollectTalk',
        params:{
          collectId:collectId
        }
    })
}