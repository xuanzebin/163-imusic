{
    let view={
        el:'main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <form>
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
                <label>封面地址：</label>
                <input name="cover" type="text" value="__cover__">
            </div>
            <div class="row">
                <label>歌词：</label>
                <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
            </div>
            <div class="row">
                <input type="submit" value="save"></button>
            </div>
        </form>
        `,
        render(data={}){
            let playholders=['name','singer','url','cover','lyrics']
            let html=this.template
            playholders.map((string)=>{
                html=html.replace(`__${string}__`,data[string]||'')
            })
            this.$el.html(html)
            if (data.id){
                this.$el.find('form').prepend('<h1>编辑歌曲</h1>')
            } else {
                this.$el.find('form').prepend('<h1>新建歌曲</h1>')
            }
        }
    }
    let model={
        data:{name:'',singer:'',url:'',cover:'',lyrics:''},
        save(){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            let {name,singer,url,cover,lyrics}=this.data
            song.set('name',name)
            song.set('singer',singer)
            song.set('url',url)
            song.set('cover',cover)
            song.set('lyrics',lyrics)
            return song.save().then(function (todo) {
                return todo
                console.log('保存成功')
            }, function (error) {
                console.error(error);
            });
        },
        edit(){
            // 第一个参数是 className，第二个参数是 objectId
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            let {name,singer,url,cover,lyrics}=this.data
            song.set('name',name)
            song.set('singer',singer)
            song.set('url',url)
            song.set('cover',cover)
            song.set('lyrics',lyrics)
            // 保存到云端
            return song.save().then((response)=>{
                console.log(response)
                return response
            })
        },
        resetData(){
            this.data={}
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('new',(data)=>{
                if (this.model.data.id && !data){
                    this.model.data={}
                } else {
                    this.model.data.id=''
                    Object.assign(this.model.data, data)
                }
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('selected',(data)=>{
                this.model.data=data
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if (this.model.data.id){
                    this.editSong()
                } else{
                    this.createSong()
                }
            })
        },
        createSong(){
            let needs='name singer url cover lyrics'.split(' ')
            let data={}
            needs.map((string)=>{
                if (string==='lyrics'){
                    data[string]=this.view.$el.find(`textarea[name=${string}]`).val()
                }else{
                    data[string]=this.view.$el.find(`input[name=${string}]`).val()
                }
            })
            this.model.data=data
            this.model.save().then((response)=>{
                this.model.data.id=response.id    
                let copyData=JSON.parse(JSON.stringify(this.model.data))
                window.eventHub.emit('create',copyData)
                this.model.resetData()
                this.view.render(this.model.data)
            })
        },
        editSong(){
            let needs='name singer url cover lyrics'.split(' ')
            let data={}
            needs.map((string)=>{
                if (string==='lyrics'){
                    data[string]=this.view.$el.find(`textarea[name=${string}]`).val()
                }else{
                    data[string]=this.view.$el.find(`input[name=${string}]`).val()
                }
            })
            Object.assign(this.model.data, data)
            console.log(this.model.data)
            this.model.edit().then((response)=>{
                let copyData=JSON.parse(JSON.stringify(this.model.data))
                window.eventHub.emit('updata',copyData)
            })
        }
    }
    controller.init(view,model)
}