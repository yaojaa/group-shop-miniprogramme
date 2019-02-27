Component({
  properties: {
    imgs: {
      type: Object,
      value: {
        src:[
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
    imgsPath:[
      // {
      //   time: 3000,
      //   timing: 'ease',
      //   type: '0', //0正方形  1横图  2竖图
      //   src: '',
      //   width: '',
      //   height: '',
      //   hidden: false,
      //   animationOuter: '',
      //   animationImg: ''
      // }
    ],
    index: 0
  },
  ready(){
    this.animation = wx.createAnimation();
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
          // 像素比率
          let bt = this.properties.imgs.height/rects[0][0].height;
          let w = rects[0][0].width;
          let h = rects[0][0].height;
          console.log(bt)
          arr.forEach((e, i) => {
            let b = e.width/e.height;
            let size = this.widthHeight(w, h, e.width, e.height);

            if(e.errMsg == "getImageInfo:ok"){
              if(b == 1){  //正方形
                this.data.imgsPath.push({
                  src: e.path,
                  width: size.w,
                  height: size.h,
                  type: '0', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  time: 3000,
                  timing: 'ease',
                  animationOuter: '',
                  animationImg: ''
                })
              }else if(b > 1){ //横图
                this.data.imgsPath.push({
                  src: e.path,
                  width: size.w,
                  height: size.h,
                  type: '1', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  time: 3000,
                  timing: 'ease',
                  animationOuter: '',
                  animationImg: ''
                })

              }else{  //竖图
                this.data.imgsPath.push({
                  src: e.path,
                  width: size.w,
                  height: size.h,
                  type: '2', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  time: 3000,
                  timing: 'ease',
                  animationOuter: '',
                  animationImg: ''
                })

              }
            }
          })
          this.setData({
            imgsPath: this.data.imgsPath
          });
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

    widthHeight(w, h, _w, _h){
      let wh = w/h;
      let _wh = _w/_h;
      let size = {};
      if(wh > _wh){
        size.w = w;
        size.h = _h/_w*w;
      }else{
        size.h = h;
        size.w = _w/_h*h;
      }
      return size;
    },


    animationFun(){



    },



    onClick(){ //点击动画   测试
      this.setData({
        left: '-1000px'
      })
    }

  },
});
