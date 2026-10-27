# GEO Audit Report: Gabriel Rabelo

**Data da auditoria:** 26/10/2026
**URL:** https://gabrielrabelo.dev (serve em https://www.gabrielrabelo.dev/)
**Tipo de negócio:** Serviços / consultoria individual (com foco local na Baixada Santista)
**Páginas analisadas:** 1 (o site inteiro é uma única página)

---

## Resumo executivo

**GEO Score geral: 38/100 (Crítico)**

A base técnica é boa: HTML renderizado no servidor (Astro), todos os crawlers de IA liberados, schema `ProfessionalService` com `sameAs` e área de atendimento. O problema não está no código, está na **existência da marca fora do site**: nem o domínio, nem o nome "Gabriel Rabelo" ligado a IA/automação, nem o handle `@GabrielRabeloIA` aparecem em busca. Para uma IA, você hoje não existe como entidade — e quando o nome é buscado, ela encontra outros Gabriel Rabelo (Goiânia, BH).

### Placar por categoria

| Categoria | Nota | Peso | Ponderado |
|---|---|---|---|
| Citabilidade para IA | 35/100 | 25% | 8,8 |
| Autoridade da marca | 10/100 | 20% | 2,0 |
| Conteúdo E-E-A-T | 45/100 | 20% | 9,0 |
| GEO técnico | 65/100 | 15% | 9,8 |
| Schema / dados estruturados | 55/100 | 10% | 5,5 |
| Presença em plataformas | 25/100 | 10% | 2,5 |
| **Total** | | | **37,6 → 38/100** |

### Chance de uma IA recomendar seus serviços hoje

| Pergunta que um cliente faria | Chance |
|---|---|
| "Quem faz agente de IA no WhatsApp em Santos?" | ~0–5% |
| "Automação com IA para pequena empresa na Baixada Santista" | ~0–5% |
| "Quem é Gabriel Rabelo, de automação com IA?" | ~10–20% (risco alto de confundir com homônimos) |
| Pergunta genérica nacional ("melhor dev de agentes de IA no Brasil") | ~0% |

Teste feito com buscas reais (o mesmo índice que ChatGPT Search, Perplexity e Claude usam para responder): o site não apareceu em nenhuma, nem em `site:gabrielrabelo.dev`. As respostas citaram YCloud, Digisac, AiSensy e Workana — portais com muitas páginas de conteúdo e citações de terceiros.

---

## Problemas críticos

1. **Site não indexado / invisível em busca.** `site:gabrielrabelo.dev` não retorna nada. Sem índice, IA com busca (ChatGPT, Perplexity, Gemini, AI Overviews) não tem o que citar.
   *Correção:* cadastrar no Google Search Console e Bing Webmaster Tools (o Bing alimenta ChatGPT e Copilot), enviar o sitemap e pedir indexação.
2. **Marca não reconhecida como entidade.** Zero menções de terceiros; homônimos dominam o nome.
   *Correção:* ver "Autoridade da marca" abaixo.

## Alta prioridade

3. **Canonical aponta para uma URL que redireciona.** `gabrielrabelo.dev` → **307 (temporário)** → `www.gabrielrabelo.dev`, mas `canonical`, `og:url`, sitemap, robots e `astro.config.mjs` usam a versão sem www. Sinal contraditório para o Google.
   *Correção:* escolher um host. O mais simples é deixar o apex como principal na Vercel (www → apex com 308) — o código já usa o apex.
4. **Site de uma página só.** Um único URL = uma única chance de bater com uma pergunta. Serviços, cases e cidades estão todos dentro de âncoras (`#cases`). Existe `src/pages/_servicos.astro` pronto, mas desativado pelo `_`.
5. **Sem `llms.txt`** (404).
6. **Nenhum bloco de pergunta e resposta.** IAs citam trechos que respondem diretamente uma pergunta ("Quanto custa um agente de WhatsApp?", "Quanto tempo leva?"). A página é toda em copy de venda.

## Média prioridade

7. **Cases sem prova verificável:** sem números concretos (antes/depois), sem links, sem depoimentos com nome. "Nike, ANBIMA, Jequiti" é forte, mas não há LinkedIn de terceiros/portfólio que confirme.
8. **Schema incompleto:** falta `Person` completo (jobTitle, worksFor anterior, `sameAs` próprio), `Service` para cada oferta, `FAQPage`, `WebSite`, e endereço/`geo` (cidade-base Santos) no `ProfessionalService`.
9. **Cidade de atuação só no rodapé** ("Baseado em Santos"). Nenhum texto de corpo diz "agentes de IA e automações para empresas de Santos e Baixada Santista".
10. **H3 duplicados** (os logos do carrossel repetem "ANBIMA Certificações", "Nike Membership"… 3x cada) — ruído para quem extrai a estrutura.

## Baixa prioridade

11. Sem cabeçalhos de segurança (CSP, X-Content-Type-Options, Referrer-Policy).
12. `og:image` genérica (`coding.png`) em vez de uma imagem com seu rosto/marca.
13. `/files/agente-pre-atendimento-whatsapp.md` também passa pelo 307.

---

## Detalhamento

### Citabilidade (35/100)
Bom: a seção "Como funciona" (15 min → proposta com preço fechado → entrega) e os 3 cases no formato Problema/Solução/Resultado são estruturados e extraíveis.
Fraco: quase nada responde a uma pergunta. Frases como "Tecnologia que gera caixa, reduz custo e economiza tempo" não são citáveis — não contêm fato.
Exemplo de reescrita citável:
> "Gabriel Rabelo é desenvolvedor de sistemas e agentes de IA em Santos (SP). Ex-engenheiro da Nike do Brasil por 8 anos, hoje cria agentes de WhatsApp, automações e sistemas sob medida para pequenas e médias empresas da Baixada Santista, com escopo e preço fechados."

### Autoridade da marca (10/100)
| Plataforma | Situação |
|---|---|
| YouTube @GabrielRabeloIA | Existe, mas não aparece em busca pelo handle |
| LinkedIn | Existe, não aparece em busca por nome + IA |
| GitHub gfrabelo | Existe, nome de usuário diferente da marca |
| Google Business Profile | Não encontrado |
| Reddit / fóruns / TabNews / dev.to | Nenhuma menção |
| Imprensa / diretórios locais | Nenhuma menção |
| Wikipedia / Wikidata | Não |

### E-E-A-T (45/100)
Pontos fortes reais: 8 anos, Nike/ANBIMA/Jequiti, cases com cliente pagante (Nexus, contrato de 1 ano), YouTube mostrando o trabalho. Falta tudo que comprove isso fora do seu próprio texto.

### GEO técnico (65/100)
✅ HTML renderizado no servidor · ✅ GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended recebem 200 · ✅ HTTPS + HSTS · ✅ `lang="pt-BR"`, meta description, OG/Twitter · ✅ 60/60 imagens com alt
❌ 307 apex→www contra canonical apex · ❌ sem llms.txt · ❌ sitemap com 1 URL

### Schema (55/100)
`ProfessionalService` com telefone, e-mail, `areaServed` (10 cidades), `knowsAbout`, `sameAs`. Faltam os tipos listados no item 8.

### Plataformas (25/100)
Uma página só, sem presença em Google Maps/Business Profile, sem conteúdo em plataformas que IAs citam (Reddit, LinkedIn artigos, TabNews, Medium).

---

## Quick wins (esta semana)

1. **Search Console + Bing Webmaster Tools**, enviar sitemap, pedir indexação. (Desbloqueia todo o resto.)
2. **Resolver www vs apex** na Vercel (redirect 308 para um host só, igual ao canonical).
3. **Criar Google Business Profile** em Santos ("Serviço de desenvolvimento de software") — é a fonte nº 1 para perguntas locais no Gemini/AI Overviews.
4. **Adicionar `public/llms.txt`** com quem você é, serviços, cidades, cases e contato.
5. **Adicionar uma seção FAQ** (6–8 perguntas reais: preço, prazo, "funciona na minha clínica?", "preciso de API oficial do WhatsApp?") + schema `FAQPage`.

## Plano de 30 dias

### Semana 1: Ser encontrado
- [ ] Search Console, Bing Webmaster, sitemap
- [ ] Redirect 308 único + canonical consistente
- [ ] llms.txt
- [ ] Google Business Profile

### Semana 2: Ter páginas que respondem perguntas
- [ ] Reativar `_servicos.astro` e quebrar em páginas próprias: `/agente-whatsapp`, `/automacao`, `/sistemas`
- [ ] Uma página por case (`/cases/aurea`, `/cases/nexus`, `/cases/odin`) com números
- [ ] Página `/santos` (ou `/baixada-santista`) com texto local de verdade
- [ ] Sitemap gerado automaticamente (`@astrojs/sitemap`)

### Semana 3: Schema e prova
- [ ] `Person` completo, `Service` por oferta, `FAQPage`, `WebSite`, endereço/geo
- [ ] 2–3 depoimentos com nome e empresa (também no Google Business Profile)
- [ ] Linkar o site na descrição de cada vídeo do YouTube e no LinkedIn

### Semana 4: Menções de terceiros
- [ ] Publicar 2 artigos no LinkedIn/TabNews contando um case (linkando o site)
- [ ] Cadastrar em diretórios (Workana, GetNinjas, associação comercial de Santos)
- [ ] Aparecer em 1 podcast/blog/evento local de empreendedorismo

---

## Apêndice: páginas analisadas

| URL | Título | Problemas |
|---|---|---|
| https://www.gabrielrabelo.dev/ | Sistemas, Automações e IA para Empresas \| Gabriel Rabelo | 10 |
| /robots.txt | — | 0 (libera tudo) |
| /sitemap.xml | — | 1 URL só |
| /llms.txt | — | 404 |
