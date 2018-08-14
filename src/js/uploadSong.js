{
    let view={
        el:'#uploadSong-container',
        template:`
        <div id="uploadSongButton" class="uploadSongButton">
            <p>点击或拉拽歌曲到此处</p>
            <p>即可上传歌曲</p>
        </div>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            this.initQiniu()
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
                disable_statistics_report: false,   // 禁止自动发送上传统计信息到七牛，默认允许发送
                runtimes: 'html5',      // 上传模式,依次退化
                browse_button: 'uploadSongButton',         // 上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8080/token',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
                domain: 'pden54qz3.bkt.clouddn.com/',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: 'uploadSong-container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: '100mb',             // 最大文件体积限制
                max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'uploadSong-container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                        console.log('准备上传')
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': function(up, file, info) {
                        var response=JSON.parse(info.response)
                        var domain= up.getOption('domain')
                        var sourceLink='http://'+domain+encodeURIComponent(response.key)
                        console.log('name',response.key)
                        console.log('sourceLink',sourceLink)
                        let data={
                            name:response.key,
                            singer:'',
                            url:sourceLink
                        }
                        window.eventHub.emit('new',data)
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                        console.log(err)
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                    },
                    'Key': function(up, file) {
                        var key=file.name
                        return key
                    }
                }
            })
        }
    }
    controller.init(view,model)
}