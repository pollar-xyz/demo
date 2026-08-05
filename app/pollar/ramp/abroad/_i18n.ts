// Abroad i18n — kept in the feature folder so the tab's strings live with its
// code instead of interleaved in the shared dictionary
// (app/_i18n/translations.ts). Merged back there via spread per locale.

export const abroadNavLabel = "Abroad";

export const abroadEn = {
  abroad: {
    title: "Abroad — crypto to local payout",
    desc: "Quote, accept and settle a payout with Abroad: send USDC on-chain, the recipient gets COP or BRL in their bank account. Abroad is a plain REST API, so this tab talks to it directly instead of through a Pollar modal.",
    docsLabel: "Abroad API reference",

    notConfiguredTitle: "Abroad is not configured on this server",
    notConfiguredBody:
      "Set ABROAD_API_KEY in .env.local, then restart the dev server. The key is read server-side only — it never reaches the browser.",

    productionOnlyTitle: "Abroad has no sandbox",
    productionOnlyBody:
      "Every call here hits production and moves real money. This demo session is on Stellar testnet, so the payment step below cannot settle — switch to mainnet before sending, and start with small amounts.",

    keyNote:
      "Requests go to /api/abroad/* on this origin. That route holds ABROAD_API_KEY and forwards to api.abroad.finance — the key is never shipped to the browser.",

    stepQuote: "Quote",
    stepAccept: "Accept",
    stepSend: "Send funds",
    stepTrack: "Track",

    quote: {
      modeTarget: "Fiat the recipient gets",
      modeSource: "Crypto you send",
      modeTargetNote:
        "POST /quote — you name the payout, Abroad tells you the crypto to send.",
      modeSourceNote:
        "POST /quote/reverse — you name the crypto, Abroad tells you what lands.",
      amount: "Amount",
      currency: "Target currency",
      method: "Payment method",
      network: "Network",
      crypto: "Crypto",
      networkNote: "Where you'll send the funds from.",
      methodNote: "COP settles over BreB, BRL over Pix.",
      submit: "Get quote",
      busy: "Quoting…",
      quoteId: "quote_id",
      value: "value",
      valueTargetNote: "crypto to send",
      valueSourceNote: "fiat the recipient receives, after fees",
      expires: "Expires in",
      expired: "Expired — request a new quote",
    },

    accept: {
      needsQuote: "Get a quote first — the transaction locks it in.",
      intro:
        "Needs quote_id, user_id, and one of account_number or qr_code. The request also rejects unknown fields, so there is no bank_code to send — Abroad resolves the rail from the account itself.",
      oneOf: "(one of these two)",
      userId: "user_id",
      userIdNote: "Your own id for this user; it comes back on webhooks.",
      accountNumber: "account_number",
      accountNumberNote:
        "Recipient's real account or BreB key — Abroad verifies it against the rail, so an invented number returns 400.",
      taxId: "tax_id",
      taxIdNote: "Required by some rails (e.g. CPF for Pix).",
      qrCode: "qr_code",
      qrCodeNote: "Payload of a scanned Pix QR, instead of an account number.",
      submit: "Accept transaction",
      busy: "Accepting…",
      id: "id",
      reference: "transaction_reference",
      referenceNote: "What Abroad matches your deposit by.",
      kycTitle: "KYC required before this can settle",
      kycBody:
        "Abroad set kycRequired, so the user must verify their identity before the payout processes. Submission is POST /kyc — a multipart form with a document image, which this demo does not proxy. You can read the current state here.",
      kycCheck: "Check KYC status",
      kycBusy: "Checking…",
    },

    scan: {
      open: "Scan a Pix QR",
      close: "Close scanner",
      intro:
        "Point the camera at the code, paste the payload, or upload a screenshot. Whatever it reads goes into qr_code and is checked against Abroad right away.",
      modeCamera: "Camera",
      modePaste: "Paste / upload",
      cameraStart: "Start camera",
      cameraStop: "Stop camera",
      cameraHint: "The camera needs localhost or https, and your permission.",
      cameraDenied: "Camera unavailable — permission denied or already in use.",
      cameraUnsupported: "This browser exposes no camera API.",
      scanning: "Scanning…",
      pasteLabel: "Pix payload (copia e cola)",
      pastePh: "00020101…",
      pasteBtn: "Read payload",
      uploadBtn: "Upload image",
      decodeFailed: "No QR code found in that image.",
      decoding: "Reading the code…",
      decodedTitle: "QR is valid",
      stale:
        "This QR no longer resolves. A dynamic Pix QR carries a per-charge id and stops being valid once it is used or expires — ask the payee for a fresh one.",
      requote:
        "The amount and currency above were filled in from the QR. Quote again before accepting.",
    },

    send: {
      needsTransaction: "Accept a transaction first.",
      noContext:
        "Abroad returned no payment_context for this transaction, so there is nothing to pay yet — check the response on the right.",
      contextNote:
        "Every value below comes from payment_context on the accept response. Nothing here is configured locally.",
      address: "depositAddress",
      amount: "amount",
      chain: "blockchain",
      memo: "memo",
      mint: "mintAddress",
      mintIsIssuer: "the issuer, on Stellar",
      noIssuer:
        "payment_context carried no mintAddress, so there is no issuer to build the asset with. Pollar's /tx/build rejects a credit asset without one, so the payment is blocked here rather than sent to fail.",
      networkMismatch:
        "This payment is for Stellar {ctx}, but the session runs on the other network. Switch the network in the header before sending — building it here could never settle.",
      memoWarning:
        "The memo must be exactly this value. A payment without it cannot be matched to your transaction, and the funds are lost.",
      send: "Send with Pollar",
      busy: "Sending…",
      sent: "Payment submitted",
      manualNote:
        "Pollar signs Stellar here; on this chain, broadcast the transfer with your own wallet.",
      notifyNote:
        "payment_context.notify says this chain needs the hash reported before Abroad can claim the deposit.",
      onChainTx: "on_chain_tx",
      onChainTxPlaceholder: "Transaction hash / signature",
      notify: "Notify Abroad",
      notifyBusy: "Notifying…",
      notified: "Abroad notified",
    },

    track: {
      needsTransaction: "Accept a transaction first.",
      refresh: "Refresh status",
      busy: "Checking…",
      auto: "Poll every 5s",
      hash: "on_chain_tx_hash",
      statusAWAITING_PAYMENT: "Waiting for your on-chain deposit.",
      statusPROCESSING_PAYMENT:
        "Deposit seen — the local payout is on its way.",
      statusPAYMENT_COMPLETED: "The recipient has been paid.",
      statusPAYMENT_FAILED:
        "The payout failed (bad account or provider error).",
      statusPAYMENT_EXPIRED: "The quote expired before the funds arrived.",
      statusWRONG_AMOUNT:
        "Less arrived than was quoted — Abroad attempts an on-chain refund.",
    },

    requestTitle: "Current request",
    responseTitle: "Last response",
    responseEmpty: "Nothing yet — run a step on the left.",
    reset: "Start over",
  },
};

export type AbroadDictionary = typeof abroadEn;

export const abroadEs: AbroadDictionary = {
  abroad: {
    title: "Abroad — de cripto a pago local",
    desc: "Cotiza, acepta y liquida un pago con Abroad: envías USDC on-chain y quien recibe obtiene COP o BRL en su cuenta bancaria. Abroad es una API REST normal, así que esta pestaña habla directo con ella en vez de pasar por un modal de Pollar.",
    docsLabel: "Referencia de la API de Abroad",

    notConfiguredTitle: "Abroad no está configurado en este servidor",
    notConfiguredBody:
      "Define ABROAD_API_KEY en .env.local y reinicia el servidor. La clave se lee solo en el servidor: nunca llega al navegador.",

    productionOnlyTitle: "Abroad no tiene sandbox",
    productionOnlyBody:
      "Todas las llamadas van a producción y mueven dinero real. Esta sesión está en Stellar testnet, así que el paso de pago no puede liquidarse — cambia a mainnet antes de enviar y empieza con montos pequeños.",

    keyNote:
      "Las peticiones van a /api/abroad/* en este mismo origen. Esa ruta guarda ABROAD_API_KEY y reenvía a api.abroad.finance — la clave nunca se envía al navegador.",

    stepQuote: "Cotización",
    stepAccept: "Aceptar",
    stepSend: "Enviar fondos",
    stepTrack: "Seguimiento",

    quote: {
      modeTarget: "Fiat que recibe el destinatario",
      modeSource: "Cripto que envías",
      modeTargetNote:
        "POST /quote — indicas el pago y Abroad te dice cuánta cripto enviar.",
      modeSourceNote:
        "POST /quote/reverse — indicas la cripto y Abroad te dice cuánto llega.",
      amount: "Monto",
      currency: "Moneda destino",
      method: "Método de pago",
      network: "Red",
      crypto: "Cripto",
      networkNote: "Desde dónde enviarás los fondos.",
      methodNote: "COP se liquida por BreB; BRL, por Pix.",
      submit: "Cotizar",
      busy: "Cotizando…",
      quoteId: "quote_id",
      value: "value",
      valueTargetNote: "cripto a enviar",
      valueSourceNote: "fiat que recibe el destinatario, ya con comisiones",
      expires: "Expira en",
      expired: "Expirada — pide una cotización nueva",
    },

    accept: {
      needsQuote: "Primero cotiza — la transacción es la que fija ese precio.",
      intro:
        "Necesita quote_id, user_id y uno de account_number o qr_code. Además rechaza campos desconocidos, así que no hay bank_code que mandar: Abroad deduce el riel a partir de la cuenta.",
      oneOf: "(uno de los dos)",
      userId: "user_id",
      userIdNote: "Tu propio id para este usuario; vuelve en los webhooks.",
      accountNumber: "account_number",
      accountNumberNote:
        "Cuenta o llave BreB real del destinatario — Abroad la verifica contra el riel, así que un número inventado devuelve 400.",
      taxId: "tax_id",
      taxIdNote: "Obligatorio en algunos rieles (por ejemplo CPF para Pix).",
      qrCode: "qr_code",
      qrCodeNote:
        "Contenido de un QR Pix escaneado, en lugar del número de cuenta.",
      submit: "Aceptar transacción",
      busy: "Aceptando…",
      id: "id",
      reference: "transaction_reference",
      referenceNote: "Con esto Abroad reconoce tu depósito.",
      kycTitle: "Hace falta KYC antes de liquidar",
      kycBody:
        "Abroad marcó kycRequired, o sea que el usuario debe verificar su identidad antes de que el pago se procese. El envío es POST /kyc — un formulario multipart con la foto del documento, que esta demo no reenvía. Aquí puedes consultar el estado actual.",
      kycCheck: "Consultar estado de KYC",
      kycBusy: "Consultando…",
    },

    scan: {
      open: "Escanear un QR Pix",
      close: "Cerrar escáner",
      intro:
        "Apunta la cámara al código, pega el payload o sube una captura. Lo que lea va a qr_code y se verifica contra Abroad al instante.",
      modeCamera: "Cámara",
      modePaste: "Pegar / subir",
      cameraStart: "Encender cámara",
      cameraStop: "Apagar cámara",
      cameraHint: "La cámara necesita localhost o https, y tu permiso.",
      cameraDenied: "Cámara no disponible — permiso denegado o ya está en uso.",
      cameraUnsupported: "Este navegador no expone API de cámara.",
      scanning: "Escaneando…",
      pasteLabel: "Payload Pix (copia e cola)",
      pastePh: "00020101…",
      pasteBtn: "Leer payload",
      uploadBtn: "Subir imagen",
      decodeFailed: "No se encontró ningún QR en esa imagen.",
      decoding: "Leyendo el código…",
      decodedTitle: "El QR es válido",
      stale:
        "Este QR ya no resuelve. Un QR Pix dinámico lleva un id por cobro y deja de valer apenas se usa o expira — pídele uno nuevo a quien cobra.",
      requote:
        "El monto y la moneda de arriba se llenaron desde el QR. Vuelve a cotizar antes de aceptar.",
    },

    send: {
      needsTransaction: "Primero acepta una transacción.",
      noContext:
        "Abroad no devolvió payment_context para esta transacción, así que todavía no hay nada que pagar — revisa la respuesta de la derecha.",
      contextNote:
        "Todos los valores de abajo vienen del payment_context de la respuesta. Nada de esto se configura localmente.",
      address: "depositAddress",
      amount: "amount",
      chain: "blockchain",
      memo: "memo",
      mint: "mintAddress",
      mintIsIssuer: "el issuer, en Stellar",
      noIssuer:
        "El payment_context no trajo mintAddress, así que no hay issuer con el que armar el asset. El /tx/build de Pollar rechaza un asset de crédito sin issuer, así que el pago se bloquea aquí en vez de mandarse a fallar.",
      networkMismatch:
        "Este pago es para Stellar {ctx}, pero la sesión corre en la otra red. Cambia la red en el header antes de enviar: armarlo así no podría liquidar nunca.",
      memoWarning:
        "El memo tiene que ser exactamente este valor. Un pago sin él no se puede asociar a tu transacción y los fondos se pierden.",
      send: "Enviar con Pollar",
      busy: "Enviando…",
      sent: "Pago enviado",
      manualNote:
        "Pollar firma en Stellar; en esta cadena tienes que enviar la transferencia con tu propia billetera.",
      notifyNote:
        "payment_context.notify indica que esta cadena necesita que reportes el hash para que Abroad reclame el depósito.",
      onChainTx: "on_chain_tx",
      onChainTxPlaceholder: "Hash o firma de la transacción",
      notify: "Notificar a Abroad",
      notifyBusy: "Notificando…",
      notified: "Abroad notificado",
    },

    track: {
      needsTransaction: "Primero acepta una transacción.",
      refresh: "Actualizar estado",
      busy: "Consultando…",
      auto: "Consultar cada 5 s",
      hash: "on_chain_tx_hash",
      statusAWAITING_PAYMENT: "Esperando tu depósito on-chain.",
      statusPROCESSING_PAYMENT:
        "Depósito detectado — el pago local va en camino.",
      statusPAYMENT_COMPLETED: "El destinatario ya recibió el dinero.",
      statusPAYMENT_FAILED:
        "El pago falló (cuenta inválida o error del proveedor).",
      statusPAYMENT_EXPIRED:
        "La cotización expiró antes de que llegaran los fondos.",
      statusWRONG_AMOUNT:
        "Llegó menos de lo cotizado — Abroad intenta devolverlo on-chain.",
    },

    requestTitle: "Petición actual",
    responseTitle: "Última respuesta",
    responseEmpty: "Todavía nada — ejecuta un paso a la izquierda.",
    reset: "Empezar de nuevo",
  },
};

export const abroadPt: AbroadDictionary = {
  abroad: {
    title: "Abroad — de cripto a pagamento local",
    desc: "Cote, aceite e liquide um pagamento com a Abroad: você envia USDC on-chain e quem recebe fica com COP ou BRL na conta bancária. A Abroad é uma API REST comum, então esta aba fala direto com ela em vez de passar por um modal do Pollar.",
    docsLabel: "Referência da API da Abroad",

    notConfiguredTitle: "A Abroad não está configurada neste servidor",
    notConfiguredBody:
      "Defina ABROAD_API_KEY no .env.local e reinicie o servidor. A chave é lida apenas no servidor — nunca chega ao navegador.",

    productionOnlyTitle: "A Abroad não tem sandbox",
    productionOnlyBody:
      "Todas as chamadas vão para produção e movimentam dinheiro real. Esta sessão está na testnet da Stellar, então a etapa de pagamento não pode liquidar — mude para a mainnet antes de enviar e comece com valores pequenos.",

    keyNote:
      "As requisições vão para /api/abroad/* nesta mesma origem. Essa rota guarda a ABROAD_API_KEY e encaminha para api.abroad.finance — a chave nunca vai para o navegador.",

    stepQuote: "Cotação",
    stepAccept: "Aceitar",
    stepSend: "Enviar fundos",
    stepTrack: "Acompanhar",

    quote: {
      modeTarget: "Fiat que o destinatário recebe",
      modeSource: "Cripto que você envia",
      modeTargetNote:
        "POST /quote — você define o pagamento e a Abroad diz quanta cripto enviar.",
      modeSourceNote:
        "POST /quote/reverse — você define a cripto e a Abroad diz quanto chega.",
      amount: "Valor",
      currency: "Moeda de destino",
      method: "Método de pagamento",
      network: "Rede",
      crypto: "Cripto",
      networkNote: "De onde você vai enviar os fundos.",
      methodNote: "COP liquida via BreB; BRL, via Pix.",
      submit: "Cotar",
      busy: "Cotando…",
      quoteId: "quote_id",
      value: "value",
      valueTargetNote: "cripto a enviar",
      valueSourceNote: "fiat que o destinatário recebe, já com taxas",
      expires: "Expira em",
      expired: "Expirada — peça uma nova cotação",
    },

    accept: {
      needsQuote: "Cote primeiro — é a transação que trava esse preço.",
      intro:
        "Precisa de quote_id, user_id e um de account_number ou qr_code. Ela também rejeita campos desconhecidos, então não há bank_code para enviar: a Abroad deduz o trilho a partir da própria conta.",
      oneOf: "(um dos dois)",
      userId: "user_id",
      userIdNote: "Seu próprio id para este usuário; volta nos webhooks.",
      accountNumber: "account_number",
      accountNumberNote:
        "Conta ou chave BreB real do destinatário — a Abroad verifica no trilho, então um número inventado devolve 400.",
      taxId: "tax_id",
      taxIdNote: "Exigido por alguns trilhos (por exemplo, CPF no Pix).",
      qrCode: "qr_code",
      qrCodeNote: "Conteúdo de um QR Pix lido, no lugar do número da conta.",
      submit: "Aceitar transação",
      busy: "Aceitando…",
      id: "id",
      reference: "transaction_reference",
      referenceNote: "É por isso que a Abroad reconhece seu depósito.",
      kycTitle: "É preciso KYC antes de liquidar",
      kycBody:
        "A Abroad marcou kycRequired, ou seja, o usuário precisa verificar a identidade antes de o pagamento ser processado. O envio é POST /kyc — um formulário multipart com a imagem do documento, que esta demo não encaminha. Aqui você consulta o estado atual.",
      kycCheck: "Consultar status do KYC",
      kycBusy: "Consultando…",
    },

    scan: {
      open: "Ler um QR Pix",
      close: "Fechar leitor",
      intro:
        "Aponte a câmera para o código, cole o payload ou envie uma captura. O que for lido vai para qr_code e é verificado na Abroad na hora.",
      modeCamera: "Câmera",
      modePaste: "Colar / enviar",
      cameraStart: "Ligar câmera",
      cameraStop: "Desligar câmera",
      cameraHint: "A câmera precisa de localhost ou https, e da sua permissão.",
      cameraDenied: "Câmera indisponível — permissão negada ou já em uso.",
      cameraUnsupported: "Este navegador não expõe API de câmera.",
      scanning: "Lendo…",
      pasteLabel: "Payload Pix (copia e cola)",
      pastePh: "00020101…",
      pasteBtn: "Ler payload",
      uploadBtn: "Enviar imagem",
      decodeFailed: "Nenhum QR encontrado nessa imagem.",
      decoding: "Lendo o código…",
      decodedTitle: "O QR é válido",
      stale:
        "Este QR não resolve mais. Um QR Pix dinâmico carrega um id por cobrança e deixa de valer assim que é usado ou expira — peça um novo a quem cobra.",
      requote:
        "O valor e a moeda acima foram preenchidos pelo QR. Cote novamente antes de aceitar.",
    },

    send: {
      needsTransaction: "Aceite uma transação primeiro.",
      noContext:
        "A Abroad não devolveu payment_context para esta transação, então ainda não há o que pagar — veja a resposta à direita.",
      contextNote:
        "Todos os valores abaixo vêm do payment_context da resposta. Nada aqui é configurado localmente.",
      address: "depositAddress",
      amount: "amount",
      chain: "blockchain",
      memo: "memo",
      mint: "mintAddress",
      mintIsIssuer: "o issuer, na Stellar",
      noIssuer:
        "O payment_context não trouxe mintAddress, então não há issuer para montar o asset. O /tx/build do Pollar rejeita um asset de crédito sem issuer, então o pagamento é bloqueado aqui em vez de ser enviado para falhar.",
      networkMismatch:
        "Este pagamento é para a Stellar {ctx}, mas a sessão roda na outra rede. Troque a rede no cabeçalho antes de enviar: montar assim nunca liquidaria.",
      memoWarning:
        "O memo precisa ser exatamente este valor. Um pagamento sem ele não pode ser associado à sua transação e os fundos se perdem.",
      send: "Enviar com o Pollar",
      busy: "Enviando…",
      sent: "Pagamento enviado",
      manualNote:
        "O Pollar assina na Stellar; nesta rede, faça a transferência com sua própria carteira.",
      notifyNote:
        "payment_context.notify indica que esta rede exige o hash reportado para a Abroad reivindicar o depósito.",
      onChainTx: "on_chain_tx",
      onChainTxPlaceholder: "Hash ou assinatura da transação",
      notify: "Notificar a Abroad",
      notifyBusy: "Notificando…",
      notified: "Abroad notificada",
    },

    track: {
      needsTransaction: "Aceite uma transação primeiro.",
      refresh: "Atualizar status",
      busy: "Consultando…",
      auto: "Consultar a cada 5 s",
      hash: "on_chain_tx_hash",
      statusAWAITING_PAYMENT: "Aguardando seu depósito on-chain.",
      statusPROCESSING_PAYMENT:
        "Depósito detectado — o pagamento local está a caminho.",
      statusPAYMENT_COMPLETED: "O destinatário já foi pago.",
      statusPAYMENT_FAILED:
        "O pagamento falhou (conta inválida ou erro do provedor).",
      statusPAYMENT_EXPIRED: "A cotação expirou antes de os fundos chegarem.",
      statusWRONG_AMOUNT:
        "Chegou menos do que o cotado — a Abroad tenta devolver on-chain.",
    },

    requestTitle: "Requisição atual",
    responseTitle: "Última resposta",
    responseEmpty: "Nada ainda — execute um passo à esquerda.",
    reset: "Começar de novo",
  },
};
