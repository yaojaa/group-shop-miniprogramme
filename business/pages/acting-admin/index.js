const util = require('../../../utils/util')

import Dialog from '../../../vant/dialog/dialog';
import Notify from '../../../vant/notify/notify'
const app = getApp()

Page({

            /**
             * 页面的初始数据
             */
            data: {
                mainTab: 'homepage',
                user_info: {},
                news: [],
                loading: true,
                list: '',
                showShareFriendsCard: false,
                posterImg: '',
                poster: false
            },
            handleChange({ detail }) {
                this.setData({
                    mainTab: detail.key
                })
            },
            getDetail() {
                util.wx.get('/api/supplier/get_agent_list')
                    .then(res => {
                        this.setData({
                            list: res.data.data.agentlist
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

            hidePoster(){

                this.setData({
                    poster: false,
                    showShareFriendsCard: false

                })

            },

            saveImg() {
                wx.downloadFile({
                        url: this.data.posterImg,
                        success: function(res) {
                            let path = res.tempFilePath

                            wx.saveImageToPhotosAlbum({
                                filePath: path,
                                success(result) {
                                    wx.showToast({
                                        title: "保存成功",
                                        icon: "none"
                                    })
                                },
                                fail: function(err) {
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

                        const { agent_status, agent_user, supplier_agent_id } = e.currentTarget.dataset

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
                        util.wx.get('/api/supplier/get_invite_qrcode').then(res => {
                            this.setData({
                                posterImg: res.data.data
                            })
                        })
                    },

                    /**
                     * 生命周期函数--监听页面加载
                     */
                    onLoad: function(options) {
                        // let userInfo = wx.getStorageSync('userInfo')
                        // this.setData({
                        //     userInfo: userInfo
                        // })
                        this.userIdentity = app.globalData.userInfo.identity

                        this.getDetail()
                        //this.getNews()
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


                    onShareAppMessage: function() {

                        this.closeShareFriends()

                       
                        return {
                            title: _uid + '诚邀您的加入',
                            imageUrl: 'https://img.daohangwa.com/invit.jpg',
                            path: 'business/pages/acting-apply/index' + '?supplier_id=' + _uid
                        }
                    },

                    /**
                     * 页面上拉触底事件的处理函数
                     */
                    onReachBottom: function() {

                    }
                })