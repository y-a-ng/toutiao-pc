<!-- 面包屑路径导航 -->
<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div
        slot="header"
        class="clearfix"
      >
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form
        ref="form"
        :model="form"
        label-width="40px"
        size="mini"
        v-loading="loading"
      >
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!--
            el-radio 默认把label作为文本和选中之后的value值
            radio 的文本和 value 值可以分开
           -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select
            v-model="channelId"
            placeholder="请选择频道"
          >
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel,index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--
          button按钮的click事件有个默认参数，当你没有指定参数时，
          它会默认传递一个无效数据
         -->
          <el-button
            type="primary"
            :disabled="loading"
            @click="loadeArticles(1)"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>根据筛选条件共查询到{{totalCount}}条结果</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
    </el-card>
    <!--数据列表-->
    <!--
        tabel表格组件
          1.把需要展示的数组列表数据绑定给 tabel 组件的 data 属性
          注意：不用去v-for遍历，它自己会遍历
          2.设计表格列 el-table-column
          width 可以设定表格列的宽度
          label 可以设定列的标题
          prop 用来设定要渲染的列表项数据字段,只能展示文本
          3.表格列默认只能渲染，如果需要展示其它内容，
          例如放个按钮/图片，就需要自定义
    -->
    <el-table
      :data="articles"
      style="width: 100%"
      stripe
      border
      class="list-tabel"
      v-loading="loading"
    >
      <el-table-column
        prop="date"
        label="封面"
      >
        <template slot-scope="scope">
          <!--
          <img
          v-if="scope.row.cover.images[0]"
          class="article-cover"
          :src="scope.row.cover.images[0]" alt="">
          <img v-else class="article-cover" src="./flower.jpeg" alt="">
        -->
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.cover.images[0]"
            fit="cover"
            lazy
          >
            <div
              slot="placeholder"
              class="image-slot"
            >
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <!--
            下面这种情况是在运行期间动态绑定处理的，
            而本地图片必须在打包的时候就存在
           -->
          <!--
             <img class="article-cover"
             :src="scope.row.cover.images[0]" ||
             './flower.jpeg' alt="">
            -->
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
      > </el-table-column>
      <el-table-column label="状态">
        <!-- 如果需要在自定义列模板中获取当前遍历项数据，
        那么就在template上声明 slot-scope="scope" -->
        <template slot-scope="scope">
          <el-tag type="articleStatus[scope.row.status].type">
            {{ articleStatus[scope.row.status].text }}
          </el-tag>
          <!--
          <el-tag v-else-if="scope.row.status===1">待审核</el-tag>
          <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.status===3" type="danger">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status===4" type="info">删除</el-tag>
          -->
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间"
      > </el-table-column>
      <el-table-column label="操作">
        <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template里面 -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            circle
            icon="el-icon-edit"
            type="primary"
            @click="$router.push('/publish?id=' + scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="onDeleteArticle(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /数据列表 -->
    <!-- 列表分页 -->

    <!--
      total 用来设定总数据的条数
      它默认按照 10 条每页计算总页码
      page=size每页显示条目个数，支持 .sync
      修饰符，默认每页10条
      只要给总数据给它，它就计算出来一共有多少页

      其实计算总页码的方式非常简单，需要两个核心数据：
      - 每页大小
      - 总数据条数
      向上取整(总数据条数/每页大小)
      分页组件中设定的每页数据大小应该和我们请求数据的每页大小保持一致，
      否则页码的计算就会有问题
     -->
    <el-pagination
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="oncurrentChange"
      :page-size="pageSize"
      :disabled="false"
      :current-page.sync="page"
    >
    </el-pagination>
    <!-- /列表分页 -->
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的截图
      rangeDate: [],
      loading: true, // 表格数据加载中 loading
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadeArticles(1)
    this.loadChannels()
  },
  mounted () { },
  methods: {
    loadeArticles (page = 1) {
      // 展示加载中 loading
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中 loading
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    oncurrentChange (page) {
      this.loadeArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      console.log(articleId.toString())
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据列表
          // this.loadArticles(页码)
          this.loadeArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log('onDeleteArticle')
    }
  }
}
</script>
<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-tabel {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  height: 110px;
  background-size: cover;
}
</style>
