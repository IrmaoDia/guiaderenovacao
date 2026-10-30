# Guia dos Rituais de Recomeço

Página de vendas em português do Brasil para o encerramento de 2026 e a preparação de 2027. O projeto continua em HTML, CSS e JavaScript, sem dependências ou etapa de build.

Abra `index.html` no navegador ou execute `powershell -File servir-local.ps1` e acesse `http://localhost:8080`.

- `index.html`: copy, seções, carrosséis e FAQ.
- `css/style.css`: design original, responsividade e apresentação das imagens.
- `js/offer-config.js`: configuração comercial editável.
- `js/main.js`: aplicação das condições confirmadas, navegação dos carrosséis e FAQ.

## Condições comerciais pendentes

Edite `js/offer-config.js` somente com informações reais da nova oferta:

- `price`, `currency`, `comparisonPrice` e `installments`: preço, moeda, referência comprovada e parcelamento. Sem preço configurado, a página orienta a consulta ao checkout e não apresenta desconto.
- `checkoutUrl`: configurado para `https://pay.wiapy.com/gwJVqHrFF-tu`. O `href` em HTML funciona como alternativa se o JavaScript não carregar; mantenha-o sincronizado se mudar o endereço. Uma string vazia na configuração desativa o botão quando o JavaScript está ativo.
- `guaranteeDays`: garantia de 7 dias, conforme a referência aprovada. O prazo é aplicado à seção de garantia e ao FAQ. O selo fornecido `garantia.png` foi convertido para `garantia-7dias.webp`.
- `deliveryConfirmed` e `deliveryText`: meio de entrega e instruções efetivamente configurados. O texto “Material digital • Compra segura” depende dessa confirmação e de uma URL HTTPS válida.
- `bonusesIncluded`: mantenha `false` até preparar e configurar a entrega dos três materiais. A página os apresenta como previstos enquanto a inclusão não estiver confirmada.
- `legalLinks`: URLs reais de Política de Privacidade, Termos de Uso e Contato. Links não configurados não são exibidos.

Não foram confirmados suporte individual, acesso vitalício, atualizações gratuitas ou descontos; essas promessas não são exibidas. O rastreamento existente e o identificador `begin_checkout` foram preservados. A validação local não comprova o funcionamento da compra nem da entrega na plataforma.

## Materiais visuais

O topo da hero exibe a frase “UM NOVO CICLO COMEÇA ANTES DA VIRADA”.

As imagens fornecidas `mockup2.png`, `bonusnv1.png`, `bonusnv2.png`, `bonusnv3.png` e `interface2.png` foram convertidas para WebP, preservando dimensões e transparência. A página usa os arquivos `.webp`; os PNGs originais foram removidos após a conversão. O mockup aparece imediatamente após o título da hero e nas apresentações do produto; os bônus usam suas respectivas imagens.

A interface é exibida por completo, com largura máxima de 300 px e proporção original preservada. O carrossel usa as cinco imagens fornecidas `carrossel01.png` a `carrossel05.png`, convertidas para WebP e padronizadas em 1024 × 1536 px. A primeira foi ajustada com corte na área decorativa superior para preencher a mesma proporção das demais, preservando o texto da página. Os PNGs originais foram removidos após a conversão. Confira os dados de fases lunares de 2027 antes de finalizar o calendário.

As quatro imagens de depoimentos fornecidas foram convertidas para `depoimento1.webp` a `depoimento4.webp`, preservando 1024 × 1536 px. O carrossel `#depoimentos` exibe as imagens completas no lugar dos antigos cards de situações, com setas, indicadores, teclado e gestos horizontais.

A pasta `imagens/` contém apenas os 15 arquivos WebP referenciados na página. Foram removidos 28 arquivos sem uso, incluindo os PNGs originais, a logo retirada da hero e as imagens da oferta anterior. A limpeza ficou restrita a essa pasta.

## Interações

O carrossel de depoimentos mantém setas, indicadores, teclado, gestos horizontais e roda do mouse. O carrossel de prévias mantém transição automática, setas, indicadores, teclado e gesto de deslizar. Ele pausa durante interação e respeita a preferência por movimento reduzido. O FAQ permite uma resposta aberta por vez.
