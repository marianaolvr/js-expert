//funcao de timeout com promise para resolver bug do preview do vídeo.
//Quando dá um play e ele não terminou de carregar, dá erro
//Essa função faz ele esperar um pouquinho?
//Outra solução seria acumular o evento sobre ele
//para controlar o vídeo

class Util {
    static sleep(ms) {
        return new Promise(r => setTimeout(r, ms))
    }
}