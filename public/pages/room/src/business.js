// intersecção entre a tela e a lógica que está acontecendo
// usuário novo faz uma call não chamamos uma classe externa, será resolvido com essa classe com regra de negócios

class Business {
    constructor ({ room, media, view, socketBuilder }) {
        this.room = room
        this.media = media
        this.view = view

        this.socketBuilder = socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onUserDisconnected())
            .build()
        
        this.socketBuilder.emit('join-room', this.room, 'teste01')

        // um evento, nosso arquivo nesse momento
        // camera ligada, ativa, mostra na tela
        this.currentStream = {}        
    }
    //método estático (citado abaixo) que vai receber todas as dependencias necessárias para passar no construtor
    //método inicializador a partir de um membro estático
    static initialize(deps) {
        const instance = new Business(deps)
        return instance._init()
    }
    // método privado que inicializa tudo que é dependencia da classe, registrar os eventos, mas quem for chamar a business vai chamar pelo médoto estático que vai criar esssa instancia
    async _init() {
        this.currentStream = await this.media.getCamera()
        this.addVideoStream('test01')
    }

    addVideoStream(userId, stream = this.currentStream){
        const isCurrentId = false
        this.view.renderVideo({
            userId,
            stream,
            isCurrentId
        })
    }

    onUserConnected = function() {
        return userId =>
        console.log('user connected', userId)
    }

    onUserDisconnected = function() {
        return userId =>
        console.log('user disconnected', userId)
    }
}