{
    let view={
        el:'.page',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <div class="songAudio">
            <audio src='{{url}}'></audio>
        </div>
        `,
        render(data){
            this.template=this.template.replace('{{url}}',data.url)
            console.log(this.template)
            this.$el.append(this.template)
        },
        playSong(){
            this.$el.find('#play').removeClass('active')
            this.$el.find('audio')[0].play()
        },
        pauseSong(){
            this.$el.find('#play').addClass('active')
            this.$el.find('audio')[0].pause()
        }
    }
    let model={
        data:{},
        findSong(id){
            console.log('id1',id)
            var query = new AV.Query('Song');
            return query.get(id).then((response)=>{
                let {id,attributes}=response
                return {id,...attributes}
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.getSongId()
            this.model.findSong(this.model.data.id).then((response)=>{
                this.model.data=response
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        getSongId(){
            let search=window.location.search
            search.substring(1).split('&').filter((v=>v)).map((kv)=>{
                let message=kv.split('=')
                let key=message[0]
                let value=message[1]
                if (key==='id'){
                    this.model.data.id=value
                }
                return message
            })
        },
        bindEvents(){
            this.view.$el.on('click','.audioControl',(e)=>{
                if (e.currentTarget.id==='play'){
                    e.stopPropagation()
                    this.view.playSong()
                } else {
                    this.view.pauseSong()
                }
            })
        }
    }
    controller.init(view,model)
}