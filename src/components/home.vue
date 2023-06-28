<template>
    <div class="home-page" v-loading="loading" element-loading-text="Loading...">
        <el-container class="home-container">
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
                    <div class="post-title div-row">帖子列表</div>
                    <div class="del-but div-row">
                        <el-button type="primary" icon="Remove" class="hidden" @click="handleHidden">隐藏</el-button>
                        <el-button type="danger" icon="Delete" class="delete" @click="handleDelete">删除</el-button>
                    </div>
                    <!-- <el-scrollbar height="500px"> -->
                    <!-- <post v-for="post in curList" :key="post.id" :post="post"></post> -->
                    <div class="post-table">
                        <el-table ref="multipleTableRef" :data="curList" style="width: 100%" stripe
                            @sort-change="sortChange" :row-key="getRowKeys">
                            <el-table-column type="selection" width="55" :reserve-selection="true" />
                            <el-table-column label="标题" width="120" show-overflow-tooltip>
                                <template #default="scope">
                                    <div style="font-weight: bolder;">
                                        <div class="table-title" @click="handleCheckDetail(scope.row.id)">{{
                                            scope.row.title }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column property="username" label="发帖用户" width="120" />
                            <el-table-column property="time" label="发帖时间" show-overflow-tooltip sortable="custom" />
                        </el-table>
                    </div>
                    <div class="pagination-block">
                        <el-pagination v-model:current-page="curPage" v-model:page-size="pageSize"
                            :page-sizes="[5, 10, 20, 50]" :background="true"
                            layout="total, sizes, prev, pager, next, jumper" :total="totalnum"
                            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </div>
                    <!-- </el-scrollbar> -->
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import myHeader from "./myheader.vue"
import myAside from './myaside.vue'
import post from "./post.vue";
import logoImg from '@/assets/img/logo.jpg'
import userIcon from '@/assets/img/userIcon.jpg';
import { GetPostList, BatchDelete } from '@/api/post'
export default {
    name: "home",
    components: {
        myHeader,
        myAside,
        post,
    },
    data() {
        return {
            // https://ts3.cn.mm.bing.net/th?id=OIP-C.0M2zkDUGABaYNcg0NICwrwHaHT&w=251&h=248&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2
            logoImg: logoImg,
            userIcon: userIcon,
            username: null,
            allList: [],
            totalnum: 0,
            curList: [],
            pageSize: 10,
            curPage: 1,
            loading: false,
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

        getCurList() {
            this.curList = this.allList.filter((item, index) =>
                index < this.curPage * this.pageSize && index >= this.pageSize * (this.curPage - 1)
            )
        },

        filterlist(postlist) {
            let hiddenlist = sessionStorage.getItem("hiddenlist")
            console.log("hiddenlist2", hiddenlist)
            if (hiddenlist == null) return postlist
            hiddenlist = JSON.parse(hiddenlist)
            console.log("hiddenlist3", hiddenlist)
            let allList = postlist.filter(post => {
                return !hiddenlist.includes(post.id)
            })
            return allList
        },

        handleSizeChange(size) {
            this.pageSize = size;
            this.getCurList();
        },

        handleCurrentChange(page) {
            this.curPage = page;
            this.getCurList();
        },

        async onload() {
            this.loading = true
            this.username = sessionStorage.getItem('username')
            if(this.$route.query.pageSize != undefined) this.pageSize = Number(this.$route.query.pageSize)
            if(this.$route.query.curPage != undefined) this.curPage = Number(this.$route.query.curPage)
            let flag = true
            await GetPostList().then(res => {
                if (res === 'ERR_NETWORK') {
                    this.$message({
                        showClose: true,
                        message: "服务器拒绝服务，请检查服务器是否启动或崩溃",
                        type: "error"
                    })
                    flag = false
                    return
                }
                else if (res === 'ECONNABORTED') {
                    this.loading = false
                    this.$message({
                        showClose: true,
                        message: "连接服务器出错，请检查网络",
                        type: "error"
                    })
                }
                if (res.meta.status !== 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: "error"
                    })
                    flag = false
                    return
                }
                let postlist = res.data
                console.log("postlist", postlist)
                sessionStorage.setItem('postList', JSON.stringify(postlist))
                this.allList = this.filterlist(postlist)
                this.allList.sort((a, b) => {
                    return this.strToDate(b.time) - this.strToDate(a.time)
                })
                // console.log("allList1", this.allList)
                this.totalnum = this.allList.length
                // console.log("totalnum1", this.totalnum)
            }).catch(error => {
                console.log(error)
                flag = false
            })
            // console.log("allList2", this.allList)
            // console.log("totalnum2", this.totalnum)

            if (flag == true) this.getCurList()
            // console.log("curList", this.curList)
            this.loading = false
        },

        handleCheckDetail(id) {
            console.log("id", id)
            this.$router.push({
                name: 'postdetail',
                query: {
                    id: id,
                    page: this.curPage,
                    size: this.pageSize
                }
            });
        },

        getRowKeys(row) {
            return row.id
        },

        getChooseIdList() {
            let chooses = this.$refs.multipleTableRef.getSelectionRows()
            let chooseIdList = new Array()
            chooses.forEach(row => {
                chooseIdList.push(row.id)
            });
            return chooseIdList
        },

        handleHidden() {
            let ChooseIdList = this.getChooseIdList()
            if (ChooseIdList == null || ChooseIdList.length == 0) {
                this.$message({
                    message: "未选择，请先选择",
                    type: "warning"
                })
                return
            }
            let hiddenlist = sessionStorage.getItem("hiddenlist")
            let hiddenset = new Set()
            if (hiddenlist != null) {
                let oldlist = JSON.parse(hiddenlist)
                oldlist.forEach(id => {
                    hiddenset.add(id)
                });
            }
            ChooseIdList.forEach(id => {
                hiddenset.add(id)
            });
            let newhiddenlist = Array.from(hiddenset)
            sessionStorage.setItem("hiddenlist", JSON.stringify(newhiddenlist))
            this.$refs.multipleTableRef.clearSelection();
            this.onload()
        },
        handleDelete() {
            let ChooseIdList = this.getChooseIdList()
            if (ChooseIdList == null || ChooseIdList.length == 0) {
                this.$message({
                    message: "未选择，请先选择",
                    type: "warning"
                })
                return
            }
            const data = {
                ids: ChooseIdList
            }
            this.loading = true
            BatchDelete(data).then((res) => {
                console.log("111", res)
                if (res === 'ERR_NETWORK') {
                    this.loading = false
                    this.$message({
                        showClose: true,
                        message: "服务器拒绝服务，请检查服务器是否启动或崩溃",
                        type: "error"
                    })
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
                            message: "删除成功",
                            type: "success"
                        })
                        this.$refs.multipleTableRef.clearSelection();
                        this.onload()
                    } else {
                        this.$message({
                            message: res.meta.msg,
                            type: "error"
                        })
                        this.$refs.multipleTableRef.clearSelection();
                        this.onload()
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        },
        strToDate(str) {
            let date = new Date(str);
            return date.getTime()
        },
        sortChange(column) {
            let prop = column.prop
            let order = column.order
            console.log("prop", prop)
            console.log("order", order)
            if (prop === 'time') {
                if (order == null || order === 'descending') {
                    this.allList.sort((a, b) => {
                        return this.strToDate(b.time) - this.strToDate(a.time)
                    })
                }
                else {
                    this.allList.sort((a, b) => {
                        return this.strToDate(a.time) - this.strToDate(b.time)
                    })
                }
                this.getCurList()
            }
        }
    }
};
</script>

<style scoped>
.home-container {
    height: 100%;
    width: 100%;
    /* overflow: hidden; */
}


.el-main {
    background-color: #dedfe0;
    height: 100vh;
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


.post-title {
    font-size: 30px;
    font-weight: bolder;
    padding: 10px 0 20px 40px;
}

.pagination-block {
    padding-top: 20px;
    /* justify-content: center; */
    padding-left: 20%;
    left: 20px;
}

.post-table {
    min-height: 500px;
    padding: 10px 0;
}

.table-title {
    font-weight: bolder;
    cursor: pointer;
}

.del-but {
    padding: 10px 0px 10px 65%;
}

.div-row {
    display: inline;
}
</style>