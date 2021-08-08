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


        this.getGoodsInfo()

    },

    validate(e){




        const {index,mini,max} = e.currentTarget.dataset



        const value = e.detail.value

         if(value>max || value<mini){

            wx.showToast({
                title:'价格请在合理范围',
                icon:'none'
            })

            this.setData({
                btnDisable:true
            })

            return false

         }else{

            this.data.info.goods_spec[index].spec_price = value

                    console.log('change',value)


              this.setData({
                btnDisable:false
            })
         }

    },


        getSellerGoodsInfo() {


        util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.sellid 
            })
            .then(res => {

                this.data.currentGoodsSpec = res.data.data.goods.goods_spec

                 for(var i=0;  i<this.data.info.goods_spec.length;i++ ){


                        this.data.info.goods_spec[i].spec_price = this.data.currentGoodsSpec[i].spec_price


                    }

                console.log('this.data.info',this.data.info)

                this.setData({
                    info:this.data.info
                })


            }
        )
        },



    getGoodsInfo() {

        util.wx.get('/api/seller/get_supplier_goods_detail', {
                goods_id: this.data.supid 
            })
            .then(res => {

                var data = res.data.data.goods

                data.goods_spec.forEach(it=>{
                    it.spec_price = it.mspr_end || ''
                })

                  this.setData({
                    info:res.data.data.goods
                 })

             

                //如果是修改价格
                //
                console.log(this.data.is_modify)
                
                if(this.data.is_modify){

                  this.getSellerGoodsInfo()

                }else{

                 res.data.data.goods.goods_spec.forEach(item=>{
                    item.spec_price = item.mspr_end || ''
                    })

               


                }

                 

            }
        )
        },


    modifyPrice(){


        //供应商商品规格id 和商家的规格id 不一样 。提交需要商家规格id
        //
        //
        //
        for(var i=0;  i<this.data.info.goods_spec.length;i++ ){


            this.data.info.goods_spec[i].goods_spec_id = this.data.currentGoodsSpec[i].goods_spec_id
            // this.data.info.goods_spec[i].spec_price = this.data.currentGoodsSpec[i].spec_price


        }




         util.wx.post('/api/seller/edit_supplier_goods',{

            goods_id:this.data.sellid,
            spec:this.data.info.goods_spec

        }).then(res=>{

           if(res.data.code ==200){ 
           wx.showToast({
            title:'修改成功'
           })

            wx.redirectTo({
                url:'../upSuccess/index?goods_id='+res.data.data.goods_id
            })


       }else{
           {

            wx.showToast({
                title:res.data.msg,
                icon:'none'
            })

        }
       }


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