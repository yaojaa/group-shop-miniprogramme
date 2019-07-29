let saveTimer = null;
let app = getApp();
Component({
  properties: {
    previewImgs: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.init();
      },
    },
    previewImgHidden: {
      type: Boolean,
      value: false
    },
  },
  data: {
    imgsPath:[], // 图片信息集合
    index: 0, // 动画下标
    checkImgDuration: 0, // 查看大图轮播持续时间
    bigImgsHidden: true,
    saveHidden: true,
    saveSrc: "",
  },
  ready(){
    this.init();
  },

  pageLifetimes: {},

  methods: {
    init() {

      if (this.isEmpty(this.properties.previewImgs.urls)) {
        return;
      }

      let images = this.properties.previewImgs;

      // if(images.current){
      //   console.log(images.urls, images.current)
      //   this.data.index = images.urls.indexOf(images.current);
      // }

      this.setData({
        index: images.current,
        imgsPath: images.urls,
        bigImgsHidden: this.properties.previewImgHidden
      },()=>{
        this.setData({
          checkImgDuration: 500
        })
      })
    },
    longpress(opt){
      let _this = this;
      console.log(app.globalData.systemInfo.SDKVersion)

      if(app.globalData && app.globalData.systemInfo && app.globalData.systemInfo.SDKVersion && app.globalData.systemInfo.SDKVersion < "2.7.0"){
        wx.getImageInfo({
          src: opt.currentTarget.dataset.src,
          success (res) {
            _this.data.saveSrc = res.path;
          },
          fail(){
            _this.data.saveSrc = "";
          }
        })

        this.setData({
          saveHidden: false
        })
        console.log("longpress")
      }

    },
    removeSave(){
      this.setData({
        saveHidden: true
      })
    },
    toSaveImg(){
      let src = this.data.saveSrc;

      if(src){
        this.saveImg(src);
      }else{
        saveTimer = setInterval(()=>{
          if(src){
            this.saveImg(src);
            clearInterval(saveTimer);
          }
        },300)
      }
      
      this.removeSave();
    },

    saveImg(src){
      wx.getSetting({
          success(res){
              if(!res.authSetting['scope.writePhotosAlbum']) {
                  wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                          wx.saveImageToPhotosAlbum({
                              filePath: src
                          });
                      }
                  })
              }else{
                  wx.saveImageToPhotosAlbum({
                      filePath: src
                  });
              }
          }
      })
    },

    closeBigImg(){
      this.setData({
        checkImgDuration: 0,
        bigImgsHidden: true
      })
    },

    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

  },
});
