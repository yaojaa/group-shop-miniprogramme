const util = require('../../utils/util')


const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab:0,
        data_list: []
    },
    handleTab(e){
        console.log(e)
        this.setData({
            tab:e.detail.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {

        this.getCouponList()
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    toUse(e){
      const id = e.target.dataset.store_id
      wx.navigateTo({
        url:'../userhome/index?id='+id
      })
    },

    getCouponList(){
      wx.showLoading()
        util.wx.get('/api/redpacket/get_user_redpacket_list').then(res=>{
          
          wx.hideLoading()
          if(res.data.code == 200){

            this.setData({
              data_list:res.data.data.list
            })
            console.log(res)
          }
        })
    },
    /*发送红包给指定客户*/
    sendToUser(){
        util.wx.post('/api/redpacket/alloc_redpacket',{
            user_ids:[333,333,333,333],
            redpacket_id:''

        })
        
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
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getDataList(this.data.sortstr).then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.cpage && !this.data.loading) {
            this.setData({
                cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
            })
            if (this.data.cpage > this.data.totalpage) {
                return
            }
            this.getDataList(this.data.sortstr).then(() => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {
      console.log(e)

      const title = e.target.dataset.title
      const id = e.target.id

        return {
          title: title,
          imageUrl: 'https://static.kaixinmatuan.cn/d41d8cd98f00b204e9800998ecf8427e202105251406484983.jpg',
          path:
            '/pages/coupon-receive/index?id=' +id
        };

    }
})