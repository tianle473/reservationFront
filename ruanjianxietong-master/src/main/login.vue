<template>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
<div id="main">
  <div id="background">
    <transition mode="out-in">
        <el-card id="login_card">
          <div id="title">
              <el-form-item label="账号密码登录" style="font-weight:bold;"> </el-form-item>
              <!-- <label style="font-weight:bold;width:100px">账号密码登录</label> -->
              <el-form-item label="立即注册" @click="addnew" style="cursor:pointer ;color:blue;"> </el-form-item>
              <!-- <label @click="addnew" style="cursor:pointer ;color:blue;margin-right:90%">立即注册</label> -->
          </div>
          <!-- 注册 -->
          <el-dialog
            title="注册账号"
            v-model="add"
            left
            width="35%"
            :append-to-body="true"
            style="margin-top:3%"
            >
            <el-form
                ref="loginformref"
                :hide-required-asterisk="true"
                :model="ruleForm"
                style="text-align:left;"
            >
                 <el-form-item
                    prop="name"
                    label="用户名"
                    label-width="100px"
                    class="passwordlist"
                    >
                    <el-input
                        @keyup.enter="login"
                        style="width:65%"
                        size='small'
                        v-model="ruleForm.usrUsername"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    prop="name"
                    label="密码"
                    label-width="100px"
                    class="passwordlist"
                    
                    >
                    <el-input
                        @keyup.enter="login"
                        style="width:65%"
                        size='small'
                        v-model="ruleForm.usrPassword"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    prop="name"
                    label="邮箱"
                    label-width="100px"
                    class="passwordlist"
                    >
                    <el-input
                        @keyup.enter="login"
                        style="width:65%"
                        size='small'
                        v-model="ruleForm.usrEmail"
                        
                    ></el-input>
                </el-form-item>

                

            
             </el-form>

             <el-form
                    :hide-required-asterisk="true"
                    style="text-align:left;display:flex;justify-content:space-between;flex-direction:row-reverse"
                >
                        <el-row style="margin-bottim:100px">
                            <el-button @click="register()" size='small' style="width:6rem" type="primary">注册</el-button>
                        </el-row>
            </el-form>
     </el-dialog>



          <div id="form" >
              <el-form  :rules="ruleCustom" :label-width="80" label-width='90%' >
                <el-form-item label=""  >
                    <el-input style="margin-top:15%;margin-left:-25%" v-model="loginform.usrUsername" placeholder="用户名" ></el-input>
                </el-form-item>
                <el-form-item label="" >
                    <el-input type="password" style="margin-left:-25%" v-model="loginform.usrPassword" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="handleSubmit()" style="width:100%;margin-top:20px;margin-left:-25%">登录</el-button>
                </el-form-item>
              </el-form>
          </div>
      </el-card>
    </transition>
      
      
  </div>
</div>
  
</template>

<script >
import qs from 'qs';
export default {
  data() {
     const validatePass = (rule, value, callback) => {
                // if (value === '') {
                //     callback(new Error('请输入用户名'));
                // } else {
                //     if (this.formCustom.passwdCheck !== '') {
                //         // 对第二个密码框单独验证
                //         this.$refs.formCustom.validateField('passwdCheck');
                //     }
                //     callback();
                // }
            };
            const validatePassCheck = (rule, value, callback) => {
                // if (value === '') {
                //     callback(new Error('请输入密码'));
                // } else {
                //     callback();
                // }
            };
           
            
            return {
               loginform:{
                    usrUsername: '',
                    usrPassword: '',

               },
                      
               ruleForm: {
                    usrUsername: '',
                    usrEmail: '',
                    usrPassword:'',
                    usrType:'student',
                    usrNotificationMethod:'email',
                  },
                add:false,
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    age: ''
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                }
            }
  },

  components: {},

  computed: {},

  created() {
    
  },

  mounted() {},

  methods: {
    handleSubmit(){
      console.log(this.loginform)
      // 获取用户名密码、然后发送http请求给后端
      this.$axios({
            method: 'post',
            url: '/api/auth/login',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: this.loginform
          }).then((response) => {
              console.log(response);
              // console.log(response.status);
              
              if(response.data.status == "success") {
                this.$message({
                  message: "登录成功",
                  type: "success",
                  duration: 3000
                });
                window.localStorage.setItem("token",response.data.data.token);
                // window.sessionStorage.setItem("mobile",this.loginform.mobile);
                window.localStorage.setItem("usrId",response.data.data.usrId)
                window.localStorage.setItem("usrType",response.data.data.usrType)
                window.localStorage.setItem("usrUsername",response.data.data.usrUsername)
                console.log(window.localStorage.getItem("usrType"));
                console.log('登陆成功')
                if(window.localStorage.getItem("usrType") === 'admin'){
                  setTimeout("window.location.href='/manager'",1000);
                }
                else if(window.localStorage.getItem("usrType") !== 'admin'){
                  setTimeout("window.location.href='/user'",1000);
                }
               
              }
              else {
                this.$message({
                  message: "登录失败",
                  type: "error",
                  duration: 3000
                });
              }
            })
            .catch(function (error) {
              if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                console.log(error.response);
                console.log(error.response.status);
                console.log('错误');
                alert(error.response)
              } else {
                // Something happened in setting up the request that triggered an Error
                alert(error.response)
              }
                console.log(error.config);
            })
    },
    // 验证码
    certify(){
         this.$http.get("/api/user/smscode?mobile="+this.ruleForm.mobile)
            .then((response) => {
              console.log(response)
            })
            .catch(function (error) {
              if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
            })
    },
    addnew(){
        this.add === true ? this.add=false:this.add=true;
        console.log(this.add)
      },

    register () {
        console.log(this.loginform)
      // 获取用户名密码、然后发送http请求给后端
      this.$axios({
            method: 'post',
            url: '/api/auth/register',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: this.ruleForm
          }).then((response) => {
              console.log(response);
              // console.log(response.status);
              
              if(response.data.status == "success") {
                this.$message({
                  message: "注册成功",
                  type: "success",
                  duration: 3000
                });
                console.log('注册成功，请重新登陆')
                setTimeout("window.location.href='/'",1000);
               
              }
              else {
                this.$message({
                  message: "注册失败",
                  type: "error",
                  duration: 3000
                });
              }
            })
            .catch(function (error) {
              if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                console.log(error.response);
                console.log(error.response.status);
                console.log('错误');
                alert(error.response)
              } else {
                // Something happened in setting up the request that triggered an Error
                alert(error.response)
              }
                console.log(error.config);
            })
    },
  }
}
</script>

<style scoped>
#login_card{
  width: 300px;
  height:300px;
  margin-left:60%;
  margin-top: 220px;
}

#background{
  width: 100%;
  height: 100%;
	background-image: url('../assets/插画底图.jpg');
	background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
	position: absolute; /* 不可缺少 */
	/* overflow: hidden; */
	/* overflow: auto; */
	z-index: -1;
}

#main{
  width: 100%;
  height: 100%;
}

#form{
  margin-left: 0;
  margin-top: 4%;
}


#title{
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content:space-between;
}


    .v-enter,
    .v-leave-to {
      opacity: 0;
      transform: translateX(150px);
    }

    .v-enter-active,
    .v-leave-active {
      transition: all 0.5s ease;
    }

</style>