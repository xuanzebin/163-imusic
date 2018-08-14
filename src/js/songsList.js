{
    let view={
        el:'#songList-container',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <div class="list-wrapper">
            <ul class="songList">
            </ul>
        </div>
        `,
        render(data){
            this.$el.html(this.template)
            let {songs}=data
            let liList=songs.map((song)=>{
                return $('<li></li>').text(song.name)
            }) 
            this.$el.find('ul').empty()
            liList.map((domList)=>{
                this.$el.find('ul').append(domList)
            })
        }
    }
    let model={
        data:{
            songs:[]
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.view.render(this.model.data)
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}