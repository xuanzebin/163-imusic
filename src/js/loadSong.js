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
        }
    }
    controller.init(view,model)
}