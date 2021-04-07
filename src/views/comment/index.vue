<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
        >操作按钮</el-button>
      </div>
      <!--
        1.把数据列表绑定给表格的 data
        2.设计表格列
        3.给表格列绑定要渲染的数据字段
      -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        class="table-list"
      >
        <el-table-column
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
        >
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
        >
        </el-table-column>
        <el-table-column
          prop="comment_status"
          label="评论状态"
        >
          <template slot-scope="scope">
            {{scope.row.comment_status ? '正常' : '关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整版分页 -->
       <!--
          绑定页码
          绑定每页大小
          current-page: 指定默认激活的页码，初始肯定是第一页
          page-sizes：控制可选的每页的大小
          page-size：真正的每页大小
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background
      >
      </el-pagination>
      <!-- /完整版分页 -->
    </el-card>
  </div>
</template>
<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'Comment',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 总数据条数
      pageSize: 10,
      page: 2 // 当前激活的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () { },
  methods: {
    handleSizeChange (page) {
      this.loadArticles(page)
    },
    handleCurrentChange (page) {
      // 页码改变，加载指定页码数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      // console.log(article)
      // 请求提交修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)
      })
      // 启用开关
      article.statusDisabled = false
      this.$message({
        type: 'success',
        message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-list {
  margin-bottom: 20px;
}
</style>
