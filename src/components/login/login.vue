<template>
  <div class="page-login">
    <img
      class="yhui-imglogo"
      src="../../assets/common/image/common/loginPage_logo_ctc.png"
      alt=""
    />
    <div class="login_box">
      <div class="login_header">
        <img src="../../assets/common/image/logo.png" class="logo_img" />
      </div>
      <div class="user_name">
        <i
          class="iconfont icon-yonghu"
          v-bind:class="{ writeColor2: chagecolor, activeColorb: !chagecolor }"
        ></i>
        <input
          class="aa"
          type="text"
          v-model="user.username"
          name="username"
          placeholder="用户名"
          v-on:focus="chagecolor = false"
          v-on:blur="chagecolor = true"
        />
      </div>
      <div class="pass_word">
        <i
          class="iconfont"
          v-bind:class="{
            writeColor2: chagecolorpass,
            activeColorb: !chagecolorpass
          }"
          >&#xe7c6;</i
        >
        <input
          type="password"
          v-model="user.password"
          name="password"
          placeholder="密码"
          v-on:focus="chagecolorpass = false"
          v-on:blur="chagecolorpass = true"
        />
      </div>
      <div class="yanzm">
        <i
          class="iconfont"
          v-bind:class="{
            writeColor2: chagecolorcode,
            activeColorb: !chagecolorcode
          }"
          >&#xe611;</i
        >
        <input
          type="text"
          v-model="inputCode"
          placeholder="验证码"
          class="v_code"
          v-on:focus="chagecolorcode = false"
          v-on:blur="chagecolorcode = true"
        />
        <input
          type="text"
          @click="createCode()"
          readonly
          v-model="vcode"
          class="unchanged"
          oncopy="return false"
        />
      </div>
      <div class="confirm_button">
        <button
          type="button"
          class="btn_main_cs"
          v-bind:disabled="isDisabled"
          @click="tologin()"
        >
          {{ loginName }}
        </button>
      </div>
    </div>
    <div id="particles-js"></div>
  </div>
</template>

<script>
import particlesJS from "../common/particles";
import { listSearchMixin } from "../../mixin"; //混淆请求
import { api } from "../../api/api"; //api配置请求的路径
import qs from "qs";

export default {
  name: "loginPage",
  mixins: [listSearchMixin],
  data() {
    return {
      isDisabled: false,
      loginName: "登录",
      codeAutofocus: false,
      chagecolor: true,
      chagecolorpass: true,
      chagecolorcode: true,
      user: {
        username: "",
        password: ""
      },
      vcode: "",
      inputCode: ""
    };
  },
  mounted() {
    this.initBackground();
    document.onkeyup = event => {
      if (event.keyCode === 13 && this.$route.name === "loginPage") {
        this.tologin();
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.createCode();
    });
  },
  methods: {
    async tologin() {
      this.isDisabled = true;
      this.loginName = "登录中...";
      if (
        this.user.username == null ||
        this.user.username == "" ||
        this.user.password == null ||
        this.user.password == ""
      ) {
        this.$message.error("账号或者密码不能为空！");
        this.createCode();
        this.isDisabled = false;
        this.loginName = "登录";
        return;
      }
      if (!this.validVcode()) {
        this.$message.error("验证码错误！");
        this.createCode();
        this.isDisabled = false;
        this.loginName = "登录";
        return;
      }
      try {
        let self = this;
        let obj = {
          userId: this.user.username,
          password: this.user.password
        };
        let param = {
          url: api.login, //获取request_url.js文件的请求路径
          data: qs.stringify(obj),
          contentType: "application/x-www-form-urlencoded"
        };
        self.sendReq(param, res => {
          // console.log("---------登陆-----------");
          // console.log(res);
          if (res.respHeader.resultCode == 0) {
            //登陆成功
            var headers = {
              userId: res.respBody.data.userId,
              userName: res.respBody.data.userName,
              userOrgid: res.respBody.data.userOrgid,
              menuList: JSON.stringify(res.respBody.data.menuList),
              buttonList: JSON.stringify(res.respBody.data.buttonList)
            };
            sessionStorage.setItem("headers", JSON.stringify(headers));
            sessionStorage.setItem("logined", true);
            let referrer = this.$router.currentRoute.query.referrer;
            console.log(referrer);
            if (referrer) {
              // this.$router.push(referrer);
              this.$router.push({ path: referrer });
            } else {
              this.$router.push("/");
            }
          } else {
            this.$message.error(res.respHeader.message);
            this.createCode();
          }
          this.isDisabled = false;
          this.loginName = "登录";
        });
      } catch (e) {
        // console.error(e);
        this.isDisabled = false;
        this.loginName = "登录";
        this.$message.error(e.message);
      }
    },
    initBackground() {
      particlesJS("particles-js", {
        particles: {
          color: "#fff",
          shape: "circle", // "circle", "edge" or "triangle"
          opacity: 1,
          size: 4,
          size_random: true,
          nb: 250, //150,
          line_linked: {
            enable_auto: true,
            distance: 100,
            color: "#fff",
            opacity: 1,
            width: 1,
            condensed_mode: {
              enable: false,
              rotateX: 600,
              rotateY: 600
            }
          },
          anim: {
            enable: true,
            speed: 1
          }
        },
        interactivity: {
          enable: true,
          mouse: {
            distance: 300
          },
          detect_on: "canvas", // "canvas" or "window"
          mode: "grab",
          line_linked: {
            opacity: 0.5
          },
          events: {
            onclick: {
              enable: true,
              mode: "push", // "push" or "remove"
              nb: 4
            }
          }
        },
        retina_detect: true
      });
    },
    createCode() {
      let codeLength = 4; //验证码的长度
      let vcode = "";
      let selectChar = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ]; //所有候选组成验证码的字符，当然也可以用中文的
      for (let i = 0; i < codeLength; i++) {
        let charIndex = Math.floor(Math.random() * 36);
        vcode += selectChar[charIndex];
      }
      this.vcode = vcode;
      this.inputCode = "";
    },
    validVcode() {
      return (
        this.vcode && this.inputCode.toUpperCase() === this.vcode.toUpperCase()
      );
    }
  }
};
</script>
<style scoped>
/* 登录页面开始 */
@import "../../assets/theme/login.css";
</style>
