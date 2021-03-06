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
                let $li=$('<li></li>').text(song.name).attr('data-song-id',song.id)
                if (song.id===data.selectedId){
                    this.highLight($li)
                }
                return $li
            }) 
            this.$el.find('ul').empty()
            liList.map((domList)=>{
                this.$el.find('ul').append(domList)
            })
        },
        highLight($li){
            $li.addClass('active').siblings().removeClass('active')  
        }
    }
    let model={
        data:{
            songs:[],
            selectedId:null,
        },
        findSongs(){
            var query = new AV.Query('Song');
            return query.find().then((response)=>{
                return this.data.songs=response.map((song)=>{
                    let {id,attributes}=song
                    return Object.assign({id},attributes)
                })
            })
        },
        updata(data){
            let {songs}=this.data
            let songID=data.id
            for(let i=0;i<songs.length;i++){
                if (songs[i].id===songID){
                    this.data.songs[i]=data
                    break
                }
            }
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.findAllSongs()
            this.bindEventHub()
            this.bindEvents()
        },
        findAllSongs(){
            this.model.findSongs().then(()=>{
               this.view.render(this.model.data)
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                this.view.$el.find('li').map((index,li)=>{
                    $(li).removeClass('active')
                })
            })
            window.eventHub.on('updata',(data)=>{
                this.model.updata(data)
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                let songID=e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedId=songID
                this.view.render(this.model.data)
                let songs=this.model.data.songs
                let data
                for (let i=0;i<songs.length;i++){
                    if (songs[i].id===songID){
                        data=songs[i]
                    }
                }
                window.eventHub.emit('selected',JSON.parse(JSON.stringify(data)))
            })
        }
    }
    controller.init(view,model)
}