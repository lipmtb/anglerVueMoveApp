import axios from "axios";
import serverUrl from "./server";
//talk 钓友圈
export function talkInstance(config){

    let talkAxios=axios.create({
        baseURL:serverUrl,
        timeout:5000,
        withCredentials:true
    });
    talkAxios.interceptors.response.use((res)=>{
        return res.data;
    })
    return talkAxios(config);
}

//登录注册axios
export function loginRegRequest(config){

    let loginRegAxios=axios.create({
        baseURL:serverUrl,
        timeout:5000,
        withCredentials:true
    });
    loginRegAxios.interceptors.request.use((config)=>{
        if(config.url=='/login/isLogin'){
            // console.log("axios request拦截");
            config.headers={
                "Cache-Control":'no-cache'
            }
        }
        return config;
    })
    loginRegAxios.interceptors.response.use((res)=>{
        return res.data;
    })
    return loginRegAxios(config);
}


//tip技巧
export function tipInstance(config){

    let tipAxios=axios.create({
        baseURL:serverUrl,
        timeout:5000,
        withCredentials:true
    });
    tipAxios.interceptors.response.use((res)=>{
        return res.data;
    })
    return tipAxios(config);
}


//我的信息
export function profileInstance(config){

    let profileAxios=axios.create({
        baseURL:serverUrl,
        timeout:5000,
        withCredentials:true
    });
    profileAxios.interceptors.response.use((res)=>{
        return res.data;
    })
    return profileAxios(config);
}


// 聊天
export function commInstance(config){

    let commAxios=axios.create({
        baseURL:serverUrl,
        timeout:5000,
        withCredentials:true
    });
    commAxios.interceptors.response.use((res)=>{
        return res.data;
    })
    return commAxios(config);
}