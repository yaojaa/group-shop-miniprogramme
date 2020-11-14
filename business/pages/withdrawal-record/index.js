const util = require('../../../utils/util')

function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length);
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: [],
        loading: false,
        status: ['审核拒绝', '等待审核', '审核通过', '其他'],
        dateModal: false,
        dateText: fmtDate(new Date().getTime()),
        minDate: new Date(2019, 5).getTime(),
        currentDate: new Date().getTime(),
        maxDate: new Date().getTime()
    },
    handleDateModal() {
        this.setData({
            dateModal: !this.data.dateModal
        });
    },
    handleDate(event) {
        this.setData({
            currentDate: event.detail,
            dateText: fmtDate(event.detail),
            dateModal: !this.data.dateModal
        });
        this.getData()
    },
    getData() {
        this.setData({
            loading: true
        })
        util.wx.get('/api/supplier/withdraw_list')
            .then(res => {
                this.setData({
                    loading: false
                })
                    this.setData({
                        info: res.data.data.withdraw_list
                    })
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getData()
        console.log(this.data.currentDate)
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

    }
})