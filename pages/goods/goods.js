//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        imgUrls: [
            'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
            'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
            'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640'
        ],
        goods: {},
        code:false
    },
    onLoad: function(option) {
        wx.request({
            url: 'https://www.daohangwa.com/api//goods/get_goods_info',
            data: {
                goods_id: option.goods_id
            },
            success: (res) => {
                if (res.data.code == 0) {
                  console.log(res.data.data.goods)
                    this.setData({
                        goods: res.data.data.goods
                    })
                }
            }
        })
    },
    codeHide(){
      this.setData({
          code:false
      })
    },
    codeShow(){
      this.setData({
          code:true
      })
    },
    homepage() {
        wx.navigateTo({
            url: '../home/index'
        })
    },
    userpage() {
        console.log('userpage')
        wx.navigateTo({
            url: '../ucenter/ucenter'
        })
    },
    buy() {
        wx.navigateTo({
            url: '../order/index'
        })
    }
})