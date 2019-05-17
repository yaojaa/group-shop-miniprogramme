// components/custom-bar/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */

    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        backColor: {
            type: String,
            value: 'transport'
        },

        bottomLayerBackColor: {
            type: String,
            value: ''
        },


        backTitle: {
            type: String,
            value: ''
        },

        back_tit_txt_color: {
            type: String,
            value: ''
        },


        backImage: {
            type: String,
            value: ''

        },
        backUrl: {
            type: String,
            value: ''
        },
        showBackIcon: {
            type: Boolean,
            value: false
        },
        showBackBar: {
            type: Boolean,
            value: false
        },
        backIconSize: {
            type: String,
            value: '28'
        },
        backIconColor: {
            type: String,
            value: '#ffffff'
        },
        title: {
            type: String,
            value: ''
        },
        fixed: {
            type: Boolean,
            value: false
        },

        changeStartHeight: {
            type: Number,
            value: 0
        },

        changeEndHeight: {
            type: Number,
            value: 200
        },
        tit_txt_color: {
            type: String,
            value: '#000000'
        },
        scrollTop: {
            type: Number,
            value: 0,
            observer: function(newVal, oldVal) {
                // 属性值变化时执行
                console.log(newVal, oldVal, this.data.changeEndHeight)

                //向上滚动
                if (newVal < oldVal && newVal < this.data.changeStartHeight) {

                    this.setData({
                        opacity: 0
                    })

                }

                if (newVal >= this.data.changeStartHeight) {

                    var opacity = (newVal / this.data.changeEndHeight).toFixed(2)

                    opacity = opacity > 1 ? 1 : opacity

                    console.log('opacity', opacity)




                    this.setData({
                        opacity: newVal / this.data.changeEndHeight
                    })

                } else {

                    this.setData({
                        opacity: 0
                    })

                }


            }
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

        statusBarHeight: 0,
        opacity: 0

    },


    /**
     * 组件的方法列表
     */
    methods: {
        goback() {

            this.triggerEvent('onBack')

            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1]; //当前页面
            var prevPage = pages[pages.length - 2]; //上一个页面

            if (pages.length >= 2) {

                wx.navigateBack({
                    delta: 1
                })

            } else if (this.data.backUrl) {
                wx.navigateTo({
                    url: this.data.backUrl
                })
            }






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


            console.log('this.scrollTop', this.scrollTop)





            // 在组件实例进入页面节点树时执行
        },

        detached() {
            // 在组件实例被从页面节点树移除时执行
        }
    }
})