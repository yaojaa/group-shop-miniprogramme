const util = require('../../utils/util')
const app = getApp()

function fmtDate(obj) {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        date: '',
        dateModal: false,
        minDate: new Date(1950, 1, 1).getTime(),
        currentDate: new Date().getTime(),
        maxDate: new Date().getTime(),
        scopeModal: false,
        scopeValue: '',
        scopeTitle: '不限制',
        checked: false,
        goodsList: [],
        goodsArr: [],
        coupon_type:'',
        couponTypeName:'',
        actions:[
        {
        name: '固定金额红包',
        subname: '描述信息',
        type:1
      },
          {
        name: '随机金额红包',
        subname: '描述信息',
        type:2
      },    {
        name: '指定客人红包',
        subname: '描述信息',
        type:3
      },
        ]
    },
    onSwitchChange(e){
        this.setData({
            checked:e.detail
        })
    },
    handlecouponTypeModal(){
        this.setData({
            show:true
        })
    },
    oncpSelect(event){
    console.log(event.detail);

    this.setData({
        couponTypeName:event.detail.name
    })

    },

      oncpClose(event){
  this.setData({
            show:false
        })
    },
    onChange( event) {
        // 需要手动对 checked 状态进行更新
        this.setData({
            goodsArr: event.detail
        });

        if(event.detail.length){
            this.setData({
                scopeTitle:'已选'+event.detail.length+'个商品'
            })
        }


    },
   toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  noop(){
    console.log(this.data.goodsArr)
  },
    handleDateModal() {
        this.setData({
            dateModal: !this.data.dateModal
        });
    },
    handleDate(event) {
        this.setData({
            currentDate: event.detail,
            date: fmtDate(event.detail),
            dateModal: !this.data.dateModal
        });
        console.log(event)
    },
    handleScopeModal() {
        this.setData({
            scopeModal: !this.data.scopeModal
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getGoodsList()

    },

    getGoodsList() {

        util.wx
            .get('/api/seller/get_goods_list', { pagesize: 50 })
            .then((res) => {

                if (res.data.code == 200) {
                    this.setData({
                        goodsList: res.data.data.goodslist,
                        is_loading: false
                    })

                } else {
                    this.setData({
                        is_loading: false
                    });
                }
            })
            .catch((e) => {

            })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})