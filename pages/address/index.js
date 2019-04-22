const util = require('../../utils/util')

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
        this.data.address.forEach(item => {
            if (item.address_id == id) {
                wx.setStorage({
                    key: 'userAddress',
                    data: item,
                    success: () => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })

            }
        })
    },

    remove(e) {
        const address = wx.getStorageSync('userAddress') || {}
        let { id, add } = e.currentTarget.dataset;
        util.wx.post('/api/user/address_del', { "address_id":id }).then(res => {
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
                    if (this.data.source && !this.data.address.length>0) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                    console.log(data.data.address_list)
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
        this.getAddress()
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