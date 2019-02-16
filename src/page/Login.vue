<template>
  <div>
    <base-header></base-header>
    <hr/>
    <!--<div>-->
      <!--用户名:<input type="text" v-model="loginInfoVo.username" placeholder="请输入用户名"/>-->
      <!--<br/>-->
      <!--密码：<input type="password" v-model="loginInfoVo.password" placeholder="请输入密码"/>-->
      <!--<br/>-->
      <!--<button v-on:click="login">登录</button>-->
      <!--<br/>-->
      <!--登录验证情况：<textarea cols="30" rows="10" v-model="responseResult"></textarea>-->
    <!--</div>-->
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginInfoVo.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="loginInfoVo.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
    <hr/>
    <base-footer></base-footer>
  </div>
</template>

<script>
  import baseHeader from '@/components/common/BaseHeader.vue'
  import baseFooter from '../components/common/BaseFooter'
  import qs from 'qs';
  export default {
    name: "Login",
    components: {
      baseFooter, baseHeader
    },
    data() {
      return {
        loginInfoVo: {"username": '', "password": ''},
        responseResult: []
      }
    },
    methods: {
      login() {
        var postDate = qs.stringify(
           {
             "username": this.loginInfoVo.username,
             "password": this.loginInfoVo.password
           }
        );
        // this.$axios.post('/login', postDate).then(successResponse => {
        //     console.log(successResponse)
        //     // this.responseResult = JSON.stringify(successResponse.data)
        //     if (successResponse.data.status == 1) {
        //       this.$router.replace({path: '/index'})
        //     }else{
        //       alert("用户名或密码错误");
        //     }
        //   })
        //   .catch(failResponse => {
        //   });
        //绕过登录
        sessionStorage.setItem('username', "admin");
        this.$router.push({ path: '/table' });
      }
    }
  }
</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  }
</style>
