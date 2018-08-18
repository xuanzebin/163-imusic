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
            this.$el.find('.coverWrapper').css('background-image',`url(${data.cover})`)
            this.$el.find('.backgroundCover').css('background-image',`url(${data.cover})`)
            this.$el.find('.song-description>h1').text(data.name)
            this.$el.append(this.template)
        },
        playSong(){
            this.$el.find('#play').removeClass('active')
            this.$el.find('#coverWrapper').addClass('active')
            this.$el.find('audio')[0].play()
        },
        pauseSong(){
            this.$el.find('#play').addClass('active')
            this.$el.find('#coverWrapper').removeClass('active')
            this.$el.find('audio')[0].pause()
        }
    }
    let model={
        data:{},
        findSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((response)=>{
                let {id,attributes}=response
                return Object.assign({id},attributes)
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
                console.log('response')
                console.log(response)
                this.model.data=response
                this.view.render(this.model.data)
                this.view.$el.find('audio')[0].onended=()=>{
                    this.view.pauseSong()
                }
                let array=response.lyrics.split('\n')
                let regex=/\[([\d:.]+)\](.+)/
                array.map((value)=>{
                    let lyrics=value.match(regex)
                    let time=lyrics[1].split(':')
                    let minute=time[0]
                    let second=parseFloat(time[1],10)+parseInt(minute,10)*60
                    let content=lyrics[2]
                    let p=document.createElement('p')
                    p.setAttribute('data-time',second)
                    p.textContent=content
                    this.view.$el.find('.lines').append(p)
                })
                this.view.$el.find('audio')[0].ontimeupdate=(e)=>{
                    this.slideLyrics(e.currentTarget.currentTime)
                }
            })
            this.bindEvents()
        },
        slideLyrics(currentTime){
            let allP=this.view.$el.find('.lines>p')
            for (let i=0;i<allP.length;i++){
                if ( i === allP.length-1 ){
                    let linesHeight=this.view.$el.find('.lines').offset().top
                    let pHeight=allP.eq(i).offset().top
                    this.view.$el.find('.lines').css('transform',`translateY(-${allP[i].textContent,pHeight-linesHeight-24}px)`)
                    allP.eq(i).addClass('active').siblings().removeClass('active')
                } else {
                    let previousTime=allP.eq(i).attr('data-time')
                    let nextTime=allP.eq(i+1).attr('data-time')
                    if(currentTime>=previousTime &&　currentTime<nextTime){
                        let linesHeight=this.view.$el.find('.lines').offset().top
                        let pHeight=allP.eq(i).offset().top
                        this.view.$el.find('.lines').css('transform',`translateY(-${allP[i].textContent,pHeight-linesHeight-24}px)`)
                        allP.eq(i).addClass('active').siblings().removeClass('active')
                        break
                    }
                }
            }
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
                    this.recordTransform()
                    this.view.pauseSong()
                }
            })
        },
        recordTransform(){
            let coverTransform=this.view.$el.find('.coverWrapper').css('transform')
            let coverWrapperTransform=this.view.$el.find('.coverWrapperParent').css('transform')
            let transformDeg=coverWrapperTransform==='none'?coverTransform:coverTransform.concat(' ',coverWrapperTransform)
            this.view.$el.find('.coverWrapperParent').css('transform',transformDeg)
        }
    }
    controller.init(view,model)
}