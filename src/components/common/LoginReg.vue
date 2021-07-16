<template>
  <div class="login-reg-choose">
    <!-- 登录注册切换 -->
    <div class="tab" v-on:click="chTab">
      <a
        href="javascript:void(0)"
        class="logintab"
        :class="{ activeTab: isLogin }"
        data-oper-type="login"
        >登录</a
      >
      <a
        href="javascript:void(0)"
        class="logintab"
        :class="{ activeTab: !isLogin }"
        data-oper-type="regist"
        >注册</a
      >
    </div>

    <div class="login-reg-ch">
      <!-- 登录 -->
      <form
        action="http://127.0.0.1/login"
        class="anglerform"
        method="post"
        id="loginForm"
        :style="{ display: isLogin ? 'flex' : 'none' }"
        @submit="loginSubmit"
      >
        <label for="namelogin">
          <span class="beforetext">用户名：</span>
          <input
            type="text"
            placeholder="用户名"
            id="namelogin"
            name="username"
            maxlength="12"
            v-model.trim="loginName"
          />
        </label>
        <label for="psw">
          <span class="beforetext">密码：</span>
          <input
            type="password"
            placeholder="密码"
            id="psw"
            name="userpassword"
            maxlength="8"
            v-model.trim="loginPsw"
          />
        </label>
        <input type="submit" value="登录" class="subbtn" />
      </form>

      <!-- 注册 -->
      <form
        action="http://127.0.0.1/regist"
        method="post"
        class="anglerform"
        :style="{ display: isLogin ? 'none' : 'flex' }"
        @submit="registSubmit"
      >
        <label for="nameregist">
          <span class="beforetext">用户名：</span>
          <input
            type="text"
            pattern="[\S+]{4,12}"
            placeholder="用户名4-12个非特殊字符"
            required
            id="nameregist"
            name="username"
            maxlength="12"
            v-model.trim="registusername"
          />
        </label>
        <label for="psw1">
          <span class="beforetext">密码：</span>
          <input
            type="password"
            required
            placeholder="密码至少6位最多18位,包含大小写字母和数字"
            id="psw1"
            name="userpassword"
            maxlength="18"
            v-model.trim="registPsw"
          />
        </label>
        <label for="psw2">
          <span class="beforetext">确认密码：</span>
          <input
            type="password"
            required
            placeholder="再次输入密码"
            id="psw2"
            maxlength="8"
            v-model="registPswConfirm"
          />
          <span class="tip-text"></span>
        </label>

        <input
          type="submit"
          value="注册"
          class="subbtn"
          id="reg-valid"
          :disabled="regBtnEnabled"
        />
      </form>
    </div>
    <div class="error-show" :style="{ display: hasError ? 'block' : 'none' }">
      <span :style="{ color: errColor }">{{ errorText }}</span>
    </div>
  </div>
</template>

<script>
import { loginRegRequest } from "network/request";
export default {
  name: "loginRegCpnControl",
  data() {
    return {
      isLogin: true,
      hasError: false,
      regBtnEnabled: false,
      errColor: "red",
      errorText: "输入不能为空",
      loginName: "",
      loginPsw: "",
      registusername: "jjcc", //注册名
      registPsw: "aaa", //注册密码
      registPswConfirm: "bbb", //注册确认密码
    };
  },
  methods: {
    chTab(e) {
      //切换登录注册

      let curTar = e.target.dataset.operType;
      if (curTar == "login") {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
    loginSubmit(e) {
      e.preventDefault();
      let loginName = this.loginName;
      let loginPsw = this.loginPsw;
      // console.log("登录用户", loginName);
      loginRegRequest({
        url: "/login",
        method: "post",
        data: {
          username: loginName,
          userpassword: loginPsw,
        },
      }).then((res) => {
        // console.log(res);
        if (res.errMsg == 1) {
          this.errColor = "green";
          this.hasError = true;
          this.errorText = "登录成功";
          this.$store.commit("changeUserState", {
          anglerId: res.anglerId,
          anglerName: res.anglerName,
        });
          setTimeout(() => {
            this.$router.back();
          }, 200);
        } else {
          this.errColor = "red";
          this.hasError = true;
          this.errorText = "登录失败，用户名或者密码错误";
        }
      });
    },
    registSubmit(e) {
      e.preventDefault();
      let regForm = e.currentTarget;
      let regUserName = this.registusername;
      let regPsw = this.registPsw;
      let regPswConfirm = this.registPswConfirm;
      // console.log("注册用户名：", regUserName);
      // console.log("注册用户密码：", regPsw);
      // console.log("注册用户确认密码：", regPswConfirm);

      //用户名格式检查
      if (regUserName.length < 4) {
        this.hasError = true;
        this.errorText = "用户名至少4个字符";
        this.errColor = "red";
        return;
      }

      let reg = /\s/;
      if (reg.test(regUserName)) {
        this.hasError = true;
        this.errorText = "用户名不能包含特殊字符";
        this.errColor = "red";
        return;
      }

      //密码格式检查
      let bigLetter = /[A-Z]/;
      if (!bigLetter.test(regPsw)) {
        this.hasError = true;
        this.errorText = "密码要包含大写字母";
        this.errColor = "red";
        return;
      }

      let regSmallLetter = /[a-z]/;
      if (!regSmallLetter.test(regPsw)) {
        this.hasError = true;
        this.errorText = "密码要包含小写字母";
        this.errColor = "red";
        return;
      }

      let numReg = /[0-9]/;
      if (!numReg.test(regPsw)) {
        this.hasError = true;
        this.errorText = "密码要包含数字";
        this.errColor = "red";
        return;
      }

      if (regPsw != regPswConfirm) {
        this.hasError = true;
        this.errorText = "确认密码与输入密码不一致";
        this.errColor = "red";
        return;
      }
      //注册中
      loginRegRequest({
        url: "/regist",
        method: "post",
        data: {
          username: regUserName,
          userpassword: regPsw,
        },
      }).then((res) => {
        // console.log(res);
        if (res.errMsg == 6) {
          this.hasError = true;
          this.errorText = "注册失败用户名重复";
          this.errColor = "red";
          return;
        }

        if (res.errMsg == 0) {
          this.hasError = true;
          this.errorText = "注册失败,网络错误";
          this.errColor = "red";
          return;
        }
        if (res.errMsg == 1) {
          // console.log("注册成功");
          this.errColor = "green";
          this.hasError = true;
          this.errorText = "注册成功";
          setTimeout(() => {
            regForm.reset();
            this.loginName = regUserName;
            this.isLogin = true;
            this.errorText = "请输入密码登录";
            this.regBtnEnabled = true;
          }, 1000);
        }
      });
    },
  },
};
</script>

<style>
div.tab {
  display: flex;
  height: 30px;
  line-height: 30px;
}

div.tab a.logintab {
  flex: 1;
  text-align: center;
  text-decoration: none;
  color: #000;
}
div.tab a.activeTab {
  border-bottom: 2px solid orange;
}
div.login-regist-wrappper {
  width: 300px;
  margin: 0 auto;
  padding: 10px;
  background-color: antiquewhite;
}

div.login-reg-ch {
  padding-top: 4px;
  border-top: 1px solid #e5e5e5;
}

div.login-reg-ch form.anglerform {
  display: flex;
  flex-direction: column;
}

div.login-reg-ch form.anglerform label {
  margin: 4px 0;
}

div.login-reg-ch form.anglerform label span.beforetext {
  display: inline-block;
  width: 80px;
}

div.login-reg-ch form.anglerform label input {
  width: 262px;
  border: 0;
  height: 28px;
  outline: none;
  padding-left: 4px;
}

div.login-reg-ch form.anglerform label input:focus {
  outline: #eb7350 solid 2px;
}

div.login-reg-ch form.anglerform input.subbtn {
  background-color: #f7671d;
  border: 0;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  padding: 6px 0;
  cursor: pointer;
  margin-top: 4px;
}

div.tab a.cur-active {
  font-weight: bold;
  border-bottom: 3px solid red;
}

form label {
  position: relative;
}
span.tip-text {
  position: absolute;
  left: 264px;
  width: 300px;
  top: 5px;
  font-size: 0.6em;
  color: rgb(160, 157, 157);
}
</style>