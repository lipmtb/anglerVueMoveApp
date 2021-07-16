import {
  commInstance
} from "./request";


//发送消息
export function sendCommMsg(fromId, toId, commentText) {
  return commInstance({
    url: '/socket/communicate',
    data: {
      fromUserId: fromId,
      toUserId: toId,
      commentText: commentText
    },
    method: 'post'
  })
}


//获取历史消息
export function getHisMsg(fromId, toId) {
  return commInstance({
    url: '/socket/commhistory',
    params: {
      fromUserId: fromId,
      toUserId: toId
    }
  })
}

//获取我的消息
export function getMsg(anglerId,skip) {
  return commInstance({
    url: '/socket/getmsg',
    params: {
      anglerId: anglerId,
      skip:skip
    }
  })
}

//获取一个会话消息
export function getCommMessage(commId) {
  return commInstance({
    url: '/socket/messageDetail',
    params: {
      commId: commId
    }
  })
}

//更新会话消息数
export function updateMsgCount(msgId){
  return commInstance({
    url: '/socket/updateComm',
    params: {
      sid: msgId
    }
  })
}
//获取所有消息总数
export function getMessageCountNet(anglerId){
  return commInstance({
    url: '/socket/allMsgCount',
    params: {
     anglerId:anglerId
    }
  })
}