const app = getApp()
const util = require('../../utils/util.js')
let index = 0

Page({
    data: {
        express:[
            {
                express_company:"",
                express_code:""            
            }
        ],
        columns: [],
        comps: [],
        express_company: '',
        express_code: '',
        action_remark: '',
        get_user_name: '',
        get_user_avatar: '',
        traces: [],
        showTraces: false,
        checked: false,
        emsPopup: false,
        express_data:[{"name":"\u987a\u4e30\u901f\u8fd0","kdniao_code":"SF","wyc_code":"SF"},{"name":"\u767e\u4e16\u5feb\u9012","kdniao_code":"HTKY","wyc_code":"HTKY"},{"name":"\u4e2d\u901a\u5feb\u9012","kdniao_code":"ZTO","wyc_code":"ZTO"},{"name":"\u7533\u901a\u5feb\u9012","kdniao_code":"STO","wyc_code":"STO"},{"name":"\u5706\u901a\u901f\u9012","kdniao_code":"YTO","wyc_code":"YTO"},{"name":"\u97f5\u8fbe\u901f\u9012","kdniao_code":"YD","wyc_code":"YD"},{"name":"\u90ae\u653f\u5feb\u9012\u5305\u88f9","kdniao_code":"YZPY","wyc_code":"YZPY"},{"name":"EMS","kdniao_code":"EMS","wyc_code":"EMS"},{"name":"\u5929\u5929\u5feb\u9012","kdniao_code":"HHTT","wyc_code":"HHTT"},{"name":"\u4eac\u4e1c\u5feb\u9012","kdniao_code":"JD","wyc_code":"JD"},{"name":"\u4f18\u901f\u5feb\u9012","kdniao_code":"UC","wyc_code":"UC"},{"name":"\u5fb7\u90a6\u5feb\u9012","kdniao_code":"DBL","wyc_code":"DBL"},{"name":"\u5b85\u6025\u9001","kdniao_code":"ZJS","wyc_code":"ZJS"},{"name":"TNT\u5feb\u9012","kdniao_code":"TNT","wyc_code":"TNT"},{"name":"UPS","kdniao_code":"UPS","wyc_code":"UPS"},{"name":"DHL","kdniao_code":"DHL","wyc_code":"DHL"},{"name":"FEDEX\u8054\u90a6","kdniao_code":"FEDEX","wyc_code":"FEDEX"},{"name":"\u5176\u5b83","kdniao_code":"other","wyc_code":"other"}]
    },
    handleEmsPopup(e) {
        this.setData({
          emsPopup: !this.data.emsPopup
        })

        index = e.currentTarget.dataset.index;
    },
    changeEms(e){
       const { value } = e.detail;

       this.setData({
            ['express[' + index + '].express_company']: value,
            emsPopup: !this.data.emsPopup
        })
    },
    onLoad: function(opt) {
        this.setData({
            order_id: opt.order_id,
            get_user_name: opt.get_user_name,
            get_user_avatar: opt.get_user_avatar
        })

        this.data.pindex = opt.pindex
        this.data.cindex = opt.cindex


        this.getData()
    },
    onSwitch(e) {
        this.setData({ checked: e.detail });
    },
    onChange(event) {
        const { value } = event.detail;
        this.data.express_company = value
    },
    close() {
        this.setData({
            showTraces: false
        })
    },
    
    send() {
        let _this = this;
        wx.showModal({
          content: '是否确认发货？',
          success: (res)=> {
            if (res.confirm) {
                wx.showLoading()

                util.wx.post('/api/seller/set_order_status', {
                    order_id: _this.data.order_id,
                    opt: 'toset_send',
                    action_remark: _this.data.action_remark,
                    express_company: _this.data.checked ? _this.data.express[0].express_company : "",
                    express_code: _this.data.checked ?  _this.data.express[0].express_code : ""
                }).then(res => {

                        wx.showToast({
                            title: '发货成功'
                        })

                        const key = 'dataList['+this.data.pindex+']['+this.data.cindex+']'
                        
                        wx.showLoading()


                        util.setParentData({
                             [key]: res.data.data
                        })
                    },res=>{

                    wx.showToast({
                            title: res.data.msg
                        })

                })
                .catch(res=>{

                 console.log(res)

                })
            }
          }
        })
    },

    // checkExpress() {
    //     wx.showLoading()
    //     util.wx.get('/api/order/get_express_info', {
    //         express_company: this.data.express_company,
    //         express_code: this.data.express_code,
    //         order_id: 12345
    //     }).then(res => {
    //         if (res.data.code == 200) {
    //             this.setData({
    //                 showTraces: true,
    //                 traces: res.data.data.traces.reverse()
    //             })
    //         }
    //         wx.hideLoading()

    //     })
    // },
    getData() {
        // util.wx.get('/api/index/get_express_code').then(res => {
        //     if (res.data.code == 200) {
                this.setData({
                    columns: this.data.express_data.map(item => {
                        return item.name
                    })
                })
        //     }
        // })
    },

    // 添加订单
    addExpress(){
        let flag = this.data.express.filter(e => {
            return !e.express_code || !e.express_company
        })
        if(flag.length > 0){
            wx.showModal({
              title: '',
              content: '请填写完整后再添加',
              showCancel:false
            })
            return;
        }
        this.data.express.push({
            express_company:"",
            express_code:""
        })
        this.setData({
            express: this.data.express
        })
    },


    inputDuplex(e){
        index = e.currentTarget.dataset.index;

        this.setData({
            ['express[' + index + '].express_code']: e.detail
        })

    },
    checkexpress(e) {
        let data = '';
        let _i = 0;
        let _index = 0;
        index = e.currentTarget.dataset.index;

        this.data.express.forEach((e,i) => {
            if (e.express_code) {
                data += 'code'+ _i +'='+ e.express_code + '&com'+ _i +'='+ e.express_company + '&'
                _i++;
            }else if(i < index){
                _index ++;
            }
        })

        data += 'index='+ (index - _index) +'&order_id='+ this.data.order_id

        wx.navigateTo({
          url: '/pages/ems-detail/index?' + data
        })

    }
})