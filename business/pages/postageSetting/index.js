const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainTab: 'homepage',
        user_info: {},
        news: [],
        loading: true,
        tpl_list: []
    },
    // 添加运费模板
    addPostageTpl(e) {

    },
    // 修改运费模板
    editPostageTpl(e) {
        console.log(e);
    },
    // 删除运费模板
    deletePostageTpl(e) {
        console.log(e);
    },
    getList() {
        util.wx.get('/api/supplier/get_freight_tpl')
            .then(res => {
                if (res.data.code == 0) {
                    this.setData({
                        tpl_list: res.data.data
                    })
                }
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userInfo')
        wx.setStorageSync('postage', '');
        this.getList();
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