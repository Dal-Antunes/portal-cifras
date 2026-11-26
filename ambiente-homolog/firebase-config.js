// Configuração do Firebase usada SÓ na homologação (dal-antunes.github.io/portal-cifras/homolog/).
// O GitHub Actions copia este arquivo por cima do firebase-config.js ao publicar o ramo dev.
// null = homologação sem banco de dados: tudo fica só no aparelho e nada chega aos dados oficiais.
// Para testar a nuvem, cole aqui a configuração de um projeto Firebase DE TESTE (veja DESENVOLVIMENTO.md).
// Nunca cole aqui a do projeto "portal-cifras".
window.FIREBASE_CONFIG = null;
