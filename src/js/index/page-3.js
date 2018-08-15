{
    let view={
        el:'#page-3',
        init(){
            this.$el=$(this.el)
        },
        show(){
            console.log('show')
            this.$el.addClass('active')
        },
        hide(){
            console.log('hide')
            this.$el.removeClass('active')
        }
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('tabSwitch',(id)=>{
                console.log(id)
                if (id==='page-3'){
                    this.view.show()
                }else {
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}