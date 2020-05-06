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

        }else{

        this.setData({
            info:app.globalData.helpSaleData
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

        util.wx.post('/api/seller/goods_add_or_edit',{
            goods_id:this.data.goods_id,
            goods_spec:this.data.info.goods_spec
        })

    },



    validate(e){




        const {index,spec_price} = e.currentTarget.dataset



        const value = e.detail.value

        console.log(value,spec_price)

         if(value > spec_price){

            wx.showToast({
                title:'这价格有点高吧',
                icon:'none'
            })

            this.setData({
                btnDisable:true
            })

            return false

         }else{

            this.data.info.goods_spec[index].sub_agent_price = value

              this.setData({
                btnDisable:false
            })
         }

    },



  cancelHelp(){

        util.setParentData({
            agent_opt:0
        })



    },



    modifyPrice(){

        if(this.data.goods_id){

            this.editSubmit()

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