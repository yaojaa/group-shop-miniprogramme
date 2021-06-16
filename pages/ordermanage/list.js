const app = getApp()
import config from '../../utils/conf.js'

const {
    $Message
} = require('../../iView/base/index');

const util = require('../../utils/util.js')

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
        importResultShow:false,
        store_id: '',
        showImport:false,
        // switchOrderList:false,//折叠展开订单
        actionsConfirm: [{
            name: '取消'
        }, {
            name: '确认',
            color: '#ed3f14',
            loading: false
        }],

        actionsCancel: [{
            name: '取消'
        }, {
            name: '确认',
            color: '#ed3f14',
            loading: false
        }],
        shipped_order: 0,
        back_order: 0,
        showPop: false,
        search_order_status: 3,
        pop_name_arr: [{
            name: '导出Excel'
        }, {
            name: '群发通知'
        }, {
            name: '发货名单'
        }],
        excelUrl: '',
        searchWords: '',
        orderActionVisbile: false,
        isAllAction: false
    },// 搜索
    onSearch(e){
        var sv = e.detail.replace(/(^\s*)|(\s*$)/g,'');
        console.log(sv)
        if(sv){
            this.setData({
                searchWords: sv,
                dataList: [],
                totalpage: 1,
                cpage: 1
            })

            this.getOrderList()
            this.getStatistics()
        }
    },
    onCancel(){
        this.setData({
            searchWords: '',
            dataList: [],
            totalpage: 1,
            cpage: 1
        })
        this.getOrderList()
        this.getStatistics()

    },

    sendMsgAll() {

        wx.navigateTo({
            url: '../send-msg/index?id=' + this.data.goods_id + '&name=' + this.data.goods_name
        })

    },
    sendMsgSingle(e) {

        const order_id = e.currentTarget.dataset.order_id
        const customer_name = e.currentTarget.dataset.customer_name

        wx.navigateTo({
            url: '../send-msg/index?order_id=' + order_id + '&name=' + this.data.goods_name + '&customer_name=' + customer_name
        })

    },

    //打开发送通知
    openMsgTips(e) {

        if (e == 'all') {

            this.setData({
                sendAll: true,
                dis: true
            })



        } else {
            this.data.order_id = e.currentTarget.dataset.id

            this.setData({
                sendAll: false,
                dis: false
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

    toGoods() {
        wx.navigateTo({
            url: '../goods/goods?goods_id=' + this.data.goods_id
        })
    },

    toAddressList() {
        wx.navigateTo({
            url: '../send-list/index?goods_id=' + this.data.goods_id
        })
    },
    // 右上角菜单点击
    handleClickItem1(e) {

        const index = e.detail.index

        if (index == 0) {
            this.exportExcel()
        } else if (index == 1) {
            this.openMsgTips('all')

        } else if (index == 2) {
            wx.navigateTo({
                url: '../send-list/index?goods_id=' + this.data.goods_id
            })

        }

        this.setData({
            showPop: false
        })

    },
    handleCancel1() {
        this.setData({
            showPop: false
        })
    },
    onShow: function() {

        this.data.cpage = 1



    },
    tkSuccess(){
        console.log('监听到退款成功')

          this.setData({
            tab: -4,
            cpage: 1,
            search_order_status: -4
        })
        this.getOrderList()
                this.getStatistics()

    },
    onLoad: function(optiton) {


        if (!app.globalData.token) {
            app.globalData.token = wx.getStorageSync('userInfo').token
        }

        if (optiton.store_id) {
            this.data.store_id = optiton.store_id
        }

        app.globalData.apiPrix = 'seller'

        this.setData({
            store_id: app.globalData.store_id,
            goods_id: optiton.id || optiton.goods_id,
            delivery_method: optiton.delivery_method,
            goods_name: optiton.goods_name
        })

        this.getOrderList()

        this.getStatistics()

        wx.setNavigationBarTitle({
            title: '管理订单：' + optiton.goods_name
        })

    },
    handleTab({
        detail
    }) {
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
    modifyAddress(e) {
        const order_id = e.currentTarget.dataset.order_id
        wx.navigateTo({
            url: '../modify-address/index?order_id=' + order_id
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
        console.log(e)
        this.opt = e.currentTarget.dataset.opt
        this.cindex = e.currentTarget.dataset.cindex
        this.pindex = e.currentTarget.dataset.pindex

        this.order_id = e.currentTarget.dataset.id
        const txt = e.currentTarget.dataset.txt
        const avatar = e.currentTarget.dataset.avatar
        const user_name = e.currentTarget.dataset.user_name

        // if (opt == 'toset_send' && this.data.delivery_method == 1) {

        //     wx.navigateTo({
        //         url: '../to-send/index?get_user_avatar=' + avatar + '&get_user_name=' + user_name + '&order_id=' + order_id+ '&cindex=' + cindex+ '&pindex=' + pindex
        //     })


        //     return
        // }
        // 
        // 
        this.setData({
            orderActionVisbile:true,
            action_name: txt
        })

    },
    orderActionsRun(){

        //全部发货
         if(this.data.isAllAction) {
            //       api/seller/setorderstatus_by_goodsid
            // 参数：goods_id、opt (toset_confirm、toset_send)
              util.wx.post('/api/seller/setorderstatus_by_goodsid', {
                            opt:this.opt,
                            goods_id: this.data.goods_id
                        }).then(res=>{

                             if (res.data.code == 200) {

                               this.getStatistics()
                               this.getOrderList()
                               wx.showToast({
                                title: '操作成功！',
                                icon : 'none'
                               })

                               this.setData({
                                isAllAction:false
                               })

                             }

                        })
                }
            //单独发货
                else{

                    util.wx.post('/api/seller/set_order_status', {
                            opt:this.opt,
                            order_id:this.order_id
                        }).then(res => {
                            wx.hideLoading()
                            if (res.data.code == 200) {

                                const pindex = this.pindex
                                const cindex = this.cindex

                                this.getStatistics()
                                //操作完成之后的回调
                                const currentItemKey = 'dataList[' + pindex + '][' + cindex + ']'
                                //当前操作的item
                                const key = 'dataList[' + pindex + '][' + cindex + '].seller_next_handle'
                                const key2 = 'dataList[' + pindex + '][' + cindex + '].order_status'
                                const key3 = 'dataList[' + pindex + '][' + cindex + '].order_status_txt'

                                console.log('this.opt',this.opt,this.opt == 'toset_send')


                                if(this.opt == 'toset_send'){

                                    console.log('why???')

                                            let pi = pindex;
                                            let ci = cindex;
                                            let current = this.data.dataList[pi][ci];
                                            let data = '';

                                            console.log(current)



                                            //将列表的单号信息保存到

                                            data += 'pi=' + pi + '&ci=' + ci + '&order_id=' + current.order_id +
                                                '&user=' + current.consignee +
                                                '&sn=' +current.order_sn +
                                                '&goods=' + current.order_detail[0].goods_name


                                           console.log(data)

                                    this.data.dataList[pi][ci].removed = true

                                    this.setData({
                                        [currentItemKey]: this.data.dataList[pi][ci]
                                    })

                                    console.log(this.data.dataList[pi][ci].removed )

                                    console.log(currentItemKey )

                                    if(current.delivery_method == 1){

                                              return      wx.navigateTo({
                                                url: '/pages/express/index?' + data
                                            })

                                    }

                                


                                }

                                console.log('this.opt',this.opt,this.opt == 'toset_send')

                                //删除逻辑
                                if (this.opt == 'toset_del') {

                                    this.data.dataList[pindex][cindex].removed = true

                                    this.setData({
                                        [currentItemKey]: this.data.dataList[pindex][cindex]
                                    }, () => {
                                        wx.showToast({
                                            title: '删除成功',
                                            icon: "none"
                                        })
                                    })

                                } 
                 
                                else {

                                    this.setData({
                                        [key]: res.data.data.seller_next_handle,
                                        [key2]: res.data.data.order_status,
                                        [key3]: res.data.data.order_status_txt
                                    }, () => {


                                        wx.showToast({
                                            title: '操作成功',
                                            icon: "none"
                                        })

                                    })



                                }


                            } else {
                                wx.showToast({
                                    title: '订单操作失败'
                                })

                            }
                        }, () => {

                        })
                        .catch(e => {


                        })


                }

    },
    onisAllActionChange(e){

        console.log(e)
            this.setData({ isAllAction: e.detail });


    },
    toHome(){
        wx.switchTab({
            url:'../home/index'
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
                    refund_order: res.data.data.refund_order,

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
    getExcelUrl(fn) {
        if (this.data.excelUrl) {
            fn(this.data.excelUrl)
            return;
        }
        util.wx.get('/api/seller/order_export_by_goods_id', {
            goods_id: this.data.goods_id
        }).then(res => {

            if (res.data.code == 200) {
                this.data.excelUrl = res.data.data.filepath
                fn(this.data.excelUrl)
            }
        })
    },
    // 导出名单
    exportExcel() {
        // wx.showToast({ title: '开始为你生成...', icon: 'none' })
        // this.getExcelUrl(url => {
        //     this.copyLoadFile(url);
        // })
        wx.navigateTo({
            url: '../updown_exc/index?role=seller&goods_id=' + this.data.goods_id
        })

    },
    // 查看名单
    checkExcel() {
        wx.showLoading({
            title: '加载中...'
        })
        this.getExcelUrl(url => {
            this.downloadfile(url);
        })
    },
    // 复制文件地址
    copyLoadFile(url) {
        wx.setClipboardData({
            data: url,
            success: function(res) {
                wx.showToast({
                    title: '文件地址已复制,去浏览器中粘贴下载吧！注意不要泄露哦',
                    duration: 3000,
                    icon: 'none'
                })
            }
        })
    },

    // 预览文件
    downloadfile(url) {
        //下载文件，生成临时地址
        wx.downloadFile({
            url: url,
            success(res) {
                // 打开文档
                wx.openDocument({
                    filePath: res.tempFilePath,
                    success: function() {
                        wx.hideLoading()
                        wx.removeSavedFile({
                            filePath: res.tempFilePath
                        })
                    }
                });
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

        let ajaxData = {
                goods_id: this.data.goods_id,
                cpage: this.data.cpage,
                transform_store_id: this.data.store_id,
                search_order_status: this.data.search_order_status,
                pagesize: 30
                // 0待确认，1已确认，2已收货，3已取消，4已完成，5已作废
            };

        if(this.data.searchWords){
            ajaxData.keyword = this.data.searchWords
        }

        console.log(ajaxData)

        return new Promise((resolve, reject) => {
            util.wx.get('/api/seller/get_order_list', ajaxData).then((res) => {

                var resdata = res.data.data.order_list
                var key = 'dataList[' + (this.data.cpage - 1) + ']'

                //过滤数据 区分用户角色 是否显示发货按钮等
                resdata.forEach(item => {

                    item.showAction = util.checkIsOrderManege(item.link_store, app.globalData.userInfo.store_id)

                })

                this.setData({
                    [key]: resdata,
                    loading: false,
                    totalpage: res.data.data.page.totalpage
                })

                resolve()
            }, (err) => {

                this.setData({
                    loading: false
                })
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
        if (marke_value == '' || order_id == '') {
            return
        }

        util.wx.post('/api/seller/set_order_seller_remarks', {
            order_id: order_id,
            order_remark: marke_value,
        }).then(res => {

            if (res.data.code == 200) {

                wx.showToast({
                    title: '备注成功'
                })

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

    openShipping({
        target
    }) {
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

    closeTips({
        target
    }) {
        this.setData({
            showMsgTips: false
        })
    },

    openPay({
        target
    }) {
        this.setData({
            visible4_pay: true,
            order_id: target.dataset.id
        })
    },
    closePay({
        target
    }) {
        this.setData({
            visible4_pay: false
        })
    },

    //提醒取货
    setTips(e) {

        if (this.data.note == '') {

            return wx.showToast({
                title: '没有输入内容',
                icon: 'none'
            })

        }

        var params = {

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
                wx.showToast({
                    title: "发送成功！"
                })


            } else {

                wx.showToast({
                    title: res.data.msg,
                    icon: "none"
                })


            }

            this.setData({
                showMsgTips: false
            });

        }, res => {
            console.log(res)
            wx.showToast({
                title: '出小差儿啦，错误代码：' + res,
                icon: "none"
            })
            this.setData({
                showMsgTips: false
            });
        }).catch(e => {
            wx.showToast({
                title: e,
                icon: "none"
            })
            this.setData({
                showMsgTips: false
            });
        })
    },

    openConfirm({
        target
    }) {
        console.log(target)
        this.setData({
            visible1: true,
            order_id: target.dataset.id
        })
    },

    openCancel({
        target
    }) {
        this.setData({
            visible3: true,
            order_id: target.dataset.id
        })
    },



    handleChange({
        detail
    }) {
        this.setData({
            current: detail.key
        });
    },

    openAlert({
        target
    }) {
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


    copyTxt(e) {

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
    copyMobile(e) {

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
        const user_message = e.target.dataset.user_message || ''

        console.log(order_detail)

        var order_string = ''
        order_detail.forEach(item => {
            order_string += item.spec_name + ' 数量：' + item.qty + '件\n'
        })

        const txt = consignee + '\n' + mobile + '\n' + province + city + district + address + user_message + '\n' + order_string



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

    toOrderDetail(e) {

        const order_id = e.currentTarget.dataset.order_id

        wx.navigateTo({
            url: '../order-detail-seller/index?id=' + order_id
        })

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
    checkexpress(e) {
        let pi = e.currentTarget.dataset.pi;
        let ci = e.currentTarget.dataset.ci;
        let current = this.data.dataList[pi][ci];
        let data = '';

        wx.navigateTo({
            url: '/pages/ems-detail/index?order_sn=' + e.currentTarget.dataset.sn
        })


    },
    checkexpressorder(e) {
        let pi = e.currentTarget.dataset.pi;
        let ci = e.currentTarget.dataset.ci;
        let current = this.data.dataList[pi][ci];
        let data = '';

        //将列表的单号信息保存到

        data += 'pi=' + pi + '&ci=' + ci + '&order_id=' + e.currentTarget.dataset.id +
            '&user=' + current.consignee +
            '&sn=' + e.currentTarget.dataset.sn +
            '&goods=' + current.order_detail[0].goods_name

        console.log(data)

        wx.navigateTo({
            url: '/pages/express/index?' + data
        })

    },
    to_refund(e) {
        console.log(e)

        const order_refund_id = e.currentTarget.dataset.order_refund_id || null

        const order_id = e.currentTarget.dataset.order_id

        if (order_refund_id) {

            wx.navigateTo({
                url: '../refundment-detail-seller/index?order_id=' + order_id + '&id=' + order_refund_id
            })

        }
    },
    showImportModal(){
        this.setData({
            showImport: true
        })
    },
    onImportClose(){
         this.setData({
            showImport: false
        })
    },
    importOk(){
        this.onPullDownRefresh()
    },
    chooseFile(){
         wx.chooseMessageFile({
                count:1,
                type:'file', 
                success:(res)=>{
                 this.onImportClose()
                  var fname = res.tempFiles[0].name
                  console.log(res.tempFiles[0])

                  wx.showToast({
                    title:'已选择文件：'+fname,
                    icon:'none'
                  })

                  if (res.tempFiles[0].size < 31457280) {

                        wx.showLoading({
                          title: '导入中...'
                        })

                           wx.uploadFile({
                            url: config.apiUrl + '/api/seller/improt_order_express',
                            filePath: res.tempFiles[0].path,
                            name: 'excel',
                            header: {
                                "Content-Type": "multipart/form-data",
                                "Authorization": app.globalData.token,
                                "store-id"  : app.globalData.store_id || 'null' // 团长0 供应商1 用户为空

                            },
                            success: (res)=> {

                                console.log('上传结果',res)

                                wx.hideLoading()

                                if(res.statusCode == 200){


                                    var res = JSON.parse(res.data)

                                    const {success,error,error_msg} = res.data

                                    if(res.status == false){


                                     wx.showModal({
                                     title: res.msg,
                                     content: '请检查表格文件',
                                     showCancel: false,//是否显示取消按钮
                                     confirmText:"我知道了",//默认是“确定”
                                     confirmColor: 'green',//确定文字的颜色
                                     success: function (res) {}
                                    })


                                    }else{

                                           this.setData({
                                            importResultShow:true,
                                            importResultcontent:`成功导入${success}条,失败${error}条`,
                                            error_msg:error_msg

                                        })

                                  //        wx.showModal({
                                  //    title: '导出结果',
                                  //    content: `成功导入${success}条,失败${error}条`,
                                  //    showCancel: false,//是否显示取消按钮
                                  //    confirmText:"我知道了",//默认是“确定”
                                  //    confirmColor: 'green',//确定文字的颜色
                                  //    success:  (res) =>{
                                  //      this.onPullDownRefresh()
                                  //    },
                                  //    fail: function (res) { },//接口调用失败的回调函数
                                  //    complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
                                  // })



                                    }

                                   


                                }else{

                                     wx.showModal({
                                     title: res.data.msg,
                                     content: '请检查表格文件',
                                     showCancel: false,//是否显示取消按钮
                                     confirmText:"我知道了",//默认是“确定”
                                     confirmColor: 'green',//确定文字的颜色
                                     success: function (res) {}
                                   })

                                }


                            

                            },
                            fail:(e)=>{
                              wx.hideLoading()

                              wx.showToast({
                                title:'上传失败',
                                icon: 'none'
                              })

                                console.log(e)
                            }
                        })



                
                  }else{
                    wx.showToast({
                      title: '你选中的文件超过30M！',
                      icon: 'none'
                    })
                  }
                }
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