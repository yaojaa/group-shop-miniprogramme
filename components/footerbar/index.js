
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
      is_recommend:1,
      expires: '',
        urls: [
           
        ]
    },
    lifetimes: {
      attached: function() {

      },
      detached: function() {
        // 在组件实例被从页面节点树移除时执行
      }
   },
    methods: {

          goOrders() {
          wx.redirectTo({
            url: '../../pages/new-order-list/index'
            })
            },

            goMySupplier() {
                wx.redirectTo({
                    url: '../../pages/supplier-list/index'
                })
            },
            goMy(){
               wx.redirectTo({
                    url: '../../pages/my/index'
                })

            },

            goPublish(){
               wx.navigateTo({
                    url: '../../pages/publish/publish'
                })

            },
            goHome() {

                wx.redirectTo({
                    url: '../../pages/home/index'
                })
            },

     
    },
    ready() {
    }
})