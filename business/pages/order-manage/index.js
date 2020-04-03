const app = getApp()

const { $Message } = require('../../../iView/base/index');

const util = require('../../../utils/util.js')

Page({
    data: {
        tab: 3,
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
        search_order_status:''
    },

    sendMsgAll(){

       wx.navigateTo({
            url: '../send-msg/index?id=' + this.data.goods_id + '&name=' + this.data.goods_name
        })

    },

    //打开发送通知
    openMsgTips(e) {

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

    toGoods(){
          wx.navigateTo({
            url:'../goods/goods?goods_id='+this.data.goods_id
           })
    },

   toAddressList(){
          wx.navigateTo({
            url:'../send-list/index?goods_id='+this.data.goods_id
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
        else if (index == 2) {
           wx.navigateTo({
            url:'../send-list/index?goods_id='+this.data.goods_id
           })

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

         wx.hideHomeButton();


       // this.getOrderList()


    },
    onLoad: function(optiton) {


        if (!app.globalData.token) {
            app.globalData.token = wx.getStorageSync('token')
        }

       app.globalData.express = 'supplier'


      


        this.data.goods_id = optiton.goods_id,
            this.data.delivery_method = optiton.delivery_method || 1, 
            this.data.goods_name = optiton.goods_name

          this.getOrderList()


          wx.setNavigationBarTitle({
              title: '管理订单'+ (optiton.goods_name || '') 
          })
    },
    handleTab(e) {

        console.log(e)

        const index = e.detail.index

        this.setData({
            tab: detail.key,
            cpage: 1,
            search_order_status: index
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


    /**处理按钮事件***/

    orderActions(e) {
        console.log(e)
        const opt = e.currentTarget.dataset.opt
        const cindex = e.currentTarget.dataset.cindex
        const pindex = e.currentTarget.dataset.pindex

        const order_id = e.currentTarget.dataset.id
        const txt = e.currentTarget.dataset.txt
        const avatar = e.currentTarget.dataset.avatar
        const user_name = e.currentTarget.dataset.user_name

        // if (opt == 'toset_send' && this.data.delivery_method == 1) {

        //     wx.navigateTo({
        //         url: '../to-send/index?get_user_avatar=' + avatar + '&get_user_name=' + user_name + '&order_id=' + order_id+ '&cindex=' + cindex+ '&pindex=' + pindex
        //     })
            
            
        //     return
        // }

        wx.showModal({
            title: '您要' + txt + '吗？',
            success: (res) => {

                if (res.confirm) {
                    wx.showLoading()

                    util.wx.post('/api/supplier/set_order_status', {
                            opt,
                            order_id
                        }).then(res => {
                             wx.hideLoading()
                            if (res.data.code == 200) {
                                //操作完成之后的回调
                                const currentItemKey = 'dataList['+pindex+']['+cindex+']'
                                //当前操作的item
                                const key = 'dataList['+pindex+']['+cindex+'].supplier_next_handle'
                                const key2 = 'dataList['+pindex+']['+cindex+'].order_status'
                                const key3 = 'dataList['+pindex+']['+cindex+'].order_status_txt'

                    
                                //删除逻辑
                                if (opt == 'toset_del') {

                                    this.data.dataList[pindex][cindex].removed = true

                                    this.setData({
                                        [currentItemKey]:this.data.dataList[pindex][cindex]
                                    },()=>{
                                     wx.showToast({ title: '删除成功',icon:"none" })
                                    })

                                } else {

                                   this.setData({
                                         [key]: res.data.data.supplier_next_handle,
                                         [key2]: res.data.data.order_status,
                                        [key3]: res.data.data.order_status_txt
                                    },()=>{

                                    console.log('111',this.data.dataList[pindex][cindex])


                                     wx.showToast({ title: '操作成功',icon:"none" })

                                    })



                                }


                            } else {
                                wx.showToast({ title: '订单操作失败' })

                            }
                        },()=>{
                             wx.hideLoading()
                        })
                        .catch(e => {

                             wx.hideLoading()

                        })
                }

            }
        })


    },


    calluser(e) {
       
        wx.setClipboardData({
            data: e.target.dataset.mobile,
            success: function(res) {
                wx.showToast({
                    title: '已复制',
                    icon: 'none'
                });
            }
        });
    },
    /****/

    exportExcel() {
        wx.showToast({ title: '开始为你生成...', icon: 'none' })

        util.wx.get('/supplier/get_order_export_by_goods_id', {
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
            util.wx.get('/api/supplier/get_order_list', {
                goods_id: this.data.goods_id || '',
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

        console.log(e)
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

        util.wx.post('/api/supplier/set_order_supplier_remarks', {
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


        util.wx.post('/api/supplier/send_tmp_msg', params).then(res => {

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

    /**
     * 长按复制
     */
    

    copyTxt(e){

      const txt = e.target.dataset.text
        wx.setClipboardData({
            data: txt,
            success: function(res) {
                wx.showToast({
                    title: '已复制',
                    icon: 'none'
                });
            }
        });

    },
    copyMobile(e){

       console.log(e)


        const mobile = e.target.dataset.mobile

         wx.setClipboardData({
            data: mobile,
            success: function(res) {
                wx.showToast({
                    title: '电话已复制',
                    icon: 'none'
                });
            }
        });

    },


    copy: function(e) {
        console.log(e)
        const province = e.target.dataset.province
        const city = e.target.dataset.city
        const district = e.target.dataset.district

        const address = e.target.dataset.address
        const consignee = e.target.dataset.consignee
        const mobile = e.target.dataset.mobile
        const order_detail = e.target.dataset.order_detail

        console.log(order_detail)

        var order_string =''
              order_detail.forEach(item=>{
                order_string+= item.spec_name + ' +'+item.qty+'件\n'
              })

        const txt = consignee+'\n'+mobile+'\n'+province+city+district+address +'\n'+order_string



        wx.setClipboardData({
            data: txt,
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
        this.getOrderList().then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    checkexpress(e) {
        let pi = e.currentTarget.dataset.pi;
        let ci = e.currentTarget.dataset.ci;
        let current = this.data.dataList[pi][ci];
        let data = '';

        data += 'order_sn='+ e.currentTarget.dataset.sn
            + '&user=' + current.consignee
            + '&goods=' + current.order_detail[0].goods_name

        wx.navigateTo({
          url: '/pages/ems-detail/index?' + data
        })


    },
    checkexpressorder(e) {
        let pi = e.currentTarget.dataset.pi;
        let ci = e.currentTarget.dataset.ci;
        let current = this.data.dataList[pi][ci];
        let data = '';

        //将列表的单号信息保存到

        data += 'pi='+ pi +'&ci='+ ci +'&order_id='+ e.currentTarget.dataset.id
            + '&user=' + current.consignee
            + '&sn=' + e.currentTarget.dataset.sn
            + '&goods=' + current.order_detail[0].goods_name

        console.log(data)


        wx.navigateTo({
          url: '/pages/express/index?' + data
        })

    },
    to_refund(e){
          console.log(e)

        const order_refund_id = e.currentTarget.dataset.order_refund_id || null

        const order_id = e.currentTarget.dataset.order_id

        if(order_refund_id){

           wx.navigateTo({
            url:'../refundment-detail-supplier/index?order_id='+order_id+'&id='+order_refund_id
          })

        }
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