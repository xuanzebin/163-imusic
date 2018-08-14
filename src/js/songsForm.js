{
    let view={
        el:'main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <form>
            <h1>编辑新建歌曲</h1>
            <div class="row">
                <label>歌曲：</label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>歌手：</label>
                <input name="singer" type="text"  value="__singer__">
            </div>
            <div class="row">
                <label>外链地址：</label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row">
                <input type="submit" value="save"></button>
            </div>
        </form>
        `,
        render(data){
            let playholders=['name','singer','url']
            let html=this.template
            playholders.map((string)=>{
                html=html.replace(`__${string}__`,data[string])
            })
            $(this.el).html(html)
        }
    }
    let model={
        data:{name:'',singer:'',url:''}
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload',(data)=>{
                this.model.data.name=data.name
                this.model.data.url=data.url
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                this.createSong()
                this.saveSong()
            })
        },
        createSong(){
            let needs='name singer url'.split(' ')
            let data={}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`input[name=${string}]`).val()
            })
            this.model.data=data
            let copyData=JSON.parse(JSON.stringify(this.model.data))
            window.eventHub.emit('create',copyData)
        },
        saveSong(){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            let {name,singer,url}=this.model.data
            song.set('name',name)
            song.set('singer',singer)
            song.set('url',url)
            song.save().then(function (todo) {
                alert('保存成功')
            }, function (error) {
              console.error(error);
            });
        }
    }
    controller.init(view,model)
}