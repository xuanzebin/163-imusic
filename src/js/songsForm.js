{
    let view={
        el:'main',
        template:`
        <form>
            <h1>编辑新建歌曲</h1>
            <div class="row">
                <label>歌曲：</label>
                <input name="name" type="text">
            </div>
            <div class="row">
                <label>歌手：</label>
                <input name="singer" type="text">
            </div>
            <div class="row">
                <label>外链地址：</label>
                <input name="url" type="text">
            </div>
            <div class="row">
                <input type="submit" value="save"></button>
            </div>
        </form>
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