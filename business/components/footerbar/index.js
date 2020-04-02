Component({
  externalClasses: ['custom-class'],
  properties: {
    active: {
      type: Number,
      //wait、process、finish、error
      value: 0
    }
  },
  options: {},
  relations: {

  },
  data: {
    is_recommend: 1,
    expires: '',
    urls: [

    ]
  },
  lifetimes: {
    attached: function () {

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  methods: {

    goActing() {
      wx.redirectTo({
        url: '../../pages/acting-admin/index'
      })
    },
    goMy() {
      wx.redirectTo({
        url: '../../pages/setting-list/index'
      })

    },

    goOrder() {
      wx.redirectTo({
        url: '../../pages/order-manage/index'
      })

    },
    goHome() {

      wx.redirectTo({
        url: '../../pages/home/index'
      })
    },

    onChange(event) {
      // event.detail 的值为当前选中项的索引
      this.setData({
        active: event.detail
      });
    }
  },
  ready() {}
})