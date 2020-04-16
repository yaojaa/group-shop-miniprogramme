Component({
    externalClasses: ['custom-class'],
    properties: {
        tips: {
            type: String,
            value: ''
        },
        textarea: {
            type: String,
            value: ''
        },
        row: {
            type: Number,
            value: 3
        }
    },
    options: {},
    data: {
        toggle: true
    },
    methods: {
        handleTextarea() {
            this.setData({
                toggle: !this.data.toggle
            })
        },
        handleInput(e) {
            this.setData({
                textarea: e.detail.value
            })
            this.triggerEvent('sendData', this.data.textarea)
        }
    },
    ready() {
        //console.log(this.data.item)
    }
})