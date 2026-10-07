// Signer rotation i18n — kept in the feature folder so the tab's strings live
// with its code instead of interleaved in the shared dictionary
// (app/_i18n/translations.ts). Merged back there via spread per locale.

export const signerRotationNavLabel = {
  en: "Signer rotation",
  es: "Rotación de signer",
  pt: "Rotação de signer",
};

export const signerRotationEn = {
  signerRotation: {
    title: "Sponsored signer rotation",
    subtitle:
      "Add a new key as signer of the account and set the master key to weight 0, keeping the same G... address. The app pays the 0.5 XLM reserve and the fee.",

    testnetOnlyTitle: "Testnet only",
    testnetOnlyBody:
      "The Demo key adapter keeps its secret in plain localStorage, so it is only registered on testnet. Switch the network toggle to testnet.",

    gateTitle: "Log in with Demo key",
    gateBody:
      "Freighter and the Stellar Wallets Kit wallets can only sign with their master key: once the rotation sets it to weight 0, you lose access to the account. This page only runs with the Demo key adapter, which can switch to the new key.",
    gateLogin: "Log in with Demo key",

    refresh: "Refresh",
    resultTitle: "Result",
    empty: "—",
    running: "Running…",

    statusTitle: "a. Status",
    statusDesc:
      "The account address never changes. The active key is the one that signs now. Signers are read from Horizon testnet.",
    accountAddress: "Account address",
    activeKey: "Active key",
    pendingKey: "Pending key",
    retiredKeys: "Retired keys",
    xlm: "XLM",
    thresholds: "Thresholds (low / med / high)",
    notCreated: "Not on the network yet: create the account first.",
    signers: "On-chain signers",
    master: "master",
    active: "active",
    retired: "retired",

    createTitle: "b. Create the account",
    createDesc:
      "client.createAccount(): the app sponsors the account, which is created with 0 XLM. The Demo key adds the new account's signature.",
    createBtn: "Create account",

    grantTitle: "c. Grant the rotation",
    grantSteps: [
      "In Treasury > Sponsorship, turn on Sponsor signer rotations and its Include external wallets option.",
      "In Users > Accounts, open the row menu (…) of this user and pick Allow sponsored signer rotation.",
      "A grant covers one rotation. The next rotation needs a new grant.",
    ],
    grantNote:
      "Grants are given from the dashboard or from your backend. The server-api secret key never goes in the browser.",

    rotateTitle: "d. Rotate the signer",
    rotateDesc:
      "Generates a new key, builds the rotation (POST /wallet/signer/build), signs it with the ACTIVE key and submits it. Keys from earlier rotations that are still signers are removed in the same transaction.",
    rotateBtn: "Rotate signer",
    rotateNoAccount: "The account does not exist on the network yet.",
    rotateNoStore: "No Demo key on this device.",

    newLoginTitle: "e. Log in with the new key",
    newLoginDesc:
      "Logs out and logs in again with Demo key, which now signs the SEP-10 challenge with the new key. It must land on the same user.",
    newLoginBtn: "Log out and log in",

    oldLoginTitle: "f. Try to log in with an old key",
    oldLoginDesc:
      "Signs the login with a retired key, then restores the active key and logs back in. Expected: the old key fails (401 on /auth/wallet).",
    oldLoginBtn: "Try old key",
    oldLoginKey: "Retired key",
    oldLoginNoHistory: "No retired keys yet: rotate first.",

    errors: {
      SIGNER_ROTATION_NOT_GRANTED:
        "This user has no rotation grant, or it was already spent. Grant one in Users > Accounts > … > Allow sponsored signer rotation.",
      SIGNER_ROTATION_NOT_ENABLED:
        "The app does not sponsor rotations. Turn on Sponsor signer rotations and Include external wallets in Treasury > Sponsorship.",
      SIGNER_ROTATION_PENDING:
        "A rotation was already built and not submitted. It expires 5 minutes after the build: wait and try again.",
      SIGNER_ROTATION_INVALID:
        "The server rejected the rotation. See details below.",
    },
    unknownError: "The request failed.",
  },
};

type SignerRotationStrings = typeof signerRotationEn;

export const signerRotationEs: SignerRotationStrings = {
  signerRotation: {
    title: "Rotación de signer patrocinada",
    subtitle:
      "Agrega una clave nueva como signer de la cuenta y pone la master key en weight 0, manteniendo la misma dirección G.... La app paga la reserva de 0.5 XLM y el fee.",

    testnetOnlyTitle: "Solo testnet",
    testnetOnlyBody:
      "El adapter Demo key guarda su secreto en localStorage sin cifrar, así que solo se registra en testnet. Cambia la red a testnet.",

    gateTitle: "Entra con Demo key",
    gateBody:
      "Freighter y las wallets de Stellar Wallets Kit solo firman con su master key: cuando la rotación la pone en weight 0, pierdes el acceso a la cuenta. Esta página solo funciona con el adapter Demo key, que puede pasar a firmar con la clave nueva.",
    gateLogin: "Entrar con Demo key",

    refresh: "Actualizar",
    resultTitle: "Resultado",
    empty: "—",
    running: "Ejecutando…",

    statusTitle: "a. Estado",
    statusDesc:
      "La dirección de la cuenta no cambia nunca. La clave activa es la que firma ahora. Los signers se leen de Horizon testnet.",
    accountAddress: "Dirección de la cuenta",
    activeKey: "Clave activa",
    pendingKey: "Clave pendiente",
    retiredKeys: "Claves retiradas",
    xlm: "XLM",
    thresholds: "Thresholds (low / med / high)",
    notCreated: "Todavía no existe en la red: crea la cuenta primero.",
    signers: "Signers on-chain",
    master: "master",
    active: "activa",
    retired: "retirada",

    createTitle: "b. Crear la cuenta",
    createDesc:
      "client.createAccount(): la app patrocina la cuenta, que nace con 0 XLM. Demo key agrega la firma de la cuenta nueva.",
    createBtn: "Crear cuenta",

    grantTitle: "c. Otorgar la rotación",
    grantSteps: [
      "En Treasury > Sponsorship, activa Sponsor signer rotations y su opción Include external wallets.",
      "En Users > Accounts, abre el menú (…) de este usuario y elige Allow sponsored signer rotation.",
      "Un permiso cubre una rotación. La siguiente necesita un permiso nuevo.",
    ],
    grantNote:
      "El permiso se da desde el dashboard o desde tu backend. La secret key de server-api nunca va en el navegador.",

    rotateTitle: "d. Rotar el signer",
    rotateDesc:
      "Genera una clave nueva, construye la rotación (POST /wallet/signer/build), la firma con la clave ACTIVA y la envía. Las claves de rotaciones anteriores que sigan como signer se quitan en la misma transacción.",
    rotateBtn: "Rotar signer",
    rotateNoAccount: "La cuenta todavía no existe en la red.",
    rotateNoStore: "No hay Demo key en este dispositivo.",

    newLoginTitle: "e. Entrar con la clave nueva",
    newLoginDesc:
      "Cierra sesión y vuelve a entrar con Demo key, que ahora firma el desafío SEP-10 con la clave nueva. Tiene que entrar al mismo usuario.",
    newLoginBtn: "Cerrar sesión y entrar",

    oldLoginTitle: "f. Probar a entrar con una clave vieja",
    oldLoginDesc:
      "Firma el login con una clave retirada, luego restaura la clave activa y vuelve a entrar. Esperado: la clave vieja falla (401 en /auth/wallet).",
    oldLoginBtn: "Probar clave vieja",
    oldLoginKey: "Clave retirada",
    oldLoginNoHistory: "Todavía no hay claves retiradas: rota primero.",

    errors: {
      SIGNER_ROTATION_NOT_GRANTED:
        "Este usuario no tiene permiso de rotación, o ya lo usó. Otórgalo en Users > Accounts > … > Allow sponsored signer rotation.",
      SIGNER_ROTATION_NOT_ENABLED:
        "La app no patrocina rotaciones. Activa Sponsor signer rotations e Include external wallets en Treasury > Sponsorship.",
      SIGNER_ROTATION_PENDING:
        "Ya hay una rotación construida sin enviar. Vence 5 minutos después de construirla: espera y vuelve a intentar.",
      SIGNER_ROTATION_INVALID:
        "El servidor rechazó la rotación. Mira los detalles abajo.",
    },
    unknownError: "La solicitud falló.",
  },
};

export const signerRotationPt: SignerRotationStrings = {
  signerRotation: {
    title: "Rotação de signer patrocinada",
    subtitle:
      "Adiciona uma chave nova como signer da conta e coloca a master key em weight 0, mantendo o mesmo endereço G.... O app paga a reserva de 0.5 XLM e a taxa.",

    testnetOnlyTitle: "Somente testnet",
    testnetOnlyBody:
      "O adapter Demo key guarda o segredo em localStorage sem criptografia, por isso só é registrado na testnet. Mude a rede para testnet.",

    gateTitle: "Entre com Demo key",
    gateBody:
      "Freighter e as wallets do Stellar Wallets Kit só assinam com a master key: quando a rotação a coloca em weight 0, você perde o acesso à conta. Esta página só funciona com o adapter Demo key, que pode passar a assinar com a chave nova.",
    gateLogin: "Entrar com Demo key",

    refresh: "Atualizar",
    resultTitle: "Resultado",
    empty: "—",
    running: "Executando…",

    statusTitle: "a. Estado",
    statusDesc:
      "O endereço da conta nunca muda. A chave ativa é a que assina agora. Os signers são lidos do Horizon testnet.",
    accountAddress: "Endereço da conta",
    activeKey: "Chave ativa",
    pendingKey: "Chave pendente",
    retiredKeys: "Chaves aposentadas",
    xlm: "XLM",
    thresholds: "Thresholds (low / med / high)",
    notCreated: "Ainda não existe na rede: crie a conta primeiro.",
    signers: "Signers on-chain",
    master: "master",
    active: "ativa",
    retired: "aposentada",

    createTitle: "b. Criar a conta",
    createDesc:
      "client.createAccount(): o app patrocina a conta, que nasce com 0 XLM. O Demo key adiciona a assinatura da conta nova.",
    createBtn: "Criar conta",

    grantTitle: "c. Conceder a rotação",
    grantSteps: [
      "Em Treasury > Sponsorship, ative Sponsor signer rotations e a opção Include external wallets.",
      "Em Users > Accounts, abra o menu (…) deste usuário e escolha Allow sponsored signer rotation.",
      "Uma permissão cobre uma rotação. A próxima precisa de uma permissão nova.",
    ],
    grantNote:
      "A permissão é dada pelo dashboard ou pelo seu backend. A secret key do server-api nunca vai para o navegador.",

    rotateTitle: "d. Rotacionar o signer",
    rotateDesc:
      "Gera uma chave nova, constrói a rotação (POST /wallet/signer/build), assina com a chave ATIVA e envia. As chaves de rotações anteriores que ainda são signers são removidas na mesma transação.",
    rotateBtn: "Rotacionar signer",
    rotateNoAccount: "A conta ainda não existe na rede.",
    rotateNoStore: "Não há Demo key neste dispositivo.",

    newLoginTitle: "e. Entrar com a chave nova",
    newLoginDesc:
      "Sai e entra de novo com Demo key, que agora assina o desafio SEP-10 com a chave nova. Tem que entrar no mesmo usuário.",
    newLoginBtn: "Sair e entrar",

    oldLoginTitle: "f. Tentar entrar com uma chave antiga",
    oldLoginDesc:
      "Assina o login com uma chave aposentada, depois restaura a chave ativa e entra de novo. Esperado: a chave antiga falha (401 em /auth/wallet).",
    oldLoginBtn: "Testar chave antiga",
    oldLoginKey: "Chave aposentada",
    oldLoginNoHistory: "Ainda não há chaves aposentadas: rotacione primeiro.",

    errors: {
      SIGNER_ROTATION_NOT_GRANTED:
        "Este usuário não tem permissão de rotação, ou já a usou. Conceda em Users > Accounts > … > Allow sponsored signer rotation.",
      SIGNER_ROTATION_NOT_ENABLED:
        "O app não patrocina rotações. Ative Sponsor signer rotations e Include external wallets em Treasury > Sponsorship.",
      SIGNER_ROTATION_PENDING:
        "Já existe uma rotação construída e não enviada. Ela expira 5 minutos após a construção: espere e tente de novo.",
      SIGNER_ROTATION_INVALID:
        "O servidor rejeitou a rotação. Veja os detalhes abaixo.",
    },
    unknownError: "A requisição falhou.",
  },
};
