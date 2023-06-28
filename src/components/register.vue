<template>
  <div class="register-page" v-loading="loading" element-loading-text="Loading...">
    <el-card class="box-card">
      <div class="title">
        <div class="svg-wrapper">
          <svg height="60" width="320" xmlns="http://www.w3.org/2000/svg">
            <rect class="shape" height="60" width="320"></rect>
          </svg>
          <div class="title-text">小黑子论坛</div>
        </div>
      </div>
      <div class="register-form">
        <el-form ref="ruleForm" :model="ruleForm" :rules="registerRules">
          <el-form-item prop="userName">
            <el-input v-model="ruleForm.userName" auto-complete="off" maxlength="20" placeholder="请输入用户名"
              prefix-icon="User" type="text">
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="ruleForm.passWord" auto-complete="off" maxlength="20" placeholder="请输入密码"
              prefix-icon="Lock" show-password type="password">
            </el-input>
          </el-form-item>
          <el-form-item prop="VerifyPassword">
            <el-input v-model="ruleForm.VerifyPassword" auto-complete="off" maxlength="20" placeholder="请再次输入密码"
              prefix-icon="Lock" show-password type="password">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" style="width:100%;" type="primary" @click="handleRegister">注册</el-button>
          </el-form-item>
          <div class="login" @click="handleToLogin()">还没有帐号？立即注册</div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Register } from "@/api/account";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "register",
  data: function () {
    var checkVerifyPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.passWord) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    };
    return {
      loading: false,
      ruleForm: {
        userName: '',
        passWord: '',
        VerifyPassword: ''
      },
      registerRules: {
        userName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        VerifyPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkVerifyPassword, trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const user = {
            username: this.ruleForm.userName,
            password: this.ruleForm.passWord
          }
          Register(user).then(res => {
            console.log("111", res)
            if (res === 'ERR_NETWORK') {
              this.$message({
                showClose: true,
                message: "服务器拒绝服务，请检查服务器是否启动或崩溃",
                type: "error"
              })
              this.loading = false
            }
            else if (res === 'ECONNABORTED') {
              this.loading = false
              this.$message({
                showClose: true,
                message: "连接服务器出错，请检查网络",
                type: "error"
              })
            }
            else {
              if (res.meta.status === 200) {
                this.$message({
                  message: "注册成功，正在跳转到登录界面...",
                  type: "success"
                })
                setTimeout(() => {
                  this.$router.push('/')
                }, 2000)
                this.loading = false
              } else {
                this.$message({
                  message: res.meta.msg,
                  type: "error"
                })
                this.loading = false
              }
            }
          }).catch(error => {
            console.log(error)
          })
        }
        else {
          this.$message(
            {
              message: "输入有误",
              type: "warning"
            }
          )
        }
      })
    },
    handleToLogin() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.register-page {
  background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);
  /*background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);*/
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-card {
  width: 375px;
}

.title {
  height: 80px;
}

.svg-wrapper {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  width: 320px;
}

.shape {
  stroke-dasharray: 140 540;
  stroke-dashoffset: -474;
  stroke-width: 8px;
  fill: transparent;
  stroke: #19f6e8;
  border-bottom: 5px solid black;
  transition: stroke-width 1s, stroke-dashoffset 1s, stroke-dasharray 1s;
}

.title-text {
  top: -40px;
  position: relative;
  font-size: 30px;
  line-height: 32px;
  letter-spacing: 10px;
  text-align: center;
}

.svg-wrapper:hover .shape {
  stroke-width: 2px;
  stroke-dashoffset: 0;
  stroke-dasharray: 760;
}

.login {
  float: right;
  font-size: 14px;
  color: darkgrey;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
