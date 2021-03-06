Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    content: {
      type: Object    
    }
  },
  data: {
    // 这里是一些组件内部数据
    previewImgs: {
      current: '',
      urls: [],
    },
    previewImgHidden: true
  },
  observers:{
    'content':function (obj) {

      console.log(obj)

      if(obj &&  obj.length){
        obj.forEach(e=>{
        if(e.type == 'image'){
          this.data.previewImgs.urls.push(e.src)
        }
      })
      }

    }
  },
  methods: {
    showPreview(e){
      let currentSrc = e.currentTarget.dataset.src;
      let index = this.data.previewImgs.urls.indexOf(currentSrc)
      index = index > 0 ? index : 0;
      this.data.previewImgs.current = index;
      this.setData({
        previewImgs: this.data.previewImgs,
        previewImgHidden: false
      })
    }
  }
})