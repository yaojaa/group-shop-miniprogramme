<template>

<div class="page-body">

<div class="weui-uploader weui-cells_form weui-cell">
                        <div class="weui-uploader__bd">
                            <div class="weui-uploader__files" id="uploaderFiles">
                                <div class="weui-uploader__file" style=""></div>
                                <div class="weui-uploader__file" style=""></div>
                                <div class="weui-uploader__file" style=""></div>
                                <div class="weui-uploader__file weui-uploader__file_status" style="">
                                    <div class="weui-uploader__file-content">
                                        <i class="weui-icon-warn"></i>
                                    </div>
                                </div>
                                <div class="weui-uploader__file weui-uploader__file_status" style="">
                                    <div class="weui-uploader__file-content">50%</div>
                                </div>
                            </div>
                            <div class="weui-uploader__input-box">
                                <text class="upload_txt">图片/视频</text>
                            </div>
                        </div>
                    </div>


<div class="weui-cells weui-cells_form">

<div class="weui-cell">
  <input :value="title" name="title" maxlength="50" placeholder="为宝贝添加个诱人的标题吧" />
</div>


<div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea name="content" class="weui-textarea"  placeholder="商品描述、介绍、特色等" rows="23"></textarea>
                </div>



            </div>

  继续添加介绍图片
<i-button type="primary" >这是一个按钮</i-button>

 <i-card full title="卡片标题" extra="额外内容" thumb="https://i.loli.net/2017/08/21/599a521472424.jpg">
     <view slot="content">内容不错</view>
     <view slot="footer">尾部内容</view>
 </i-card>

</div>




<div class="weui-cells weui-cells_form">
    <div class="weui-cell">
                    <div class="weui-cell__hd"><div class="weui-label">团购价:</div></div>
                    <div class="weui-cell__bd">
                    <input name="price"  maxlength="50" placeholder="0.00" />
                    </div>
    </div>

     <div class="weui-cell">
                    <div class="weui-cell__hd"><div class="weui-label">属性规格：</div></div>
                    <div class="weui-cell__bd">
                 <switch name="switch" :checked="hasType" bindchange="switch2Change" />
                    </div>
      </div>

         <div class="weui-cell"  v-if="hasType">
                    <div class="weui-cell__hd">
                    <div class="weui-label">+</div>
                    </div>
                    <div class="weui-cell__bd">
                       <input  maxlength="50" placeholder="例:白色款" />
  <input  maxlength="50" placeholder="例:99.8" />

                    </div>
      </div>

       <!-- <div class="weui-cell">
                    <div class="weui-cell__hd"><div class="weui-label">是否送货</div></div>
                    <div class="weui-cell__bd">
                    <switch bindchange="deliverChange"  checked="deliver" name="switch" /> <div wx:if="{{length > 5}}"> 1 </div>
<div wx:elif="{{deliver}}"> 送货上门 </div>
<div wx:else> 自取 </div> 
                    </div>
      </div> -->

<div>
          <div class="weui-cell">
                    <div class="weui-cell__hd"><div class="weui-label">地址：</div></div>
                    <div class="weui-cell__bd">
                    <input name="address"  maxlength="50" bindtap="chooseMap" placeholder="点击选择" />
                    </div>
                    <div class="weui-cell__ft">
                    <div class="weui-icon-warn">></div>
                     </div>

              
                    
    </div>

     <div class="weui-cell">
                    <div class="weui-cell__hd"><div class="weui-label">门牌号：</div></div>
                    <div class="weui-cell__bd">
                    <input  maxlength="50" bindtap="chooseMap" placeholder="例:16号楼293室" />
                    </div>

         </div>

</div>

</div>

<button formType="submit"   class="weui-btn weui-btn_primary">确定发布</button>

</form>
       

   
</div>

 
</template>

<script>

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      data:'2015-09-01'
    }
  }
}

</script>

<style scoped>

@import "../../utils/weui.wxss";
.upload_btn{
  border: 1px solid #c00
}



.weui-uploader{
  padding: 10px 10px 0
}

.upload_txt{
  position: absolute;
  left: 0;
  bottom: 5px;
  width: 100%;
  font-size: 18rpx;
  color: #666;
  text-align: center;
  display: block
}
</style>
