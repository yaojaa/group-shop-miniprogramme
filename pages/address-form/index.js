import areaData from '../../utils/area'
import Notify from '../../vant/notify/notify'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        default: false,
        areaModal:false,
        areaList:areaData,
        activeArea:'110101',
        areaValue:''
    },
    addressDefault(event) {
        this.setData({
            default: event.detail
        });

    },
    handleAreaModal() {
        this.setData({
            areaModal: !this.data.areaModal
        });

    },
    handleArea(event) {
      let area = event.detail.detail
      this.setData({
            activeArea: area.code,
            areaValue:area.province+'/'+area.city+'/'+area.county,
            areaModal: !this.data.areaModal
        });
    },
    submit() {
        Notify({
            text: '保存成功',
            duration: 1000,
            selector: '#custom-selector',
            backgroundColor: '#39b54a'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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