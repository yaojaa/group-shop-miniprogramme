Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'http://www.51pptmoban.com/d/file/2018/05/17/ba0172ce98cc25c03fb2986e55205655.jpg',
            'http://www.wendangwang.com/pic/60ce9ebec47d22cc9b6ab14c/6-810-jpg_6-1080-0-0-1080.jpg',
            'http://www.pptbz.com/d/file/p/201708/5f02717ee482f36516721d482cbbe86b.jpg'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        showIcon: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let pages = getCurrentPages(); //当前页面栈

        if (pages.length > 1) {
            this.setData({
                showIcon: true
            })
            console.log(true)
        } else {
            showIcon: false
            console.log(false)

        }
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