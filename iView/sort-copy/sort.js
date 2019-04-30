Component({
  externalClasses: ['s-class'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    datas: { // 属性名
      type: Array,
    },
  },
  methods: {
    toTop(e) {
      let node = this.getNodes(e.target.dataset.id);
      if(node.length > 0 && node[0] > 0){
        this.data.datas.splice(node[0] - 1, 2, node[1], this.data.datas[node[0] - 1]);
      };
      this.onChange();
    },
    toDown(e) {
      let node = this.getNodes(e.target.dataset.id);
      if(node.length > 0 && node[0] < this.data.datas.length - 1){
        this.data.datas.splice(node[0], 2, this.data.datas[node[0] + 1], node[1]);
      };
      this.onChange();
    },
    toDel(e) {
      let node = this.getNodes(e.target.dataset.id);
      if(node.length > 0){
        this.data.datas.splice(node[0], 1);
      };
      this.onChange();
    },
    onChange() {
      this.triggerEvent('change', this.data.datas);
    },
    getNodes(id) {
      let node = [];
      this.data.datas.forEach((e, i) => {
        if(e.id === id){
          node.push(i);
          node.push(e);
        };
      })
      return node;
    },
  }

})