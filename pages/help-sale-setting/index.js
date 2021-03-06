const util = require('../../utils/util')
const app = getApp()
import Dialog from '../../vant/dialog/dialog';

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

        //从详情页进入
        if(options.goods_id){

            this.data.goods_id = options.goods_id
            this.getGoodsInfo()
            this.is_modify = true

        }else{

        //从发布或者编辑页进入，修正下级价格为空
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

          let goodsData = res.data.data.goods

             


           this.setData({
            info:goodsData 
          })
        }


      })
    },


    spec_edit(id,price,index){


       util.wx.post('/api/seller/spec_edit',{
            goods_spec_id:id,
            sub_agent_price:price
        }).then(res=>{
          if(res.data.code == 200){
           
            this.setData({
                btnDisable:false
            })

            const key = 'spec['+index+'].sub_agent_price'
            util.setParentData({
                [key]:price
            },true)
            
            
          }else{
            wx.showToast({
              title:'价格修改失败',
              icon:'none'
            })
          }
        })
    },



    validate(e){

        const {index,spec_price,goods_spec_id} = e.currentTarget.dataset
        var is_btnDisable =false  

        var value = parseFloat(e.detail)

        console.log(1111,e)

        console.log(util.isMoney(value))

        if(!util.isMoney(value)){

          wx.showToast({
                    title:'价格格式不合法',
                    icon:'none'
                })
           return 
        }

        console.log('执行了这里')

         if(value == '' || value == 0){

      
            this.setData({
                btnDisable:true
            })

            return false

         }

         if(value > parseInt(spec_price)){

            wx.showToast({
                title:'代理价不能超过你的售价',
                icon:'none'
            })

            this.setData({
                btnDisable:true
            })

            return false

         }else{
          /**修改价格调用接口**/
          if(this.is_modify){

            this.data.info.goods_spec[index].sub_agent_price = value
            this.spec_edit(goods_spec_id,value,index)
            is_btnDisable = false
            return
          }



            //这里this.data.info 对是app.globaldata.helpData的引用，修改会同步修改
          this.data.info.goods_spec[index].sub_agent_price = value
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

      console.log(this.data.info.goods_spec)

        try {

         this.data.info.goods_spec.forEach((item)=>{

          if(item.sub_agent_price=='0.00' || item.sub_agent_price==''){
            
            wx.showToast({
              title:'请设置代理价格',
              icon: 'warning',
              duration: 2000

            })

            throw Error();
          }

         })
       }
       catch(e){
        return
       }


        if(this.is_modify && this.data.info.agent_opt !=='1'){
          wx.showLoading()
          util.wx.post('/api/seller/set_goods_agent_opt',{
            agent_opt:1,
            goods_id:this.data.goods_id
          }).then(res=>{

            if(res.data.code == 200){
                 wx.hideLoading()

                 Dialog.alert({
                      title: '开启成功',
                      message: '开启帮忙成功，可以邀请小伙伴帮卖商品了！',
                      theme: 'round-button' 
                    }).then(() => {
                       util.setParentData({
                                      'goods.agent_opt':1
                                     })

                    });
                 
                

            }else{
              wx.showToast({
                title:res.data.msg,
                icon:'none'
              })
            }


          })
        
        }else{
            //返回上一页
          console.log('返回详情页')
            util.setParentData({
                agent_opt:1
            })
        }

    },
    closeHelpSale(){
           util.wx.post('/api/seller/goods_add_or_edit',{
            goods_id: this.data.goods_id,
            agent_opt:0
        }).then(res => {
            if (res.data.code !== 200) {
               return wx.showModal({
                    title: '温馨提示',
                    content: res.data.msg,
                    showCancel: false,
                })
            }

             Dialog.alert({
                      title: '关闭成功',
                      message: '关闭帮卖后，代理们的商品将自动下架！再次开启需要重新绑定'
                    }).then(() => {
                       util.setParentData({
                                      'goods.agent_opt':0
                                     })

                    });


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