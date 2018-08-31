Page({
  data:{
    current: "tab1",
    visible: false,
    alertMsg: "确定执行？",

  },
  onReady: function (e) {



  },

  tapTo({target}) {
    let url = '/pages/publish/publish';
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


})