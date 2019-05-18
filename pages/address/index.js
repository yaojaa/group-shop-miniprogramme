const util = require('../../utils/util')
import Notify from '../../vant/notify/notify'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: false,
        source: '',
        address: [],
        selected: '', //选中的
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            source: options.source || false,
            selected: options.id || '',
        })
    },

    setSelected(e) {
        if (!this.data.source) {
            return
        }
        const id = e.currentTarget.dataset.id
        this.setData({
            selected: id
        })
        util.setParentData({
            address_id: id
        })
    },

    remove(e) {
        const address = wx.getStorageSync('userAddress') || {}
        let { id, add } = e.currentTarget.dataset;
        util.wx.post('/api/user/address_del', { "address_id": id }).then(res => {
            if (res.data.code == 200) {
                wx.showToast({
                    title: '删除成功',
                    icon: 'none'
                })
                if (add.address_id == address.address_id) {
                    wx.removeStorageSync('userAddress')
                }
                this.getAddress()
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
    },

    getAddress() {
        util.wx.get('/api/user/address_list')
            .then(res => {
                var data = res.data
                if (data.code == 200) {
                    this.setData({
                        address: data.data.address_list
                    })
                    if (this.data.source && !this.data.address.length > 0) {
                        // wx.navigateBack({
                        //     delta: 1
                        // })
                    }
                    console.log(data.data.address_list)
                }
            })
    },
    addAddress(data) {
        let that = this
        util.wx.post('/api/user/address_add_or_edit', data)
            .then(res => {
                if (res.data.code == 200) {
                    Notify({
                        text: res.data.msg,
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#39b54a'
                    })
                    that.getAddress
                } else {
                    Notify({
                        text: res.data.msg,
                        duration: 1000,
                        selector: '#custom-selector',
                        backgroundColor: '#f00'
                    })
                }
            })
    },
    openAddress() {
        let that = this
        wx.chooseAddress({
            success(res) {
                let sendData = {
                    "consignee": res.userName,
                    "mobile": res.telNumber,
                    "province": res.provinceName,
                    "city": res.cityName,
                    "district": res.countyName,
                    "address": res.detailInfo
                }
                that.addAddress(sendData)
            },
            fail() {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
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
        this.getAddress();
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