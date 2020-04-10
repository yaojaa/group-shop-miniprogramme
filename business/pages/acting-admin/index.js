const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Notify from '../../../vant/notify/notify'
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: '',
        user_info: {},
        news: [],
        loading: true,
        list: [],
        showShareFriendsCard: false,
        posterImg: '',
        poster: false,
        cpage: 1
    },
    handleChange({
        detail
    }) {
        this.setData({
            mainTab: detail.key
        })
    },
    getDetail() {
        util.wx.get('/api/supplier/get_agent_list', {
                cpage: this.data.cpage,
                pagesize: 20
            })
            .then(res => {
                const d = res.data.data
                this.setData({
                    list: this.data.list.concat(d.agentlist),
                    total: d.page.total,
                    cpage: d.page.cpage,
                    totalpage: d.page.totalpage

                })
            })
    },

    openShareFriends() {

        this.setData({
            showShareFriendsCard: true
        })

    },
    closeShareFriends() {
        this.setData({
            showShareFriendsCard: false
        })
    },

    handlePoster() {

        this.setData({
            poster: true
        })

        this.getPoster()

    },

    hidePoster() {

        this.setData({
            poster: false,
            showShareFriendsCard: false

        })

    },

    saveImg() {
        wx.downloadFile({
            url: this.data.posterImg,
            success: function (res) {
                let path = res.tempFilePath

                wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success(result) {
                        wx.showToast({
                            title: "保存成功",
                            icon: "none"
                        })
                    },
                    fail: function (err) {
                        console.log(err)
                    }

                });

            }
        })
    },

    savaSelfImages() {

        console.log('保存图片')
        if (this.data.posterImg) {
            console.log('this.data.posterImg', this.data.posterImg)
            wx.getSetting({
                success: (res) => {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success: () => {
                                this.saveImg()
                            }
                        })
                    } else {
                        console.log('有权限')

                        this.saveImg()


                    }
                }
            })

        }
    },

    audit(e) {

        const {
            agent_status,
            agent_user,
            supplier_agent_id
        } = e.currentTarget.dataset

        const txt = agent_status == 2 ? '通过' : '拒绝'

        Dialog.confirm({
            title: txt + '申请',
            message: agent_user,
            context: this,
            confirmButtonText: '确定'
        }).then(() => {

            util.wx.post('/api/supplier/audit_agent', {
                    supplier_agent_status: agent_status, //审核状态(0:待审核,1:审核不通过,2:审核通过)
                    supplier_agent_id: supplier_agent_id
                })
                .then(res => {

                    wx.showToast({
                        title: '操作成功',
                        icon: 'none'
                    })

                    this.getDetail()

                })

        }).catch(() => {
            // on cancel
        });







    },

    getPoster(msg) {
        wx.showLoading()
        util.wx.get('/api/supplier/get_invite_qrcode').then(res => {
            
            if(res.data.code == 200){
            this.setData({
                posterImg: res.data.data
            })
        }else{
            wx.showToast({
                title:res.data.msg || '生成失败'
            })
        }

        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let userInfo = wx.getStorageSync('userInfo')
        // this.setData({
        //     userInfo: userInfo
        // })

        this.getDetail()
        //this.getNews()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.hideHomeButton()
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },


    onShareAppMessage: function () {

        this.closeShareFriends()

        const {
            supplier_name,
            supplier_id
        } = app.globalData.userInfo.supplier


        console.log('business/pages/acting-apply/index' + '?supplier_id=' + supplier_id)

        return {
            title: supplier_name + '诚邀您的加入',
            imageUrl: 'https://static.kaixinmatuan.cn/invit.jpg',
            path: 'business/pages/acting-apply/index' + '?supplier_id=' + supplier_id
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        if (this.data.totalpage > this.data.cpage) {
            this.data.cpage++
            this.getDetail()

        }





    }
})