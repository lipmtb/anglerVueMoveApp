import {
  profileInstance
} from "./request";

/**
 * 获取我的收藏（钓友圈talk，tip技巧）
 * @param {type:'talk'|'tip'} 帖子类型
 * @param {anglerId}  用户的唯一标识
 * @param {page} 收藏的第几页
 */
export function getMyCollectType(anglerId, type, page) {
  return profileInstance({
    url: '/profile/mycollect',
    params: {
      anglerId: anglerId,
      type: type,
      page: page
    }
  })
}
//获取用户头像信息
export function getAvatarInfo(anglerId) {
  return profileInstance({
    url: '/profile/avatar',
    params: {
      anglerId: anglerId
    }
  })
}
//更换头像
export function changeAvatar(anglerId, imgs, radX, radY) {
  let formdata = new FormData();
  formdata.append("anglerId", anglerId);
  formdata.append("radX", radX);
  formdata.append("radY", radY);
  for (let imgfile of imgs) {
    formdata.append("talkImgs", imgfile);
  }
  return profileInstance({
    url: '/profile/changeProfile',
    method: 'post',
    data: formdata,
    headers: {
      "Content-Type": 'multipart/form-data'
    }

  })
}


//关注某个用户
export function careUserById(fromId, toId) {
  return profileInstance({
    url: '/profile/careUser',
    params: {
      fromUserId: fromId,
      toUserId: toId
    }
  })
}
// 取消关注
export function cancelCareUser(fromId, toId) {
  return profileInstance({
    url: '/profile/cancelCareUser',
    params: {
      fromUserId: fromId,
      toUserId: toId
    }
  })
}



//判断是否关注过某人
export function hasCareUser(fromId, toId) {
  return profileInstance({
    url: '/profile/hasCareUser',
    params: {
      fromUserId: fromId,
      toUserId: toId
    }
  })
}


//获取关注数和粉丝数
export function getCareAndFanCount(anglerId) {
  return profileInstance({
    url: '/profile/careNum',
    params: {
     anglerId:anglerId
    }
  })
}

//获取用户的关注
export function getUserCareById(anglerId,skip){
  return profileInstance({
    url:'/profile/mycare',
    params:{
      anglerId:anglerId,
      skipNum:skip
    }
  })
}

//获取用户的粉丝
export function getUserFanById(anglerId,skip){
  return profileInstance({
    url:'/profile/myfan',
    params:{
      anglerId:anglerId,
      skipNum:skip
    }
  })
}

//获取某个用户发布过的钓友圈帖子
export function getUserSendTalk(anglerId,skip){
  return profileInstance({
    url:'/talk/getHasSendTalk',
    params:{
      anglerId:anglerId,
      skipNum:skip
    }
  })
}

//获取某个用户发布过的技巧帖子
export function getUserSendTip(anglerId,skip){
  return profileInstance({
    url:'/tip/getHasSendTip',
    params:{
      anglerId:anglerId,
      skipNum:skip
    }
  })
}


