const app = getApp()



Page({
  data:{
    current: "tab1",
    visible: false,
    alertMsg: "确定执行？",
    eidePriceVisible: false,
    searchContent:"",
    deleteShow: true,
    dataList:[]

  },
  onLoad:function(optiton){


    let goods_id = optiton.goods_id


      wx.request({
      url: 'https://www.daohangwa.com/api/seller/get_order_list',
      data: { 
      goods_id:goods_id,
      token:app.globalData.token
      },
      success:(res) => {
        this.setData({
          dataList:res.data.data
        })
      }
    })

  },
  onReady: function (e) {



  },
  searchInput(e){
    this.deleteShow = e.detail.value.length > 0 ? false : true;
    this.searchContent = this.trim(e.detail.value);
    this.setData({
      deleteShow: this.deleteShow
    })
  },
  deleteSearchContent(){
    this.searchContent = "";
    this.setData({
      searchContent: this.searchContent,
      deleteShow: true
    })
  },

  toConfirm({target}){
    let url = '/pages/orderconfirm/details';
    if (target.dataset.id) url = url + '?id=' + target.dataset.id;
    wx.navigateTo({
      url: url,
    })
  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  openAlert({target}) {
    console.log(target)
    this.setData({
      visible: true,
      alertMsg: `id:${target.dataset.id};type:${target.dataset.type}`
    });
  },

  closeAlert(e) {
    console.log(e)
    this.setData({
      visible: false
    });
  },
  openPriceAlert(){
    this.setData({
      eidePriceVisible: true
    })
  },
  closePriceAlert(){
    this.setData({
      eidePriceVisible: false
    })
  },
  trim(str){ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
  }


})