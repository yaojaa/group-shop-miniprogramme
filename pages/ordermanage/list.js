const app = getApp()

const { $Message } = require('../../iView/base/index');

const util = require('../../utils/util.js')

Page({
    data: {
        tab: 0,
        current: "tab1",
        visible: false,
        goods_name: "",
        eidePriceVisible: false,
        searchContent: "",
        deleteShow: true,
        dataList: [],
        visible1: false,
        visible2: false,
        visible3: false, //取消订单
        visible4_pay: false, //设为支付
        showMsgTips: false, //提醒取货
        note: '', //备注
        loading: false,
        cpage: 1,
        shipping_status: '',
        shipping_0: {},
        shipping_1: {},
        valid_order: {},
        totalpage: 1,
        delivery_method: 0,
        sendAll: false,
        // switchOrderList:false,//折叠展开订单
        actionsConfirm: [{
                name: '取消'
            },
            {
                name: '确认',
                color: '#ed3f14',
                loading: false
            }
        ],

        actionsCancel: [{
                name: '取消'
            },
            {
                name: '确认',
                color: '#ed3f14',
                loading: false
            }
        ],
        shipped_order: 0,
        back_order: 0,
        showPop: false,
        search_order_status:'',
        pop_name_arr: [{
                name: '导出名单'
            },
            {
                name: '群发通知'
            }
        ]
    },

    //打开发送通知
    openMsgTips(e) {

        console.log(e)

        if(e=='all'){

         this.setData({
                    sendAll: true,
                    dis:true
                })



        }else{
           this.data.order_id = e.currentTarget.dataset.id

              this.setData({
                    sendAll: false,
                    dis:false
                })
        }



        this.setData({
            showMsgTips: true
        })
    },
    showPopMenu() {

        this.setData({
            showPop: true
        })

    },
    // 右上角菜单点击
    handleClickItem1(e) {

        const index = e.detail.index

        if (index == 0) {
            this.exportExcel()
        } else if (index == 1) {
            this.openMsgTips('all')

        }

        this.setData({
            showPop:false
        })

    },
    handleCancel1() {
        this.setData({
            showPop: false
        })
    },
    onShow: function() {

        this.getOrderList()

        this.getStatistics()

    },
    onLoad: function(optiton) {

        if (!app.globalData.token) {
            app.globalData.token = wx.getStorageSync('token')
        }

        const localSwichStatus = wx.getStorageSync('switchOrderList')

        this.setData({
            switchOrderList: localSwichStatus
        })





        this.setData({
            goods_id: optiton.id,
            delivery_method: optiton.delivery_method
        })

          wx.setNavigationBarTitle({
              title: '管理订单：'+optiton.goods_name 
            })
    },
    handleTab({ detail }) {
        console.log(detail)
        this.setData({
            tab: detail.key,
            cpage: 1,
            search_order_status: detail.key
        })

        this.getOrderList()
    },

    switchSendAll(e) {

        this.setData({
            sendAll: e.detail.value
        })

    },
    onReady: function(e) {





    },
    modifyAddress(e){
        const order_id = e.currentTarget.dataset.order_id
        wx.navigateTo({
            url:'../modify-address/index?order_id='+order_id
        })
    },
    onChangeOrderSwitch(event) {
        const detail = event.detail;
        this.setData({
            'switchOrderList': detail.value
        })
        wx.setStorageSync('switchOrderList', detail.value)
    },

    /**处理按钮事件***/

    orderActions(e) {
        const opt = e.detail.target.dataset.opt
        const cindex = e.detail.target.dataset.cindex
        const pindex = e.detail.target.dataset.pindex

        const order_id = e.detail.target.dataset.id
        const txt = e.detail.target.dataset.txt
        const avatar = e.detail.target.dataset.avatar
        const user_name = e.detail.target.dataset.user_name


        if (opt == 'toset_send' && this.data.delivery_method == 1) {


            wx.navigateTo({
                url: '../to-send/index?get_user_avatar=' + avatar + '&get_user_name=' + user_name + '&order_id=' + order_id+ '&cindex=' + cindex+ '&pindex=' + pindex
            })
            
            
            return
        }

        wx.showModal({
            title: '确定要' + txt + '吗？',
            success: (res) => {

                if (res.confirm) {
                            wx.showLoading()

                    util.wx.post('/api/seller/set_order_status', {
                            opt,
                            order_id
                        }).then(res => {
                            if (res.data.code == 200) {
                                wx.hideLoading()
                                this.getStatistics()
                                //操作完成之后的回调
                                
                                //当前操作的item
                                const key = 'dataList['+pindex+']['+cindex+']'
                                const currentItem = this.data.dataList[pindex][cindex]
                                      currentItem.removed = true
                                
                                //删除逻辑
                                if (opt == 'toset_del') {


                                    this.setData({
                                        [key]: currentItem
                                    })

                                    wx.showToast({ title: '删除成功' })


                                } else {

                                         this.setData({
                                        [key]: res.data.data
                                    })
                                    wx.showToast({ title: '操作成功' })



                                }


                            } else {
                                wx.showToast({ title: '订单操作失败' })

                            }
                        })
                        .catch(e => {

                        })
                }

            }
        })


    },
    //发货操作




    getStatistics() {

        ///seller/get_order_statistics_by_goods_id
        ///
        util.wx.get('/api/seller/get_order_statistics_by_goods_id', {
            goods_id: this.data.goods_id
        }).then(res => {

            if (res.data.code == 200) {
                this.setData({

                    valid_order: res.data.data.valid_order,
                    shipped_order: res.data.data.shipped_order,
                    back_order: res.data.data.back_order,
                })

            }
        })

        //   wx.request({
        //  url: 'https://www.daohangwa.com/api/seller/get_order_statistics_by_goods_id',
        //  data: { 
        //  goods_id:this.data.goods_id,
        //  token:app.globalData.token      // order_status:[1]
        //  // 0待确认，1已确认，2已收货，3已取消，4已完成，5已作废
        //  },
        //  success:(res) => {

        //    if(res.data.code ==0){

        //      this.setData({
        //          shipping_0:res.data.data.shipping_0,
        //          shipping_1:res.data.data.shipping_1,
        //          valid_order:res.data.data.valid_order
        //      })
        //    }

        //  }
        // }
        // )

    },
    calluser(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.mobile
        })
    },
    /****/

    exportExcel() {
        wx.showToast({ title: '开始为你生成...', icon: 'none' })

        util.wx.get('/api/seller/order_export_by_goods_id', {
            goods_id: this.data.goods_id
        }).then(res => {

            if (res.data.code == 200) {

                wx.setClipboardData({
                    data: res.data.data.filepath,
                    success: function(res) {
                        wx.showToast({ title: '文件地址已复制,去粘贴打开吧！注意不要泄露哦', duration: 5000, icon: 'none' })
                    }
                })
            }


        })

    },



    resetPageNumber(e) {
        this.setData({
            cpage: 1
        })
    },
    getOrderList() {

        this.setData({
            loading: true
        })

        return new Promise((resolve, reject) => {

            util.wx.get('/api/seller/get_order_list', {
                goods_id: this.data.goods_id,
                cpage: this.data.cpage,
                // shipping_status:this.data.shipping_status,
                search_order_status: this.data.search_order_status,
                pagesize: 30
                // 0待确认，1已确认，2已收货，3已取消，4已完成，5已作废
            }).then((res) => {

                var resdata = res.data.data.order_list

                var key = 'dataList[' + (this.data.cpage - 1) + ']'

                this.setData({
                    [key]: resdata,
                    loading: false,
                    totalpage: res.data.data.page.totalpage

                })

                resolve()
            }, (err) => {
                reject(err)
            })



        })

    },
    noteInput(e) {
        let noteContent = this.trim(e.detail.value);
        this.setData({
            note: noteContent
        })

    },
    /***写订单备注**/
    order_remarkSubmit(e) {

        var marke_value = e.detail.value
        var order_id = e.target.dataset.id
        if (marke_value == '' || order_id == '') { return }

        util.wx.post('/api/seller/set_order_seller_remarks', {
            order_id: order_id,
            order_remark: marke_value,
        }).then(res => {

            if (res.data.code == 200) {

                wx.showToast({ title: '备注成功' })

            } else {
                $Message({
                    content: res.data.msg,
                    type: 'error'
                })

            }



        })



    },


    searchInput(e) {
        this.deleteShow = e.detail.value.length > 0 ? false : true;
        this.searchContent = this.trim(e.detail.value);
        this.setData({
            deleteShow: this.deleteShow
        })
    },
    deleteSearchContent() {
        this.searchContent = "";
        this.setData({
            searchContent: this.searchContent,
            deleteShow: true
        })
    },

    openShipping({ target }) {
        this.setData({
            visible2: true,
            order_id: target.dataset.id,
            currentIndex: target.dataset.bindex
        })
    },

    closeShipping() {
        this.setData({
            visible2: false
        })
    },



    openTips() {
        this.setData({
            visible5_tips: true,
            order_id: target.dataset.id || ''
        })
    },

    closeTips({ target }) {
        this.setData({
            showMsgTips: false
        })
    },

    openPay({ target }) {
        this.setData({
            visible4_pay: true,
            order_id: target.dataset.id
        })
    },
    closePay({ target }) {
        this.setData({
            visible4_pay: false
        })
    },

    //提醒取货
    setTips(e) {

        if (this.data.note == '') {

            return wx.showToast({ title: '没有输入内容', icon: 'none' })

        }

        var params ={

        }

        params.note = this.data.note


        if (this.data.sendAll) {

            params.goods_id = this.data.goods_id


        } else {
            delete params.goods_id
            params.order_ids = [this.data.order_id]
        }
            wx.showLoading()


        util.wx.post('/api/seller/send_tmp_msg', params).then(res => {

            wx.hideLoading()

            this.setData({
                visible2: false
            })
            if (res.data.code == 200) {
                wx.showToast({ title: "发送成功！" })
                

            } else {

                wx.showToast({
                    title:res.data.msg,
                    icon:"none"
                })

                
            }

            this.setData({
                    showMsgTips: false
                });

        },res=>{
            console.log(res)
             wx.showToast({
                    title:'出小差儿啦，错误代码：'+res,
                    icon:"none"
                })
             this.setData({
                    showMsgTips: false
                });
         }).catch(e=>{
              wx.showToast({
                    title:e,
                    icon:"none"
                })
              this.setData({
                    showMsgTips: false
                });
         })
    },

    /**群发提醒**/

    sendTipsAll() {

        this.dataList.forEach()



    },


    openConfirm({ target }) {
        console.log(target)
        this.setData({
            visible1: true,
            order_id: target.dataset.id
        })
    },

    openCancel({ target }) {
        this.setData({
            visible3: true,
            order_id: target.dataset.id
        })
    },




    handleChange({ detail }) {
        this.setData({
            current: detail.key
        });
    },

    openAlert({ target }) {
        console.log(target)
        this.setData({
            visible: true,
            alertMsg: `id:${target.dataset.id};type:${target.dataset.type}`
        });
    },

    closeAlert(e) {
        console.log(e)
        this.setData({
            visible: false
        });
    },
    openPriceAlert() {
        this.setData({
            eidePriceVisible: true
        })
    },
    closePriceAlert() {
        this.setData({
            eidePriceVisible: false
        })
    },
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    formSubmit: function(e) {
        this.data.formId = e.detail.formId

        util.formSubmitCollectFormId.call(this, e)

    },
    /**
     * 长按复制
     */
    copy: function(e) {
        console.log(e)
        wx.setClipboardData({
            data: e.target.dataset.text || e.currentTarget.dataset.text,
            success: function(res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'none'
                });
            }
        });
    },

    // 下拉刷新
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.resetPageNumber()
        this.getStatistics()

        this.getOrderList().then(() => {
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



            this.getOrderList().then(() => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    }

})