const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
  	  columns: [
	      { text: '请选择快递公司', disabled: true }
	    ],
  	comps:[],
    express_company:'中通快递',
    express_code:'75153068571982',
    action_remark:'',
    get_user_name:'',
    get_user_avatar:'',
    traces:[],
        showTraces: false


  },
  onLoad:function (opt) {

   this.order_id = opt.order_id
   this.setData({
     get_user_name :opt.get_user_name,
     get_user_avatar :opt.get_user_avatar
   })

   this.getData()

  },
  onChange(event){
     const {value} = event.detail;

     this.data.express_company = value
    
  },
  send(){

    util.wx.post('/api/seller/set_order_status',{
      order_id:this.order_id,
      opt:'toset_send',
      action_remark:this.data.action_remark,
      express_company:this.data.express_company,
      express_code:this.data.express_code
    }).then(res=>{
      if(res.data.code == 200){

        wx.showToast({
          title:'发货成功'
        })
        wx.navigateBack()
        
      }
    })



  },
  checkExpress(){

    wx.showLoading()

        util.wx.get('/api/order/get_express_info',{
           express_company:this.data.express_company,
              express_code:this.data.express_code,
              order_id:12345
        }).then(res=>{
      if(res.data.code == 200){
        this.setData({
          showTraces:true,
          traces:res.data.data.traces
        })
      }
          wx.hideLoading()

    })


  },
  getData(){
  	util.wx.get('/api/index/get_express_code').then(res=>{
  		if(res.data.code == 200){
  			this.setData({
  				columns:res.data.data.map(item=>{
            return item.name
          })
  			})
  		}
  	})
  },
  inputDuplex:util.inputDuplex
   
})
