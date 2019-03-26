import { $wuxGallery } from '../../wux/index'

Component({
    externalClasses: ['custom-class'],
    properties: {
        item: {
            type: Object,
            //wait、process、finish、error
            value: ''
        },
        user:{
            type:Boolean,
            value:true
        },
        button:{
            type:Boolean,
            value:false
        }
    },
    options: {},
    relations: {

    },
    data: {
        urls: [
           
        ]
    },
    methods: {
        previewImage(e) {
            console.log(e)
            const { current } = e.currentTarget.dataset
            wx.previewImage({
                current,
                urls:e.currentTarget.dataset.url
            })
        }
    },
    ready() {
        console.log(this.data.item)
    }
})