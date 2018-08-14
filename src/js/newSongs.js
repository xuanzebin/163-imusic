{
    let view={
        el:'#newSongs',
        init(){
            this.$el=$(this.el)
        },
        template:`新建歌曲`,
        render(data){
            $(this.el).html(this.template)
        },
        highLight(){
            this.$el.addClass('active')
        },  
        removeHighLight(){
            this.$el.removeClass('active')
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.view.render(this.model.data)
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub(){
            window.eventHub.on('new',(data)=>{
                this.view.highLight()
            })
            window.eventHub.on('selected',(data)=>{
                this.view.removeHighLight()
            })
        },
        bindEvents(){
            this.view.$el.on('click',(e)=>{
                window.eventHub.emit('new')
            })
        }
    }
    controller.init(view,model)
}