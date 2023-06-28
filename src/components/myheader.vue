<template>
    <el-header class="el-header">
        <div class="wrapper">
            <el-avatar class="logo" :src="logoImg" :size="50"></el-avatar>
            <span class="header-title">小黑子论坛</span>
        </div>
        <div class="userInfo">
            <el-avatar v-if="username === '未登录,请先登录'"> user </el-avatar>
            <el-avatar v-else :src="userIcon" :size="50"></el-avatar>
            <div class="username-text">用户名:{{ username }}</div>
        </div>
        <div class="exit-button">
            <el-button type="danger" round icon="SwitchButton" @click="logout">退出</el-button>
        </div>
    </el-header>
</template>


<script>
import logoImg from '@/assets/img/logo.jpg'
import userIcon from '@/assets/img/userIcon.jpg';
export default {
    name: 'myheader',
    data() {
        return {
            // https://ts3.cn.mm.bing.net/th?id=OIP-C.0M2zkDUGABaYNcg0NICwrwHaHT&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2
            logoImg: logoImg,
            userIcon: userIcon,
        }
    },
    created() {
        let username = sessionStorage.getItem('username')
        this.username = username == null ? "未登录,请先登录" : username
        console.log(this.username)
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/');
        }
    }
};
</script>
 
<style scoped>
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
    margin-left: 580px;
}

.exit-button {
    margin-left: 10px;
    justify-content: right;
}</style>