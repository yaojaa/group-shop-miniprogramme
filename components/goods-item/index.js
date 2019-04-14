import { $wuxGallery } from '../../wux/index'

Component({
    externalClasses: ['custom-class'],
    properties: {
        item: {
            type: Object,
            //wait、process、finish、error
            value: ''
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
         
        }
    },
    ready() {
        console.log(this.data.item)
    }
})