const util = require('../../utils/util.js')
const app =  getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        express_company: '',
        express_code: '',
        express: [],
        currentIndex: 0,
        order_id: '',
        errorMsg: '',
        traces: '',
        user: '',
        goods: ''
    },
    checkExpress(options) {

        let currentExpress = this.data.express[options.index];
        
        if(options.express_company=='自动识别快递公司'){

            options.express_company ='auto'
        }

        this.setData({
            loading:true
        })
        util.wx.get('/api/order/get_express_info', {
            express_company: options.express_company,
            express_code: options.express_code
         }).then(res => {
            if (res.data.status) { // 物流单号正确


                this.setData({
                    currentIndex: options.index,
                    ['express[' + options.index + '].traces']: res.data.data.traces.reverse(),
                    ['express[' + options.index + '].errorMsg']: '没有查到物流信息，可以点击重试或者复制单号到快递官网试试',
                    ['express[' + options.index + '].status']: true
                })
            }else{ // 物流单号错误
                this.data.express_code = "";
                this.data.express_company = "";
                this.setData({
                    currentIndex: options.index,
                    ['express[' + options.index + '].traces']: [],
                    ['express[' + options.index + '].errorMsg']: '快递单号不正确或者暂时没有物流信息 (点击重试)',
                    ['express[' + options.index + '].status']: false
                })

            }
        this.setData({
            loading:false
        })        
    }, err => {

         this.setData({
            loading:true
        })

        })
    },
    copyOrder(e) {
        let i = e.currentTarget.dataset.index;
        let currentExpress = this.data.express[i]
        let msg = '物流公司：' + currentExpress.express_company + '\n物流单号:' + currentExpress.express_code + '\n'
        currentExpress.traces&&currentExpress.traces.forEach(e => {
            msg += e.time + '\n' + e.content + '\n'
        })

        wx.setClipboardData({
            data: msg,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        console.log(options)
        // this.setData({
        //     express_company:options.name || '',
        //     express_code:options.code || '',
        //     order_id:options.id || ''
        // })
        // 
        // 
        const eventChannle = this.getOpenerEventChannel()


        eventChannle.on('info', (res)=> {
            console.log(res.user)
            this.data.user = res.user
            this.data.goods = res.goods
            this.data.order_sn = res.order_sn

            this.getExpess()
        })
    

        // 
     

     


    },

    getExpess(){
           util.wx.get('/api/user/get_express_byordersn',{
            order_sn:this.data.order_sn
        })
        .then(res=>{


            if(res.data.code == 200){

               const d =res.data.data

                this.setData({
                    express:d.express,
                     user:d.orderinfo.consignee,
                    goods:d.detail[0].goods_name
                })

             this.checkExpress({
                express_code: this.data.express[0].express_code,
                express_company:this.data.express[0].express_company,
                index: 0
            })

                   wx.setNavigationBarTitle({
                  title: this.data.user+'的物流信息' 
                })


            }


        })

    },



    toCheckExpress(e) {

        console.log('tockeck')
        let i = e.currentTarget.dataset.index;
        // if(this.data.currentIndex != i){
            this.checkExpress({
                order_id: this.data.order_id,
                express_company: this.data.express[i].express_company,
                express_code: this.data.express[i].express_code,
                index: i
            })
        // }
    },
    onShareAppMessage: function (res) {
    return {
      title: this.data.user+ '的快递单号【'+this.data.goods+'】'
    }
  }
})