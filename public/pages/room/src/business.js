// intersecção entre a tela e a lógica que está acontecendo
// usuário novo faz uma call não chamamos uma classe externa, será resolvido com essa classe com regra de negócios

class Business {
    constructor ({ room, media, view, socketBuilder, peerBuilder }) {
        this.room = room
        this.media = media
        this.view = view

        this.socketBuilder = socketBuilder
        this.peerBuilder = peerBuilder
        
        this.socket = {}
        this.currentStream = {}  
        this.currentPeer = {}
        
        this.peers = new Map()
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
        this.socket = this.socketBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onUserDisconnected())
            .build()
        
        this.currentPeer = await this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnCallReceived(this.onPeerCallReceived())
            .setOnPeerStreamReceived(this.onPeerStreamReceived())
            .build()

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
        return userId => {
        console.log('user connected', userId)
        this.currentPeer.call(userId, this.currentStream)
      }
    }

    onUserDisconnected = function() {
        return userId => {
        console.log('user disconnected', userId)
      }
    }

    onPeerError = function () {
        return error => {
            console.error('error on peer!', error)
        }
    }

    onPeerConnectionOpened = function () {
        return (peer) => {
            const id = peer.id
            console.log('peerr!', peer)
            this.socket.emit('join-room', this.room, id)
        }
    }
    onPeerCallReceived = function () {
        return call => {
            console.log('answering call', call)
            call.answer(this.currentStream)
        }
    }

    onPeerStreamReceived = function () {
        return (call, stream) => {
            const callerId = call.peer
            this.addVideoStream(callerId, stream)
            this.peers.set(callerId, { call })
            
            this.view.setParticipants(this.peers.size)
        }
    }
}