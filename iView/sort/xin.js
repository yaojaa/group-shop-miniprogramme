Component({
  behaviors: [],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    datas: { // 属性名
      type: Array,
    },
  },
  data: {},

  methods: {
    change(e) {
      console.log(e)
    },
  }

})