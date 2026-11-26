# Como desenvolver no Portal de Cifras

| Ramo | Site | Banco de dados |
|---|---|---|
| `main` | https://dal-antunes.github.io/portal-cifras/ (oficial, usado pelo ministério) | Firebase `portal-cifras` (oficial) |
| `dev` | https://dal-antunes.github.io/portal-cifras/homolog/ (homologação) | `ambiente-homolog/firebase-config.js` (começa `null`) |

## Fluxo

1. Trabalhe no ramo `dev` (ou num ramo seu, saindo do `dev`, com pull request para o `dev`).
2. Cada push no `dev` publica a homologação em cerca de 1 a 2 minutos (Actions: "Homologação atualizada" e depois "Publicar site").
3. Quando estiver aprovado na homologação, abra um pull request **`dev` → `main`**. O Dal revisa e aprova; ao juntar, o oficial atualiza.
4. Não faça push direto no `main`.

## O que a homologação faz diferente (sem mudar nenhum arquivo do ramo)

Os arquivos de `dev` e `main` devem ser iguais depois do merge. As diferenças ficam por conta da publicação e do próprio código:

- O workflow `.github/workflows/pages.yml` monta o site com o `main` na raiz e o `dev` em `/homolog/`.
  Na homologação ele troca `firebase-config.js` por `ambiente-homolog/firebase-config.js` e o nome do app instalado por "Cifras TESTE".
- `index.html` vê `/homolog/` no endereço e então mostra a faixa **VERSÃO DE TESTE** e guarda os dados do aparelho com o prefixo `pct.` (o oficial usa `pc.`).
- `sw.js` usa caches `teste-cifras-*` na homologação, e o service worker oficial ignora tudo que está em `/homolog/`. Assim os dois convivem no mesmo celular.

## Banco de dados de teste (opcional)

Com `null`, a homologação funciona só no aparelho. Para testar aprovação, repertórios do ministério e Modo Ao Vivo:

1. Em https://console.firebase.google.com crie um projeto só de teste (ex.: `portal-cifras-homolog`).
2. Adicione um app da Web e cole o `firebaseConfig` em `ambiente-homolog/firebase-config.js` como `window.FIREBASE_CONFIG = {...}`. **Nunca** use a configuração do projeto `portal-cifras` aqui.
3. Firestore Database → Criar (modo produção). Em Regras, cole `firestore.rules` e publique.
4. Authentication → Google → Ativar. Em Configurações → Domínios autorizados, adicione `dal-antunes.github.io`.
5. Na homologação: Compartilhar → Modo coordenador → entrar com Google → "Tornar-me coordenador". A primeira conta vira o coordenador da homologação (não afeta o oficial).

As 230 músicas da base estão dentro do `index.html` (`<script id="dados-base">`), então a homologação já abre com elas.

## A cada versão

- Suba `VERSAO_APP` em `index.html` e `VERSAO` em `sw.js`, senão os celulares não baixam a versão nova.
- O arquivo único offline (`portal-cifras.html`) é gerado pelo próprio app em Compartilhar → Gerar portal atualizado.
- Regras do Firestore (`firestore.rules`) não são publicadas pelo GitHub: no oficial quem publica é o Dal, no console do Firebase.
