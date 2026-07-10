# Reanálise — Script Mínimo

Site simples e estático para montar o texto padrão do "Script Mínimo" com um clique.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `reanalise`).
2. Suba os 3 arquivos deste ZIP (`index.html`, `style.css`, `script.js`) para a raiz do repositório.
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde 1–2 minutos. O link ficará algo como:
   `https://SEU-USUARIO.github.io/reanalise/`

Pronto — o site já pode ser acessado e usado direto do celular ou computador, sem precisar de servidor.

## Como funciona

- Cada campo é selecionado clicando no botão da resposta desejada (clique de novo para desmarcar).
- O campo "Celular / Chave Pix" é digitado livremente.
- O texto no painel da direita é montado automaticamente, na ordem correta, conforme os campos são preenchidos.
- O botão **Copiar texto** copia o texto pronto para a área de transferência.
- O botão **Limpar tudo** reseta o formulário.

## Estrutura

```
index.html   -> estrutura do site
style.css    -> visual (fundo branco, fonte Poppins, verde claro + azul escuro)
script.js    -> lógica de montagem do texto e cópia
```
