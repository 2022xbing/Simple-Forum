<template>
    <div class="submit-page" v-loading="loading" element-loading-text="Loading...">
        <el-container class="submit-container">
            <!--头部  -->
            <el-header class="el-header">
                <div class="wrapper">
                    <el-avatar class="logo" :src="logoImg" :size="50"></el-avatar>
                    <span class="header-title">小黑子论坛</span>
                </div>
                <div class="userInfo">
                    <el-avatar v-if="this.username == null"> user </el-avatar>
                    <el-avatar v-else :src="userIcon" :size="50"></el-avatar>
                    <div class="username-text" v-if="this.username == null">未登录,请先登录</div>
                    <div class="username-text" v-else>用户名:{{ username }}</div>
                </div>
                <div class="exit-button">
                    <el-button type="danger" round icon="SwitchButton" @click="logout">退出</el-button>
                </div>
            </el-header>
            <!-- 页面主体区  嵌套容器  包裹 Aside与Main -->
            <el-container>
                <!-- 左侧 -->
                <div class="aside-wrapper">
                    <myAside></myAside>
                </div>
                <!-- 主体 -->
                <el-main class="main-page" v-loading="loading" element-loading-text="Loading...">
                    <div class="title">
                        <div class="text-t">标题</div>
                        <div class="title-text">
                            <el-input v-model="titleInput" maxlength="10" placeholder="请输入标题" show-word-limit type="text" />
                        </div>
                    </div>
                    <div class="content">
                        <div class="text-t">内容</div>
                        <div class="mytext-container">
                            <mytext ref="mytextContent"></mytext>
                        </div>
                    </div>
                    <div class="summit-but">
                        <el-button type="primary" @click="handleSubmit">发布</el-button>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import myHeader from "./myheader.vue"
import myAside from './myaside.vue'
import logoImg from '@/assets/img/logo.jpg'
import userIcon from '@/assets/img/userIcon.jpg';
import mytext from './mytext.vue'
import { SubmitPost } from '@/api/post'
export default {
    name: "submit",
    components: {
        myHeader,
        myAside,
        mytext,
    },
    data() {
        return {
            loading: false,
            username: null,
            logoImg: logoImg,
            userIcon: userIcon,
            username: null,
            titleInput: null,
        }
    },
    created() {
        this.onload()
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/');
        },
        onload() {
            this.loading = true
            this.username = sessionStorage.getItem('username')
            this.loading = false
        },
        handleSubmit() {
            if (this.username == null) {
                this.$message({
                    message: "未登录，请先登录再发帖",
                    type: "error"
                })
                this.$router.push('/');
            }
            else {
                let title = this.titleInput
                let contentText = this.$refs.mytextContent.getContent()
                console.log(title)
                console.log(contentText)
                if (title == null || title.length == 0) {
                    this.$message({
                        message: "请输入标题",
                        type: "error"
                    })
                    return
                }
                if (title.length > 10) {
                    this.$message({
                        message: "标题长度不能超过10",
                        type: "error"
                    })
                    return
                }
                if (contentText == null || contentText.length - 1 == 0) {
                    this.$message({
                        message: "请输入内容",
                        type: "error"
                    })
                    return
                }
                if (contentText.length - 1 > 100) {
                    this.$message({
                        message: "内容长度不能超过100",
                        type: "error"
                    })
                    return
                }
                contentText = this.$refs.mytextContent.getHTML()
                this.loading = true
                let time = this.getCurTime()
                const post = {
                    username: this.username,
                    uid: sessionStorage.getItem('uid'),
                    time: time,
                    title: title,
                    content: contentText
                }
                console.log(post)
                SubmitPost(post).then(res => {
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
                                message: "发布成功，正在跳转到主页",
                                type: "success"
                            })
                            setTimeout(() => {
                                this.$router.push('/home')
                            }, 2000)
                            this.loading = false
                        }
                        else {
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
        },
        getCurTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        }
    }
}
</script>
<style scoped>
.submit-page {
    height: 100%;
    width: 100%;
}

.submit-container {
    height: 100%;
    width: 100%;
    /* overflow: hidden; */
}

.main-page {
    height: 100vh;
    width: 100%;
    background-color: #EAEDF1;
}


.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;
    }
}

.header-title {
    margin-left: 10px;
    font-size: 40px;
    letter-spacing: 20px;
}

.username-text {
    margin-left: 10px;
    font-size: larger;
}

.userInfo {
    justify-content: right;
    margin-left: 520px;
}

.exit-button {
    margin-left: 10px;
    justify-content: right;
}

.text-t {
    font-size: 20px;
    font-weight: bolder;
    padding: 10px 0;
}

.summit-but {
    float: right;
    padding: 15px 10px;
}
.mytext-container{
    max-height: 400px;
}
</style>