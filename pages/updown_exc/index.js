const util = require('../../utils/util.js');
let data = {};
let flag = true;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: ['2019-10-21','00:00:00'],
    endDate:  ['2019-10-21','23:59:59'],
    goods_id: '',
    timeFlag: 0,  // 0 今天  1 昨天  2 全部  3 自定义
    result: [],
    option1: [
      { text: '待发货', value: 0 },
      { text: '已发货', value: 1 },
    ],
    option2: [
      { text: '按商品选择', value: 0 },
      { text: '全部商品', value: 1 }
    ],
    option3: [
      { text: '未导出', value: 0 },
      { text: '已导出', value: 1 }
    ],
    value1: '0', // 未发货
    value2: '0', // 按商品选择
    value3: '0', // 未导出
    list: [],
    listmore: true,
    show: false

  },
  popShow(){
    this.setData({
      show: true
    })
  },
  onClose(){
    this.setData({
      show: false
    })
  },

  onChange1(event) {
    let val = event.detail;
    this.setData({
      value1: val
    });

    if(val == 1) return

    data = {
      cpage: 1,
      send_status: val,
      export_status: val == 0 ? this.data.value3 : -1
    }

    this.getGoodsOrders(data);
  },

  onChange2(event) {
    let val = event.detail;
    this.setData({
      value2: event.detail,
    });
  },

  onChange3(event) {
    this.setData({
      value3: event.detail
    });

    data = {
      cpage: 1,
      send_status: this.data.value1,
      export_status: this.data.value3
    }
    
    this.getGoodsOrders(data);
  },

  onChange(event) {
    this.setData({
      result: event.detail
    });
    console.log(this.data.result)
  },
  checkorder(e){
    console.log(e)
    const spec_id = e.currentTarget.dataset.id

        wx.navigateTo({
            url:'../spec-order-list/list?spec_id='+spec_id
        })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goods_id = options.goods_id;
    let t = util.formatTime(new Date());
    t = t.split(' ')

    console.log(t)

    this.setData({
      startDate: [t[0], '00:00:00'],
      endDate: t
    })
    data = {
      cpage: 1,
      export_status: 0,
      send_status: 0
    }
    this.getGoodsOrders(data);

  },
  onReachBottom: function(){
    ++ data.cpage;
    this.getGoodsOrders(data)
  },
  // 获取商品订单
  getGoodsOrders(_data){
    // _data.goods_id = this.data.goods_id;
    if(_data.cpage == 1){
      this.data.list = [];
      flag = true;
    }
    if(!flag){
      return;
    }
    wx.showLoading()
    util.wx.get('/api/seller/order_export_show', _data).then( res => {

      if(res.data.code == 200){
        wx.hideLoading()
        if(res.data.data.lists.length == 0){
          flag = false;
        }

        console.log(flag)

        if(res.data.data.lists.length > 0){
          this.setData({
            ['list['+(_data.cpage-1)+']']: res.data.data.lists,
            listmore: true
          })
        }else if(this.data.list.length > 0){
          this.setData({
            listmore: false
          })
        }else{
          this.setData({
            list: this.data.list
          })
        }

        
      }
    })
  },

  // 开始时间
  bindStartDateChange(e){
    let t = e.detail;

    this.setData({
      startDate: [`${t[0]}-${t[1]}-${t[2]}`, `${t[3]}:${t[4]}`]
    })

  },
  // 结束时间
  bindEndDateChange(e){
    let t = e.detail;

    this.setData({
      endDate: [`${t[0]}-${t[1]}-${t[2]}`, `${t[3]}:${t[4]}`]
    })
  },

  // todayOrder
  todayOrder() {
    let t = util.formatTime(new Date());
    t = t.split(' ')

    console.log(t)

    this.setData({
      timeFlag: 0,
      startDate: [t[0], '00:00:00'],
      endDate: t
    })

  },

  // yesterdayOrder
  yesterdayOrder() {
    let t = util.formatTime(new Date() - 24*60*60*1000);
    t = t.split(' ');


    console.log(t)

    this.setData({
      timeFlag: 1,
      startDate: [t[0], '00:00:00'],
      endDate: [t[0], '23:59:59']
    })

  },

  // all
  allOrder() {
    this.setData({
      timeFlag: 2,
    })

  },

  // 自定义
  userOrders() {
    this.setData({
      timeFlag: 3,
    })

  },

  // 生成链接并复制
  exportExcel() {

    let data = {}
    if(this.data.value1 == 1){
      data = {
        send_status: 1,
        goods_spec_id_arr: [],
        start_date: this.data.startDate[0] + ' ' + this.data.startDate[1],
        end_date: this.data.endDate[0] + ' ' + this.data.endDate[1]
      }
    }else if(this.data.value2 == 1){
      data = {
        send_status: 0,
        goods_spec_id_arr: []
      }
    }else{
      data.goods_spec_id_arr = this.data.result;
      if(this.data.list.length == 0 ){
        console.log('暂无订单')
        return
      }
      if(data.goods_spec_id_arr.length == 0){
        wx.showToast({ title: '请先选择要导出的商品', icon: 'none' })
        return;
      }
    }
    wx.showToast({ title: '开始为你生成...', icon: 'none', mask: true })

    util.wx.post('/api/seller/order_export', data).then(res => {

        if (res.data.code == 200) {
          wx.hideToast()
          let path = res.data.data.filepath

          wx.showModal({
            content: '订单导出已生成下载地址：'+path,
            confirmText: '复制链接',
            success (res) {
              if (res.confirm) {


                wx.setClipboardData({
                  data: path,
                  success: function(res) {
                      wx.showToast({ title: '文件地址已复制,去粘贴打开吧！注意不要泄露哦', duration: 5000, icon: 'none' })
                  }
                })


                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })




            
        }else{
          wx.showToast({ title: res.data.msg, duration: 5000, icon: 'none' })
        }

    })

  }
  // 生成链接并复制
  // exportExcel() {
  //   wx.showToast({ title: '开始为你生成...', icon: 'none' })

  //   let data = {
  //     goods_id: this.data.goods_id
  //   }

  //   if(this.data.timeFlag != 2){
  //     data.start_time = this.data.startDate[0] + ' ' + this.data.startDate[1]
  //     data.end_time = this.data.endDate[0] + ' ' + this.data.endDate[1]
  //   }

  //   console.log(data)

  //   util.wx.get('/api/seller/order_export_by_goods_id', data).then(res => {

  //       if (res.data.code == 200) {

  //           wx.setClipboardData({
  //               data: res.data.data.filepath,
  //               success: function(res) {
  //                   wx.showToast({ title: '文件地址已复制,去粘贴打开吧！注意不要泄露哦', duration: 5000, icon: 'none' })
  //               }
  //           })
  //       }

  //   })

  // }
})

