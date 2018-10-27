const app = getApp()

const { $Message } = require('../../iView/base/index');

const util = require('../../utils/util.js')

Page({
  data:{
    current: "tab1",
    visible: false,
    goods_name: "",
    eidePriceVisible: false,
    searchContent:"",
    deleteShow: true,
    dataList:[],
    visible1:false,
    visible2:false,
    visible3:false,//取消订单
    visible4_pay:false,//设为支付
    visible5_tips:false, //提醒取货
    note:'',//备注
    actionsConfirm: [
            {
                name: '取消'
            },
            {
                name: '确认',
                color: '#ed3f14',
                loading: false
            }
        ],

    actionsCancel: [
            {
                name: '取消'
            },
            {
                name: '确认',
                color: '#ed3f14',
                loading: false
            }
        ]

  },
  onLoad:function(optiton){

    if(!app.globalData.token){
      app.globalData.token = wx.getStorageSync('token')
      console.log('获取到了token')
    }



     this.setData({
      goods_id :optiton.goods_id,
      goods_name :optiton.goods_name

     })
     this.getOrderList()



  },
  onReady: function (e) {



  },
  calluser(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.mobile
    })
  },
  getOrderList(){

    return new Promise((resolve, reject)=>{

      wx.request({
      url: 'https://www.daohangwa.com/api/seller/get_order_list',
      data: { 
      goods_id:this.data.goods_id,
      token:app.globalData.token
      },
      success:(res) => {
        this.setData({
          dataList:res.data.data.orderlist
        })
        resolve(res.data.data)
      },
      fail:(err)=>{
        reject(err)
      }
    })

    })

  },
  noteInput(e){
    console.log(e)
        let noteContent = this.trim(e.detail.value);
        this.setData({
          note:noteContent
        })

  },
  searchInput(e){
    this.deleteShow = e.detail.value.length > 0 ? false : true;
    this.searchContent = this.trim(e.detail.value);
    this.setData({
      deleteShow: this.deleteShow
    })
  },
  deleteSearchContent(){
    this.searchContent = "";
    this.setData({
      searchContent: this.searchContent,
      deleteShow: true
    })
  },

  openShipping({target}){
       this.setData({
      visible2:true,
      order_id:target.dataset.id
    })
  },

   closeShipping(){
       this.setData({
      visible2:false
     })
  },

  

  openTips({target}){
       this.setData({
      visible5_tips:true,
      note:'亲，您团购的商品到货啦，来取吧',
      order_id:target.dataset.id
    })
  },

  closeTips({target}){
       this.setData({
       visible5_tips:false
          })
  },

  openPay({target}){
       this.setData({
      visible4_pay:true,
      order_id:target.dataset.id
    })
  },
  closePay({target}){
       this.setData({
      visible4_pay:false
          })
  },
  setPay(){

          wx.request({
            url: 'https://www.daohangwa.com/api/seller/set_order_action',
            method:'post',
            data: {
                token: app.globalData.token,
                order_id:this.data.order_id,
                note:this.data.note,
                
                action:'pay'
            },
            success: (res) => {
                   this.setData({
                    visible4_pay:false
                   })
                 if (res.data.code == 0) {

                       this.getOrderList()

                        $Message({
                            content: '设为支付成功',
                            type: 'success'
                        });

                        this.data.note = ''
                        this.toConfirm({index:-1})
                        
                    }else{

                       $Message({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
            }
        })

  },

  // 设为支付
  //   if(pay_status == 0 && order_status == 0){
  //     确认订单接口：/seller/set_order_action
  //     参数：order_id=123 action='pay' note='备注信息'
  //     方式：POST
  // }
  // 
  //提醒取货
  setTips(e){

    if(this.data.note == ''){
      this.data.note = '亲，您团购的商品到货啦，来取吧'
    }

   
            wx.request({
            url: 'https://www.daohangwa.com/api/seller/send_tmp_msg',
            method:'post',
            data: {
                token: app.globalData.token,
                order_id:this.data.order_id,
                note:this.data.note,
                
                type:10
            },
            success: (res) => {
                   this.setData({
                    visible2:false
                   })
                 if (res.data.code == 0) {
                        this.getOrderList()
                        $Message({
                            content: '提醒成功',
                            type: 'success'
                        });
                        this.data.note = ''

                         this.setData({
                          visible5_tips: false
                    });

                    }else{

                       $Message({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
            }
        })

  },


  //发货
  toShipping(e){

    console.log(e)

// 3 发货
//   if(order_status == 1 && shipping_status == 0){
//       发货接口：/seller/delivery_handle
//       参数：
//         order_id       订单id
//         shipping_name  快递名称
//         invoice_no     快递单号
//         note           备注
//       方式：POST
//   }

         wx.request({
            url: 'https://www.daohangwa.com/api/seller/delivery_handle',
            method:'post',
            data: {
                token: app.globalData.token,
                order_id:this.data.order_id,
                note:this.data.note,
                shipping_name:'',
                invoice_no:'',
              

            },
            success: (res) => {
                   this.setData({
                    visible2:false
                   })
                 if (res.data.code == 0) {
                        this.getOrderList()
                        $Message({
                            content: '发货成功',
                            type: 'success'
                        });
                        this.data.note = ''
                    }else{

                       $Message({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
            }
        })


  },
  openConfirm({target}){
    console.log(target)
    this.setData({
      visible1:true,
      order_id:target.dataset.id
    })
  },

  openCancel({target}){
    this.setData({
      visible3:true,
      order_id:target.dataset.id
    })
  },
//取消订单
  toCancel({detail}){

        if (detail.index === 0) {
            this.setData({
                visible3: false
            });
        } else {
            const action = [...this.data.actionsCancel];
            action[1].loading = true;

            this.setData({
                actionsCancel: action
            })

             wx.request({
                url: 'https://www.daohangwa.com/api/seller/set_order_action',
                method:'post',
                data: {
                    token: app.globalData.token,
                    order_id:this.data.order_id,
                    action:'cancel',
                  

                },
                success: (res) => {

                    action[1].loading = false;
                     this.setData({
                          visible3: false,
                          actionsCancel: action
                        })

                    if (res.data.code == 0) {

                        this.getOrderList()

                     
                        $Message({
                            content: '订单已取消',
                            type: 'success'
                        });
                        
                    }else{

                       $Message({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
                }
            })

          }


  },

  toConfirm({ detail }){

      if (detail.index === 0) {
            this.setData({
                visible1: false
            });
        } else {
            const action = [...this.data.actionsConfirm];
            action[1].loading = true;

            this.setData({
                actionsConfirm: action
            })

             wx.request({
                url: 'https://www.daohangwa.com/api/seller/set_order_action',
                method:'post',
                data: {
                    token: app.globalData.token,
                    order_id:this.data.order_id,
                    action:'confirm',
                  
                },
                success: (res) => {


                    action[1].loading = false;

                    if (res.data.code == 0) {

                      this.getOrderList()

                      this.setData({
                          visible1: false,
                          actionsConfirm: action
                        });

                        $Message({
                            content: '订单确认成功',
                            type: 'success'
                        });
                        
                    }else{
                      console.log(res.data.msg)
                        $Message({
                            content: res.data.data.msg,
                            type: 'error'
                        });
                    }
                }
            })

          }

            
  
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  openAlert({target}) {
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
  openPriceAlert(){
    this.setData({
      eidePriceVisible: true
    })
  },
  closePriceAlert(){
    this.setData({
      eidePriceVisible: false
    })
  },
  trim(str){ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
  },
   formSubmit: function (e) {
    this.data.formId = e.detail.formId

    util.formSubmitCollectFormId(e)

   },

    // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    this.getOrderList().then(()=>{
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    })
  }

})