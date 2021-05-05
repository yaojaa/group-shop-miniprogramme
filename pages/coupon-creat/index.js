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
        type: '0' ,
        
        typeModal: false,
        scopeValue: '',
        scopeTitle: '',
        checked: false,
        typeTitle:'',
        userSelectVisble:true,
        customerList:[]
    },
    onChange({ detail }) {
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
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
    showTypeModal(){

          this.setData({
            typeModal: !this.data.typeModal
        });

    },
    handleScopeModal() {
        this.setData({
            scopeModal: !this.data.scopeModal
        });
    },
    changeScope(event) {
        this.setData({
            scopeValue: event.target.dataset.name,
            scopeTitle: event.target.dataset.title,
            scopeModal: false
        });
    },

    changeType(event) {
         this.setData({
            type: event.target.dataset.name,
            typeTitle: event.target.dataset.title,
            typeModal: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this.getCustomers()

    },
    //创建优惠券
    createCoupon(){
        util.wx.post('/api/redpacket')
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
     * 获取粉丝列表
     */
    getCustomers(params) {
        this.setData({
            loading: true
        })
        let data = {
            sortstr: '',
            cpage: 1,
            pagesize: 15
        }

        if(this.data.searchWords){
            data.keyword = this.data.searchWords
        }

        console.log(data)

        return new Promise((resolve, reject) => {
            util.wx.get('/api/seller/get_fans_list', data).then((res) => {
                this.setData({
                    loading: false,
                    customerList: this.data.list.concat(res.data.data.lists)
                })
                resolve(res)
            }, (err) => {
                reject(err)
            })
        })
  
    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})