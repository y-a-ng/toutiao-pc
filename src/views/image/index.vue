<!--  -->
<template>
  <div class="image-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <!--面包屑路径导航-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--/面包屑路径导航-->
      </div>
      <!--按钮-->
      <div class="action-head">
        <el-radio-group
          v-model="collect"
          size="mini"
          @change="loadImages(1)"
        >
          <el-radio-button
            :label="false"
            style="padding-right:15px"
          >全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
        >上传素材</el-button>
      </div>
      <!--/按钮-->
      <!--素材列表-->
      <el-row :gutter="10">
        <el-col
          :lg="4"
          :xs="12"
          :md="6"
          v-for="(img, index) in images"
          :key="index.vue"
          class="image-item"
        >
          <el-image
            style="height: 100px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <!--
            class样式绑定
                {
                  css类名：布尔值
                }
                true:作用类名
                false:不作用类名
           -->
            <el-button
              type="primary"
              :icon="img.is_collected ? 'el-icon-star-on': 'el-icon-star-off'"
              circle
              size="small"
              @click="onCollect(img)"
              :loading="img.loading"
            ></el-button>
            <!--
            <i
              :class="{
          'el-icon-star-on':img.is_collected,
          'el-icon-star-off':!img.is_collected
          }"
              @click="onCollect(img)"
            ></i>
            -->
            <!--  <i class="el-icon-delete"></i> -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="onDelete(img)"
              :loading="img.loading"
            ></el-button>
          </div>
        </el-col>
      </el-row>
      <!--/素材列表-->
      <!-- 数据分页 -->
      <!--
        分页数据改变后，页码不会变
        它需要单独处理高亮的页码
       -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onPageChange"
      >
      </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
      :modal-append-to-body="false"
    >
      <!--
        upload组件本身就支持请求提交上传操作，
        说白了使用它不用自己发请求，它会自己发
        请求方法：默认就是POST
        请求路径：action,必须写完整路径
        请求头：headers
    -->
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div
          class="el-upload__tip"
          slot="tip"
        >只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: 'false', // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总数居条数
      pageSize: 20, // 每页大小
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  methods: {
    loadImages (page, collect = false) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img对象本来没有loading数据
          // 我们这里手动的添加该数据，是用来控制每个按钮的loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // onCollectChange (value) {
    //   this.loadImages(1, value)
    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // 展示loading
      img.loading = true
      // 已收藏，取消收藏
      collectImage(img.id, !img.is_collected).then(res => {
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
      // 没有收藏，点击添加收藏
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;
}
.image-action {
  font-size: 22px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 40px;
  color: rgb(14, 13, 13);
  background-color: rgba(204, 204, 204, 0.3);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
</style>
