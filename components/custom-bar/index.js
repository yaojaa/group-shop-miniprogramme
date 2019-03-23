// components/custom-bar/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      backColor:{
        type:String,
        value:''

      },
        backImage:{
        type:String,
        value:''

      },
      showIcon:{
        type:Boolean,
        value:false
      },
      backIconSize:{
        type:String,
        value:'26'
      },
      backIconColor:{
        type:String,
        value:'#000'
      },
       title:{
        type:String,
        value:''
      },
      fixed:{
        type:Boolean,
        value:false
      }

    },

    /**
     * 组件的初始数据
     */
    data: {

        statusBarHeight: 0

    },

    /**
     * 组件的方法列表
     */
    methods: {
      goback(){

        console.log('navigateBack')

        wx.navigateBack({
          delta: 1
        })


      }

    },
    lifetimes: {
        attached() {


            if (app.globalData.statusBarHeight) {

                this.setData({
                    statusBarHeight: app.globalData.statusBarHeight
                })

            } else {

                wx.getSystemInfo({
                    success: (res) => {
                        app.globalData.statusBarHeight = res.statusBarHeight
                        this.setData({
                            statusBarHeight: res.statusBarHeight
                        })
                    }
                })

            }





            // 在组件实例进入页面节点树时执行
        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    }
})