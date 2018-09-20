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
        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_goods_list',
            data: {
                token: app.globalData.token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozfQ.DAiIyEJCRNLFeWoeJWSRr7yEVQarmacOirlZ8UsVJxc'
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        goodslist: res.data.data.goodslist
                    })
                }
            }
        })



        

        if(app.globalData.userInfo){

         this.setData({
            userInfo: app.globalData.userInfo
            })


        }else{

            app.userScopeReadyCallback= scopeUser=>{

                if(!scopeUser){
                app.redirectToLogin()
                }
            return

            }

          

        }

           app.userInfoReadyCallback=(userInfo)=>{
            console.log('userInfoReadyCallback')
             this.setData({
            userInfo: userInfo,
           })
        }

       
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