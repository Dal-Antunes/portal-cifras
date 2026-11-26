# Portal de Cifras

Cifras do Ministério de Música Filhos de Maria e José, Comunidade São José.

Site: https://dal-antunes.github.io/portal-cifras/

Homologação (ramo `dev`): https://dal-antunes.github.io/portal-cifras/homolog/ · Para desenvolver, leia [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).

- Abra o link no celular e use **Adicionar à tela inicial**. Depois disso o portal funciona sem internet.
- Quando houver internet, o portal baixa sozinho a versão nova.
- As músicas oficiais mudam pela aprovação no próprio portal (veja abaixo), sem mexer nos arquivos.

## Arquivos

- `index.html`: o portal. As fontes (`vendor/fontes.css`) e o leitor de PDF (`vendor/pdf.js`, `vendor/pdf.worker.js`) ficam separados para o celular abrir rápido; o app guarda tudo no aparelho.
- Para quem quer um arquivo único sem o site, **Compartilhar → Gerar portal atualizado** monta um `portal-cifras.html` com tudo dentro, que abre direto do aparelho, sem internet.
- Ao mudar `vendor/fontes.css` ou o pdf.js, troque `LIBS` em `sw.js` para os aparelhos baixarem de novo.

## Aprovação de músicas

- Os membros editam ou adicionam uma música e tocam em **Enviar para aprovação** (precisa de internet).
- O coordenador entra com a conta Google em **Compartilhar → Modo coordenador**, vê a fila e toca em **Aprovar** ou **Recusar**.
- O que é aprovado vale para todos na próxima vez que abrirem o portal com internet, e continua disponível sem internet.
- Banco de dados: Firebase (plano gratuito). A configuração fica em `firebase-config.js` e as regras de segurança em `firestore.rules`.
