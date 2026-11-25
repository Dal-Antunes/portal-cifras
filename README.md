# Portal de Cifras

Cifras do Ministério de Música Filhos de Maria e José, Comunidade São José.

Site: https://dal-antunes.github.io/portal-cifras/

- Abra o link no celular e use **Adicionar à tela inicial**. Depois disso o portal funciona sem internet.
- Quando houver internet, o portal baixa sozinho a versão nova.
- Para atualizar as músicas oficiais: no portal, em **Compartilhar → Modo coordenador**, use **Gerar portal atualizado** e substitua o arquivo `index.html` deste repositório pelo arquivo gerado.

O arquivo `index.html` também funciona sozinho, aberto direto do aparelho, sem internet.

## Aprovação de músicas

- Os membros editam ou adicionam uma música e tocam em **Enviar para aprovação** (precisa de internet).
- O coordenador entra com a conta Google em **Compartilhar → Modo coordenador**, vê a fila e toca em **Aprovar** ou **Recusar**.
- O que é aprovado vale para todos na próxima vez que abrirem o portal com internet, e continua disponível sem internet.
- Banco de dados: Firebase (plano gratuito). A configuração fica em `firebase-config.js` e as regras de segurança em `firestore.rules`.
