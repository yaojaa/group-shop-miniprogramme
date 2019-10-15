const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainTab: 'postageSetting',
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
        const {dataset: {index}} = e.target;
        const currentItem = this.data.tpl_list[+index];

        wx.setStorage({
            key: 'tpl_data',
            data: currentItem,
            success: function(res){
                wx.navigateTo({
                    url: '../set-price/index?type=1'
                });
            }
        });
    },
    // 删除运费模板
    deletePostageTpl(e) {
        console.log(e);
        const that = this;
        const {dataset: {id}} = e.target;
        util.wx.get('/api/supplier/del_freight_tpl', {freight_tpl_id: id})
            .then(res => {
                if (res.data.code === 200) {
                    wx.showToast({
                        title: '删除运费模板成功',
                        icon: 'none'
                    });
                    setTimeout(() => {
                        that.getList()
                    }, 1500)
                }
            })
    },
    getList() {
        util.wx.get('/api/supplier/get_freight_tpl')
            .then(res => {
                if (res.data.code === 200) {
                    const lists = res.data.data.lists;
                    lists.forEach(item => {
                        item.freight_tpl_info_list = JSON.parse(item.freight_tpl_info);
                    });
                    this.setData({
                        tpl_list: lists
                    })
                }
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userInfo')
        wx.setStorageSync('tpl_data', '');
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
        wx.setStorageSync('tpl_data', '');
        this.getList();
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

    addPostageTpl: function() {
        wx.navigateTo({
            url: '../set-price/index?type=0'
        });
    }
})