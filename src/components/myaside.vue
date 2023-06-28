<template>
  <!-- 侧边栏 -->
  <el-aside width="150px">
    <el-menu :default-active="$route.path" :router="true" class="el-menu-vertical-demo" active-text-color="#ffd04b"
      background-color="#545c64" text-color="#fff" default-active="1">
      <el-menu-item index="/home">
        <el-icon>
          <Menu />
        </el-icon>
        <span class="mune-text">首页</span>
      </el-menu-item>
      <el-menu-item index="/submit">
        <el-icon>
          <Menu />
        </el-icon>
        <span class="mune-text">发帖</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
  <router-view></router-view>
</template>

<script>
export default {
  name: "myaside"
}
</script>

<style scoped>
.mune-text {
  text-align: center;
  font-size: 16px;
}

.el-aside {
  background-color: gray;
  height: 100%;
}
</style>