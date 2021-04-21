const util = require('../../utils/util')
const app = getApp()

function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        date: '',
        dateModal: false,
        minDate: new Date(1950, 1, 1).getTime(),
        currentDate: new Date().getTime(),
        maxDate: new Date().getTime(),
        scopeModal: false,
        type: 0 ,
        
        typeModal: false,
        scopeValue: '',
        scopeTitle: '',
        checked: false
    },
    onChange({ detail }) {
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
    },
    handleDateModal() {
        this.setData({
            dateModal: !this.data.dateModal
        });
    },
    handleDate(event) {
        this.setData({
            currentDate: event.detail,
            date: fmtDate(event.detail),
            dateModal: !this.data.dateModal
        });
        console.log(event)
    },
    showTypeModal(){

          this.setData({
            typeModal: !this.data.typeModal
        });

    },
    handleScopeModal() {
        this.setData({
            scopeModal: !this.data.scopeModal
        });
    },
    changeScope(event) {
        this.setData({
            scopeValue: event.target.dataset.name,
            scopeTitle: event.target.dataset.title,
            scopeModal: false
        });
    },

    changeTpye(event) {
         this.setData({
            type: event.target.dataset.name,
            typeTitle: event.target.title,
            typeModal: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //创建优惠券
    createCoupon(){
        util.wx.post('/api/redpacket')
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
    onShareAppMessage: function() {

    }
})