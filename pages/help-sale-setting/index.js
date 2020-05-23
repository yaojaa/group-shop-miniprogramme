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
        scopeModal: false,
        scopeValue: '',
        scopeTitle: '',
        checked: false,
        errorMsg:'',
        btnDisable:false,
        is_modify:false
    },
    onChange({ detail }) {
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {


        if(options.goods_id){


            this.data.goods_id = options.goods_id

            this.getGoodsInfo()
            this.is_modify = true

        }else{

        //修正下级价格为空
        app.globalData.helpSaleData.goods_spec.forEach(item=>{
          if(item.sub_agent_price =='' || item.sub_agent_price == 0){
             this.data.btnDisable = true
          }
        })



        this.setData({
            info: app.globalData.helpSaleData,
            btnDisable: this.data.btnDisable
        })

        


        }




    },

    getGoodsInfo(){
    util.wx
      .get('/api/goods/get_goods_detail', {
        goods_id: this.data.goods_id
    })
      .then((res) => {

        if(res.data.code == 200){
               this.setData({
            info:res.data.data.goods
             })
        }


      })
    },

    editSubmit(){

        util.wx.post('/api/seller/spec_edit',{
            goods_id:this.data.goods_id,
            goods_spec:this.data.info.goods_spec
        })

    },

    spec_edit(id,price){

      wx.showLoading()

       util.wx.post('/api/seller/spec_edit',{
            goods_spec_id:id,
            sub_agent_price:price
        }).then(res=>{
          if(res.data.code == 200){
            wx.showToast({
              title:'价格修改成功',
              icon:'none'
            })
          }else{
            wx.showToast({
              title:'价格修改失败',
              icon:'none'
            })
          }
        })
      wx.hideLoading()
    },



    validate(e){

      console.log(e)


        const {index,spec_price,goods_spec_id} = e.currentTarget.dataset

        var value = e.detail

        if(value !== '' && !util.isMoney(value)){

          wx.showToast({
                    title:'价格格式不合法',
                    icon:'none'
                })

           return this.setData({
                btnDisable:true
            })

        }

         if(value == '' || value == 0 || value > parseInt(spec_price)){

            wx.showToast({
                title:'请设置合理的供货价',
                icon:'none'
            })

            this.setData({
                btnDisable:true
            })

            return false

         }else{
          /**修改价格调用接口**/
          if(this.is_modify){
            this.spec_edit(goods_spec_id,value)
            return
          }



            //这里this.data.info 对是app.globaldata.helpData的引用，修改会同步修改
            this.data.info.goods_spec[index].sub_agent_price = value

          var is_btnDisable =false  
          app.globalData.helpSaleData.goods_spec.forEach(item=>{
            if(item.sub_agent_price =='' || item.sub_agent_price == 0){
               is_btnDisable = true
            }
          })

        this.setData({
           btnDisable:is_btnDisable
        })





         }

    },
    /**点击确定按钮**/
    modifyPrice(){







        if(this.is_modify){
          //返回详情页
          
           wx.navigateBack()
          console.log('返回详情页')

        }else{
            util.setParentData({
                agent_opt:1
            })
        }

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