<template>
    <div class="post-card">
        <el-checkbox v-model="checked1" size="large" class="choose-delete" id="post.id" value="post.id" />
        <el-card class="box-card">
            <div class="post-title">{{ post.title }}</div>
            <div class="post-info">
                <div class="post-time">发表时间：{{ post.time }}</div>
                <div class="post-user">发表用户：{{ post.username }}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "post",
    props: {
        post: Object
    },
    computed: {

    },
    methods: {}
}
</script>

<style scoped>
.post-card {
    width: 100%;
    display: flex;
    padding: 5px 10px;
}

.box-card {
    width: 100%;
    /* border-bottom: 3px solid #67C23A; */
    border-top: 3px solid #67C23A;
}

.post-title {
    font-size: 30px;
    font-weight: bolder;
}

.post-time {
    font-size: small;
    color: #b1b3b8;
}

.post-user {
    font-size: small;
    color: #b1b3b8;
}

.choose-delete {
    padding: 10px 10px;
}</style>