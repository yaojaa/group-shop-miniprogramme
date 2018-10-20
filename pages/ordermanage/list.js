const app = getApp()

const { $Message } = require('../../iView/base/index');


Page({
  data:{
    current: "tab1",
    visible: false,
    alertMsg: "确定执行？",
    eidePriceVisible: false,
    searchContent:"",
    deleteShow: true,
    dataList:[],
    visible1:false,
    visible2:false,
    actionsConfirm: [
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


    let goods_id = optiton.goods_id


      wx.request({
      url: 'https://www.daohangwa.com/api/seller/get_order_list',
      data: { 
      goods_id:goods_id,
      token:app.globalData.token
      },
      success:(res) => {
        this.setData({
          dataList:res.data.data.orderlist
        })
      }
    })

  },
  onReady: function (e) {



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

  openShipping(){
       this.setData({
      visible2:true
    })
  },

  //发货
  toShipping({target}){

    this.setData({
      visible2:true,
      order_id:target.dataset.id
    })

    //  wx.request({
    //     url: 'https://www.daohangwa.com/api/seller/set_order_action',
    //     method:'post',
    //     data: {
    //         token: app.globalData.token,
    //         order_id:target.dataset.id,
    //         action:'confirm'
    //     },
    //     success: (res) => {
    //         if (res.data.code == 0) {
    //             this.setData({
    //                 orders: res.data.data
    //             })
    //         }
    //     }
    // })


  },
  openConfirm({target}){
    this.setData({
      visible1:true,
      order_id:target.dataset.id
    })
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
                    action:'confirm'
                },
                success: (res) => {

                    action[1].loading = false;

                    if (res.data.code == 0) {

                      this.setData({
                          visible1: false,
                          actionsConfirm: action
                        });
                        $Message({
                            content: '订单确认成功',
                            type: 'success'
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
  }


})