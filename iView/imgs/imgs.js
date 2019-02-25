Component({
  properties: {
    imgs: {
      type: Object,
      value: {src:[
          "https://www.daohangwa.com/public/upload/local_cover/tmp_71a8a18f8d4e18b8cf892a4c3e28424cf3997fe5c76f3157.jpg",
          "https://www.daohangwa.com/public/upload/local_cover/wx6ac9955f87c289f0.o6zAJsx6hMSC0UBabsyLYJuKY6ew.7z0KiIbdNBif8c155dfc2e203591a2bc726215709f2e.jpg",
          "https://www.daohangwa.com/public/upload/local_cover/tmp_8789e959d03e6124356439808cc0354c81fd598848c33517.jpg",
        ],
        height: "1000"
      },
      observer: function (newVal, oldVal) {
        this.init();
      },
    },
  },
  data: {
    imgsPath:[],
    left: '0'
  },
  ready(){
    this.init();
  },

  methods: {
    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

    init() {
      let imageInfo = [];

      if (this.isEmpty(this.properties.imgs)) {
        return;
      }
      this.properties.imgs.src.forEach(e => {
        imageInfo.push(this.getImageInfo(e))
      });
      
      Promise.all(imageInfo).then(arr => {
        this.createSelectorQuery().selectAll('.img-box').boundingClientRect().exec(rects => {
          console.log(arr, rects[0])
          let bt = this.properties.imgs.height/rects[0][0].height
          arr.forEach(e => {
            if(e.errMsg == "getImageInfo:ok"){
              let b = e.width / e.height;
              if(b == 1){  //正方形

              }else if(b > 1){ //横图

              }else{  //竖图

              }
            }
          })
        })
      });
      
    },

    getImageInfo(filePath) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: filePath,
          success: (info) => {
            resolve(info);
          },
          fail: (error) => {
            console.log('err',error)
          },
        });
      })
      
    },

    onClick(){
      this.setData({
        left: '-1000px'
      })
    }

  },
});
