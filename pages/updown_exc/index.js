const util = require('../../utils/util.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: ['2019-10-21', '10:22:00'],
    endDate:  ['2019-10-21', '10:22:00'],
    goods_id: '',
    timeFlag: 0,  // 0 今天  1 昨天  2 全部  3 自定义
    result: ['a', 'b'],
    option1: [
      { text: '待发货', value: 0 },
      { text: '已发货', value: 1 },
    ],
    option2: [
      { text: '按商品选择', value: 'a' },
      { text: '全部商品', value: 'b' }
      ],
        option3: [
      { text: '未导出', value: 'a' },
      { text: '已导出', value: 'b' }
      ],
    value1: 0,
    value2: 'a'

  },

    onChange(event) {
    this.setData({
      result: event.detail
    });
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
    wx.showToast({ title: '开始为你生成...', icon: 'none' })

    let data = {
      goods_id: this.data.goods_id
    }

    if(this.data.timeFlag != 2){
      data.start_time = this.data.startDate[0] + ' ' + this.data.startDate[1]
      data.end_time = this.data.endDate[0] + ' ' + this.data.endDate[1]
    }

    console.log(data)

    util.wx.get('/api/seller/order_export_by_goods_id', data).then(res => {

        if (res.data.code == 200) {

            wx.setClipboardData({
                data: res.data.data.filepath,
                success: function(res) {
                    wx.showToast({ title: '文件地址已复制,去粘贴打开吧！注意不要泄露哦', duration: 5000, icon: 'none' })
                }
            })
        }

    })

  }
})