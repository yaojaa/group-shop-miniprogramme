const util = require('../../utils/util')

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
        info: '',
        loading: false,
        dateModal: false,
        dateText: fmtDate(new Date().getTime()),
        minDate: new Date(2018, 1).getTime(),
        currentDate: new Date().getTime(),
        maxDate: new Date().getTime(),
        activeNames: [0]
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
        util.wx.get('/api/seller/income_records', { ymonth: fmtDate(this.data.currentDate) })
            .then(res => {
                this.setData({
                    loading: false
                })
                if (res.data.code == 200) {
                    this.setData({
                        info: res.data.data.datas
                    })
                }
            })
    },
    onChangeItem(event) {
        this.setData({
            activeNames: event.detail
        });
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