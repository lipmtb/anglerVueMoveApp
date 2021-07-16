let baseStyle="opacity:1;position:fixed;width:120px;transition:bottom 200ms ease-in,opacity 1s linear;border-radius:10px;color:#fff;height:60px;left:0;right:0;bottom:10px;margin:auto;background-color:#008c8c;line-height:60px;text-align:center";
export default function (config){
    let message=config.message||"";
    let duration=config.duration||3000;
    let messageBox=document.createElement("span");
    messageBox.innerHTML=message;
    messageBox.style.cssText=baseStyle;
    messageBox.style.color=config.color||'#fff';
    document.body.appendChild(messageBox);
    setTimeout(function(){
        messageBox.style.bottom="100px";
    },10)

    setTimeout(function(){
        messageBox.style.opacity=0;
    },500)
    setTimeout(function(){
        document.body.removeChild(messageBox);
    },duration);
}