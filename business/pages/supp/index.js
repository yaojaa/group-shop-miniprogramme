const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasSelect:'0',
        loading: true,
        tpl_list: [],
    },
    // 添加运费模板
    addPostageTpl(e) {

    },
    // 修改运费模板
    editPostageTpl(e) {

        console.log(e)

        const {dataset: {id}} = e.target;

        wx.navigateTo({
            url: '../set-price/index?id='+id
        });
  
    },


    // 删除运费模板
    deletePostageTpl(e) {
        console.log(e);
        const that = this;
        const {dataset: {id}} = e.target;

        Dialog.confirm({
          title: '确定要删除该运费模板吗？',
          message: '删除后不可恢复'
        }).then(() => {
          // on confirm
          console.log('yes')
          util.wx.get('/api/user/del_freight_tpl', {freight_tpl_id:id})
            .then(res => {
                    wx.showToast({
                        title: '删除成功'
                    });
            this.getList()
            })

        }).catch(() => {
          // on cancel
        });


    },
    getList() {
        util.wx.get('/api/user/get_freight_tpl_list')
            .then(res => {
                if (res.data.code === 200) {
                    const lists = res.data.data.lists;
                    this.setData({
                        tpl_list:lists.freight_tpl_info
                    })
                }
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        //是否显示radio 从发布编辑页进入有选择radio
        //。 从管理页进入没有
        //

        if(options.hasSelect){
            this.setData({
                hasSelect:options.hasSelect
            })

             wx.setNavigationBarTitle({
                  title: '请选择运费模板方案' 
                })
        }
    
        this.getList();
    },

    radioChange(e){

        util.setParentData({
            freight_tpl_id:e.detail.value
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
        wx.redirectTo({
            url: '../set-price/index?hasSelect='+this.data.hasSelect
        });
    }
})