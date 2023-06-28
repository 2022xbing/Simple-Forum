<template>
    <div class="postdetail-page">
        <el-container class="postdetail-container">
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
                <el-main class="main-page">
                    <div class="page-header">
                        <el-page-header @back="goBack">
                            <template #content>
                                <span class="page-header-text"> 帖子详情 </span>
                            </template>
                        </el-page-header>
                    </div>
                    <div class="post-detail-page">
                        <el-row :gutter="30" class="row-contain">
                            <el-col :span="6">
                                <div class="user-detail">
                                    <el-card class="box-card card1">
                                        <div class="user-icon">
                                            <el-avatar v-if="this.post == null" :size="100"> user </el-avatar>
                                            <el-avatar v-else :src="userIcon" :size="100"></el-avatar>
                                        </div>
                                        <div class="username">
                                            <div v-if="post == null">未知用户</div>
                                            <div v-else>{{ post.username }}</div>
                                        </div>
                                    </el-card>
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <div class="post-detail">
                                    <el-card class="box-card card2">
                                        <div class="post-title">
                                            <div v-if="post == null">未知标题</div>
                                            <div v-else>标题：{{ post.title }}</div>
                                        </div>
                                        <div class="post-content">
                                            <div v-if="post == null">未知内容</div>
                                            <div v-else v-html="post.content"></div>
                                        </div>
                                        <div class="post-time">
                                            <div v-if="post == null">未知时间</div>
                                            <div v-else>发表于{{ post.time }}</div>
                                        </div>
                                    </el-card>
                                </div>
                            </el-col>
                        </el-row>
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
import { QuillEditor, Quill } from '@vueup/vue-quill'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
    name: "postdetail",
    components: {
        myHeader,
        myAside,
    },
    data() {
        return {
            username: null,
            logoImg: logoImg,
            userIcon: userIcon,
            username: null,
            titleInput: null,
            postId: null,
            post: null,
            countdown: '5',
            timer: null,
            pageSize: 10,
            curPage: 1
        }
    },
    // created() {
    //     this.onload()
    // },
    mounted() {
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
            if (this.$route.query.id != undefined) {
                this.postId = this.$route.query.id
                this.curPage = this.$route.query.page
                this.pageSize = this.$route.query.size
            }
            let obj = sessionStorage.getItem('postList')
            if (obj != null && this.postId != null) {
                let postlist = JSON.parse(obj)
                console.log("postlist", postlist)
                console.log("postId", this.postId)
                this.post = postlist.find((a) => {
                    return a.id == this.postId
                })
            }
            if (this.post == null) {
                this.loading = false
                this.sendCode()
            }
            else {
                console.log(this.post.content)
                this.loading = false
            }
        },
        goBack() {
            this.$router.push({
                path: '/home',
                query: {
                    pageSize: this.pageSize,
                    curPage: this.curPage
                }
            })
        },
        sendCode() {
            this.timeDown()//启动定时器
            this.timer = setInterval(() => {
                //创建定时器
                if (this.countdown === 0) {
                    this.clearTimer();  //关闭定时器
                    this.$router.push('/home');
                } else {
                    this.timeDown();
                }
            }, 1000);
        },
        timeDown() {
            this.$message(
                {
                    showClose: false,
                    message: "请返回帖子列表进入该界面," + this.countdown.toString() + "秒后回到主页",
                    type: "error",
                }
            )
            this.countdown--
        },
        clearTimer() {
            //清除定时器
            clearInterval(this.timer);
            this.timer = 5;
        },
    }
}
</script>
<style scoped>
.postdetail-page {
    height: 100%;
    width: 100%;
}

.postdetail-container {
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

.post-detail-page {
    width: 100%;
}

.user-detail {
    padding: 30px 0;
    text-align: center;
}

.user-icon {
    padding: 30px 0;
}

.username {
    font-size: 30px;
    font-weight: bold;
    padding-top: 10px;
}

.post-detail{
    padding: 30px 0;
}

.card2{
    position: relative;
    min-height: 520px;
}
.post-title{
    padding: 30px 10px 15px 10px;
    font-size: 30px;
    font-weight: bolder;
}

.post-content{
    padding: 15px 10px;
    font-size: large;
}

.post-time{
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: #b1b3b8;
}
.ql-container {
    height: 250px;
    min-height: 192px;
    line-height: normal;
    width: auto;
    background-color: white;
}

span.ql-size {
    max-width: 80px !important;
}


.ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
}


.ql-picker.ql-size .ql-picker-label::before,
.ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}

.ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}

.ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}

.ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-picker.ql-header .ql-picker-label::before,
.ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}

.ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}

.ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}

.ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}

.ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}

.ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}

.ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

.ql-picker.ql-font .ql-picker-label::before,
.ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}

.ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}

.ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
}

.editor_length {
    color: #b1b3b8;
    text-align: right;
}
.ql-size-small {
    font-size: 10px;
}

.ql-size-large {
    font-size: 18px;
}

.ql-size-huge {
    font-size: 32px;
}
</style>