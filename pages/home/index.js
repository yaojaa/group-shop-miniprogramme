const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        goodslist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
            console.log('home onLoad',app.globalData.userInfo)

        if(app.globalData.userInfo){

         this.setData({
            userInfo: app.globalData.userInfo
            })

         this.getGoodsList(userInfo.token)


        }else{

        app.userLoginReadyCallback=(userInfo)=>{
            console.log('userLoginReadyCallback',userInfo)
             this.setData({
            userInfo: userInfo
           })
         this.getGoodsList(userInfo.token)
        }


        }




       
    },
    getGoodsList:function(token){
        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_goods_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        goodslist: res.data.data.goodslist
                    })
                }
            }
        })
    },
    new_btn: function() {
        wx.navigateTo({
            url: '../publish/publish'
        })
    },
    fansPage() {
        wx.navigateTo({
            url: '../fans/index'
        })
    },
    editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },
    detailPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + url,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})