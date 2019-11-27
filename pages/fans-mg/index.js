const util = require('../../utils/util')
import secen from '../../utils/secen'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        fansNum:0,
        loading: false,
        items: [{
            type: 'sort',
            label: '订单数',
            value: 'order_pay_count',
            groups: ['001'],
        }, {
            type: 'sort',
            label: '支付金额',
            value: 'order_pay_total',
            groups: ['002'],
        }],
        cpage: 1,
        totalpage: 1,
        sortstr: 'order_pay_count,desc'
    },
    onOpen(e) {
        this.setData({ opened: true })
    },
    onClose(e) {
        this.setData({ opened: false })
    },
    onChange(e) {
        const { checkedItems, items } = e.detail
        const params = {}

        //console.log(checkedItems, items)

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'order_pay_count') {
                    params.sort = n.value
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === 'order_pay_total') {
                    params.sort = n.value
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                }
            }
        })
        this.setData({
            sortstr: Object.values(params).toString(),
            cpage:1,
            list:[]
        })
        this.getDataList(this.data.sortstr)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getDataList(this.data.sortstr)
    },

    getDataList(params) {
        this.setData({
            loading: true
        })
        let data = {
            sortstr: params,
            cpage: this.data.cpage,
            pagesize: 15
        }
        return new Promise((resolve, reject) => {
            util.wx.get('/api/seller/get_fans_list', data).then((res) => {
                this.setData({
                    loading: false,
                    list: this.data.list.concat(res.data.data.lists),
                    totalpage: res.data.data.page.totalpage,
                    fansNum: res.data.data.page.total
                })
                resolve(res)
            }, (err) => {
                reject(err)
            })
        })
  
    },

    fTime(t) {
        let h = 0,
            m = 0,
            mm = 0;
        if (t && t > 0) {
            t = Math.ceil(t / 1000);
            h = parseInt(t / 60 / 60);
            m = parseInt(t % 3600 / 60);
            mm = parseInt(t % 60);
        }
        if (h > 0) {
            return h + "小时" + m + "分" + mm + "秒"
        } else if (m > 0) {
            return m + "分" + mm + "秒"
        } else {
            return mm > 0 ? mm + "秒" : "1秒"
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