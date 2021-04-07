<template>
  <div class="home-container">首页</div>
</template>

<script>
export default {
  // 指定name选项的另一个好处是便于调试
  // 有名字的组件有更友好的警告信息
  // 另外，挡在有vue-devtools，未命名组件将显示成 <AnonymousComponent>,
  // 这很没有语义，通过name选项，可以获得更有语义信息的组件树
  // 结论：给一个组件起一个名字是非常有意义的，尽量不要让组件的名字重复
  name: 'HomeIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
    // if()
  },
  mounted () { },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
