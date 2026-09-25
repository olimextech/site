# Olimex – site estático

Site institucional da **Olimex Assessoria de Vendas** (representação de auto peças), recriado como site estático para o GitHub Pages a partir do conteúdo de <https://www.olimex.com.br/>.

## Estrutura

```
index.html          # página única: empresa, representadas, cotação e contato
404.html            # página de erro do GitHub Pages
assets/css/style.css
assets/js/main.js   # menu mobile, animações e envio do formulário de cotação
assets/img/         # logo, imagem do hero e logos das representadas
.nojekyll           # serve os arquivos sem processamento Jekyll
```

Sem build e sem dependências: HTML, CSS e JavaScript puros.

## Rodando localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicando no GitHub Pages

1. Envie o repositório para o GitHub.
2. Em **Settings → Pages**, selecione *Deploy from a branch*, branch `main`, pasta `/ (root)`.
3. Para usar um domínio próprio (ex.: `www.olimex.com.br`), crie um arquivo `CNAME` com o domínio e configure o DNS conforme a [documentação do GitHub](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Formulário de cotação

O GitHub Pages não executa código no servidor, então o formulário monta a mensagem e a abre no **WhatsApp** ou no **cliente de e-mail** do visitante. O número e o e-mail de destino ficam no topo de `assets/js/main.js`.

Para receber os envios diretamente por e-mail, é possível trocar por um serviço como Formspree ou Web3Forms.

## Atualizando representadas

Cada marca é um `<article class="brand-card">` em `index.html`. Coloque o logo em `assets/img/brands/` e copie um card existente.
