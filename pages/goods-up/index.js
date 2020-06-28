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
    changeScope(event) {
        console.log(event)
        this.setData({
            scopeValue: event.target.dataset.name,
            scopeTitle: event.target.dataset.title,
            scopeModal: false
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        console.log(options)

        this.data.supid = options.supid || options.goods_id

        this.data.sellid = options.sellid

        // is_modify=true&supid=7&sellid=1708


        if(options.is_modify){

              wx.setNavigationBarTitle({
                  title: '修改价格' 
                })


        this.setData({
            is_modify:true
        })



        }

        this.getSellerGoodsInfo()


    },

    validate(e){

        const {index,mini,max} = e.currentTarget.dataset

        console.log(e)


        const value = e.detail

        console.log(value,+mini,+max)

         if(value> +max || value< +mini){

            wx.showToast({
                title:'价格请在合理范围',
                icon:'none'
            })

            this.setData({
                btnDisable:true
            })

            return false

         }else{

            this.spec_edit(this.data.info.goods_spec[index].goods_spec_id,value)

              this.setData({
                btnDisable:false
            })
         }

    },

        spec_edit(id,price){

            console.log(id,price)

      wx.showLoading()

       util.wx.post('/api/seller/spec_edit',{
            goods_spec_id:id,
            spec_price:price
        }).then(res=>{
          if(res.data.code == 200){
            // wx.showToast({
            //   title:'价格修改成功',
            //   icon:'none'
            // })
          }else{
            wx.showToast({
              title:'价格修改失败',
              icon:'none'
            })
          }
        })
      wx.hideLoading()
    },


    getSellerGoodsInfo() {

        wx.showLoading()


        util.wx.get('/api/seller/get_supplier_goods_detail', {
                goods_id: this.data.supid 
            })
            .then(res => {

                wx.hideLoading()

                if(res.data.code == 200){
                     this.setData({
                    info:res.data.data.goods
                    })
                }



            }
        )
        },

    modifyPrice(){

          wx.redirectTo({
                url:'../upSuccess/index?goods_id='+this.data.sellid
            })

    },

      upup(){


        wx.showLoading()


        util.wx.post('/api/seller/putaway_supplier_goods',{

            goods_id:this.data.supid,
            spec:this.data.info.goods_spec

        }).then(res=>{

        wx.hideLoading()

            console.log(res.data.code == -103)


       if(res.data.code == 200){

            wx.redirectTo({
                url:'../upSuccess/index?goods_id='+res.data.data.goods_id
            })
        }else if(res.data.code == -103){

           wx.showToast({
            title:'您已经上架过此商品了',
            icon:'none'
           })


        }else{
            wx.showToast({
                title:res.data.msg,
                icon:'none'
            })
        }


        })
        // 上架供应商商品 /seller/putaway_supplier_goods
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getDataList(this.data.sortstr).then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.cpage && !this.data.loading) {
            this.setData({
                cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
            })
            if (this.data.cpage > this.data.totalpage) {
                return
            }
            this.getDataList(this.data.sortstr).then(() => {
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})