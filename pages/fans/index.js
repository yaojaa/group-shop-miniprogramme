const util = require('../../utils/util')

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        pullDownOpt:{
          loading:false,
          pagesize:10,
          cpage:1,
          total:1
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.id = options.id || 56
        this.getDataList()
    },

    getDataList(){
        util.wx.get('/api/index/get_access_record', {
          obj_id: this.id,
          type:'goods_detail'
        }).then(res=>{
          if(res.data.code == 200){
            this.setData({
                'list' : res.data.data.access_list,
                'pullDownOpt.total' : res.data.data.page.totalpage,
                'user_count':res.data.data.user_count
            })
          }
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
     // 下拉刷新
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getDataList()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
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