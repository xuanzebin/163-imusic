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
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                alert(1)
            })
        }
    }
    controller.init(view,model)
}