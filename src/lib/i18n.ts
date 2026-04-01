export type Lang = "en" | "es";

export const defaultLang: Lang = "es";

export const companyGroups = [
  {
    key: "surveillance" as const,
    ids: [
      "palantir",
      "clearview-ai",
      "babel-street",
      "vigilant-solutions",
      "shadowdragon",
      "giant-oak",
      "penlink",
    ],
  },
  {
    key: "dataBrokers" as const,
    ids: ["thomson-reuters", "lexisnexis", "venntel"],
  },
  {
    key: "platforms" as const,
    ids: ["amazon", "google", "meta", "microsoft"],
  },
  {
    key: "telecom" as const,
    ids: ["att", "verizon", "tmobile", "sandvine"],
  },
] as const;

export const companySpanishNotes: Record<string, string> = {
  palantir: "Analiza datos para investigaciones y vigilancia migratoria.",
  "clearview-ai": "Usa reconocimiento facial hecho con fotos tomadas de internet.",
  "thomson-reuters": "Vende bases de datos para localizar personas y revisar historiales.",
  lexisnexis: "Combina registros de vivienda, empleo y contacto para búsquedas de personas.",
  amazon: "Ofrece nube, video y reconocimiento facial usado por autoridades.",
  "babel-street": "Usa datos de ubicación de apps y monitoreo de redes sociales.",
  "vigilant-solutions": "Rastrea vehículos con lectores de placas y bases de datos de viajes.",
  shadowdragon: "Monitorea redes sociales y conexiones digitales.",
  "giant-oak": "Analiza redes sociales y perfiles con sistemas automatizados.",
  google: "Recopila ubicación, búsqueda, correo y actividad de apps.",
  meta: "Recopila redes sociales, mensajes, fotos y metadatos.",
  microsoft: "Combina nube, correo y datos de perfiles profesionales.",
  sandvine: "Puede inspeccionar tráfico de internet y metadatos de comunicación.",
  venntel: "Vende datos de ubicación de celulares obtenidos por apps.",
  penlink: "Analiza comunicaciones, redes sociales y transacciones.",
  att: "Comparte datos de ubicación y registros de telefonía.",
  verizon: "Comparte datos de ubicación, navegación y uso móvil.",
  tmobile: "Comparte ubicación, identificadores del dispositivo y datos de uso.",
};

export const t = {
  en: {
    metaTitle: "OptOut - Immigrant Data Rights",
    metaDescription:
      "Generate CCPA and CPRA privacy rights letters for companies that collect, profile, or sell your data. No accounts. No analytics. No server-side storage of your information.",
    appName: "OptOut",
    skipToContent: "Skip to main content",
    languagePrompt: "Choose your language / Elige tu idioma",
    languageHelp:
      "Pick the language you want to read the tool in. Proper company names stay in English.",
    languageToggleLabel: "Change language",
    langLabel: "English",
    otherLang: "Español",
    languageEnglish: "English",
    languageSpanish: "Español",
    navHome: "Home",
    navGenerate: "Generate letter",
    navGuide: "Legal guide",
    homeTagline: "Privacy rights letters for people targeted by AI surveillance.",
    homeSubtitle:
      "A calm, step-by-step tool to help you ask companies to disclose, delete, correct, and stop sharing your data.",
    explanationTitle: "Before you start",
    explanationIntro:
      "This tool helps you create a privacy rights letter under California law.",
    whatItIsTitle: "What this tool is",
    whatItIsBody:
      "It generates legal letters asking companies to disclose, delete, correct, or stop sharing your personal data.",
    whatItDoesTitle: "What it does",
    whatItDoesBody:
      "You choose the companies, we draft the letter, and you send it yourself by email or privacy portal.",
    whatItDoesNotTitle: "What it does not do",
    whatItDoesNotItems: [
      "It does not send emails for you.",
      "It does not provide legal advice.",
      "It does not store the information you type.",
      "It does not guarantee that a company will comply.",
    ],
    whoItsForTitle: "Who it is for",
    whoItsForBody:
      "It is for anyone whose data may be collected by AI surveillance companies, especially immigrants and families affected by monitoring, profiling, or data brokerage.",
    disclaimerTitle: "Not legal advice",
    disclaimerBody:
      "This tool is based on published California privacy laws. It is not a lawyer and does not create an attorney-client relationship.",
    toolTitle: "Create your letter",
    toolSubtitle:
      "Work through the steps below. Nothing is sent until you choose to send it.",
    companySectionTitle: "1. Choose companies",
    companySectionHint:
      "Select every company you want to contact. Company names stay in English because they are legal and business names.",
    companySelectedCount:
      "{count} company selected",
    companySelectedCountPlural:
      "{count} companies selected",
    selectAll: "Select all",
    clearSelection: "Clear selection",
    companyGroupSurveillance: "Surveillance and analytics",
    companyGroupSurveillanceHint:
      "Companies tied to facial recognition, case management, social monitoring, or policing tools.",
    companyGroupDataBrokers: "Data brokers and people-search tools",
    companyGroupDataBrokersHint:
      "Companies that buy, combine, or resell records used to find people.",
    companyGroupPlatforms: "Large platforms and cloud companies",
    companyGroupPlatformsHint:
      "Companies with broad consumer data collection that can support tracking or profiling.",
    companyGroupTelecom: "Telecom and network data companies",
    companyGroupTelecomHint:
      "Phone, location, and internet traffic companies tied to data sharing or surveillance.",
    noEmail: "No public privacy email",
    noEmailShort: "Portal only",
    rightsSectionTitle: "2. Choose your rights",
    rightsSectionHint:
      "The strongest requests are already selected. You can add or remove rights.",
    deadlineLabel: "Deadline",
    infoSectionTitle: "3. Add your information",
    infoSectionHint:
      "Your name and email are used only to fill the letter in your browser.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full legal name",
    email: "Email address",
    emailPlaceholder: "name@example.com",
    generate: "Generate letter",
    generateFor: "Generate letter for {count} companies",
    generatedLetterTitle: "Your letter",
    generatedLetterHint:
      "Review the text, then copy it, download it, or open your email app.",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    openEmail: "Open email draft",
    letterPreviewLabel: "Generated privacy rights letter",
    deliveryTitle: "How to send it",
    deliveryBody:
      "Send the letter yourself. Use the company privacy email when available, or the privacy portal link when email is not listed.",
    bccExplain:
      "BCC sends the letter to each company without revealing the other email addresses. The message is addressed to you, and each company receives a private copy.",
    noEmailWarning: "These companies usually require portal submission instead of email:",
    sentCheckbox: "I sent this letter",
    sentCheckboxHelp:
      "Check this only after you have actually sent the letter. It starts the 45-day reminder cookie on this device.",
    startCountdown: "Start 45-day countdown",
    markedSent: "45-day countdown started",
    countdownTitle: "Your deadline tracker",
    countdownDaysLeft: "{count} days left",
    countdownDayLeft: "{count} day left",
    countdownSentOn: "Sent on",
    countdownDeadline: "Deadline",
    countdownHelp:
      "Companies usually must respond within 45 calendar days. If they do not, this page helps you prepare complaints.",
    companiesNotified: "Companies notified",
    overdueTitle: "Deadline passed",
    overdueBody:
      "The 45-day response window ended {count} days ago for at least one company.",
    overdueSectionTitle: "Choose the companies that did not respond",
    overdueSectionHint:
      "We will prepare a complaint letter for the companies you mark here.",
    generateComplaint: "Generate complaint letter",
    complaintTitle: "Complaint letter",
    complaintHint:
      "Use this letter when filing with the California Privacy Protection Agency and the California Attorney General.",
    complaintPreviewLabel: "Generated complaint letter",
    fileCPPA: "File with the California Privacy Protection Agency",
    fileCPPANote: "Online complaint form",
    fileAG: "File with the California Attorney General",
    fileAGNote: "Consumer complaint form",
    startOver: "Start over",
    footerTagline: "Immigrant data rights tool",
    footerBody:
      "This tool does not collect, store, or transmit the information you type. It is not legal advice. For additional immigration or privacy help, you can contact NILC, ACLU, or EFF.",
    resourcesTitle: "Support resources",
    guideTitle: "Legal guide",
    guideSubtitle:
      "Understand the deadlines, delivery options, and complaint steps before or after you send a request.",
    guideKnowRightsTitle: "Know your rights",
    guideKnowRightsBody1:
      "The California Consumer Privacy Act and California Privacy Rights Act apply to businesses that do business in California. The company obligation matters here, not where you live.",
    guideKnowRightsBody2:
      "Many companies in this tool meet the law’s thresholds because they operate in California, collect large amounts of personal information, or both.",
    guideDeadlinesTitle: "Key deadlines",
    guideDeadlinesItems: [
      "45 calendar days for requests to know, delete, correct, and many profiling-related requests.",
      "15 business days for opt-out of sale or sharing and limiting sensitive personal information.",
      "A company can ask for one 45-day extension, but it must tell you within the first 45 days.",
    ],
    guideDeliveryTitle: "How to send your letter",
    guideDeliveryEmailTitle: "Email",
    guideDeliveryEmailBody:
      "Send the letter to the company privacy email and keep a copy in your sent folder.",
    guideDeliveryPortalTitle: "Privacy portal",
    guideDeliveryPortalBody:
      "If a company uses a web form instead of email, paste the letter there and save a screenshot.",
    guideDeliveryMailTitle: "Certified mail",
    guideDeliveryMailBody:
      "Certified mail can help if you want stronger proof of delivery.",
    guideTrackerTitle: "Deadline checker",
    guideTrackerHint:
      "Enter the date you sent your request to see whether the company is still within the response period.",
    sentDate: "Date sent",
    trackerStatusOverdue: "Overdue by {count} days",
    trackerStatusRemaining: "{count} days remaining",
    trackerSent: "Sent",
    trackerDeadline: "Deadline",
    trackerOverdueHelp:
      "If the company has not responded and the deadline has passed, you can prepare a complaint below.",
    complaintGeneratorTitle: "Complaint generator",
    complaintGeneratorHint:
      "Use this after the company misses the legal deadline.",
    companyLabel: "Company",
    companyPlaceholder: "Select a company",
    rightsRequested: "Rights you requested",
    complaintDateLabel: "Date you sent the original letter",
    generateComplaintAction: "Generate complaint",
    filingTitle: "How to file a complaint",
    filingStepOneTitle: "Step 1: File with the CPPA",
    filingStepOneBody:
      "Include your original request, proof you sent it, and the complaint letter.",
    filingStepOneItems: [
      "Fill out the online form.",
      "Attach your original privacy request letter.",
      "Attach proof of delivery or submission.",
      "Attach the complaint letter generated here.",
    ],
    filingStepTwoTitle: "Step 2: File with the Attorney General",
    filingStepTwoBody:
      "You can submit the same documents to the California Attorney General consumer complaint form.",
    filingStepTwoItems: [
      "Identify the company clearly.",
      "Include the date you sent your original request.",
      "State that the legal deadline passed without a sufficient response.",
    ],
    filingStepThreeTitle: "Step 3: Keep records",
    filingStepThreeItems: [
      "Save copies of your original letter, screenshots, email receipts, and complaints.",
      "Write down dates and deadlines.",
      "Remember that these agencies enforce the law for the public; they do not become your lawyer.",
    ],
    resourcesListTitle: "Organizations that may help",
    resourcesPageTitle: "More resources",
    resourcesPageIntro:
      "OptOut helps with privacy rights letters, but support, security, and broker opt-outs often matter too.",
    resourcesDataBrokerTitle: "Data broker opt-outs",
    resourcesDataBrokerBody:
      "Guides and registries for removing personal data from brokers that sell information to law enforcement or immigration agencies.",
    resourcesImmigrantTitle: "Immigrant data rights and advocacy",
    resourcesImmigrantBody:
      "Organizations documenting surveillance and defending immigrant privacy rights.",
    resourcesSecurityTitle: "Digital security and privacy",
    resourcesSecurityBody:
      "Practical guides for people who may face higher surveillance risk.",
    resourcesWhyTitle: "Why this matters",
    resourcesWhyItems: [
      "AI surveillance companies combine public records, social media, location data, license plate readers, and other records into tools used to locate and profile people.",
      "Using your CCPA and CPRA rights is one step. Data broker opt-outs, secure communications, and understanding your digital footprint can help too.",
      "You do not need to do everything at once. Start with the letter, then use the resources that fit your situation.",
    ],
    resourceAclu: "ACLU Immigrants' Rights Project",
    resourceNilc: "National Immigration Law Center",
    resourceEff: "Electronic Frontier Foundation",
    resourceNip: "National Immigration Project",
    changeLanguage: "Change language",
    statusReady: "Ready to generate a letter.",
    statusLetterGenerated: "Letter generated and ready to review.",
    statusComplaintGenerated: "Complaint letter generated and ready to review.",
    ariaSelectAllCompanies: "Select all companies",
    ariaClearCompanies: "Clear company selection",
    ariaCopyLetter: "Copy generated letter",
    ariaDownloadLetter: "Download generated letter",
    ariaOpenEmail: "Open an email draft with the generated letter",
    ariaCopyComplaint: "Copy complaint letter",
    ariaDownloadComplaint: "Download complaint letter",
    ariaStartCountdown: "Start the 45-day countdown reminder",
    ariaStartOver: "Clear the deadline tracker and start over",
  },
  es: {
    metaTitle: "OptOut - Derechos sobre tus datos",
    metaDescription:
      "Genera cartas de privacidad bajo CCPA y CPRA para empresas que recopilan, perfilan o venden tus datos. Sin cuentas. Sin analítica. Sin guardar tu información en el servidor.",
    appName: "OptOut",
    skipToContent: "Saltar al contenido principal",
    languagePrompt: "Choose your language / Elige tu idioma",
    languageHelp:
      "Elige el idioma en que quieres usar la herramienta. Los nombres oficiales de las empresas se mantienen en inglés.",
    languageToggleLabel: "Cambiar idioma",
    langLabel: "Español",
    otherLang: "English",
    languageEnglish: "English",
    languageSpanish: "Español",
    navHome: "Inicio",
    navGenerate: "Generar carta",
    navGuide: "Guía legal",
    homeTagline: "Cartas de derechos de privacidad para personas afectadas por vigilancia con IA.",
    homeSubtitle:
      "Una herramienta tranquila y paso a paso para pedir que las empresas revelen, eliminen, corrijan y dejen de compartir tus datos.",
    explanationTitle: "Antes de empezar",
    explanationIntro:
      "Esta herramienta te ayuda a crear una carta de derechos de privacidad bajo la ley de California.",
    whatItIsTitle: "Qué es esta herramienta",
    whatItIsBody:
      "Genera cartas legales para pedir que las empresas revelen, eliminen, corrijan o dejen de compartir tu información personal.",
    whatItDoesTitle: "Qué hace",
    whatItDoesBody:
      "Tú eliges las empresas, nosotros redactamos la carta y tú la envías por correo electrónico o portal de privacidad.",
    whatItDoesNotTitle: "Qué no hace",
    whatItDoesNotItems: [
      "No envía correos por ti.",
      "No ofrece asesoría legal.",
      "No guarda la información que escribes.",
      "No garantiza que una empresa vaya a cumplir.",
    ],
    whoItsForTitle: "Para quién es",
    whoItsForBody:
      "Es para cualquier persona cuyos datos puedan ser recopilados por empresas de vigilancia con IA, especialmente inmigrantes y familias afectadas por monitoreo, perfiles o corredores de datos.",
    disclaimerTitle: "No es asesoría legal",
    disclaimerBody:
      "Esta herramienta se basa en leyes públicas de privacidad de California. No sustituye a una abogada o abogado y no crea una relación abogado-cliente.",
    toolTitle: "Crea tu carta",
    toolSubtitle:
      "Sigue los pasos abajo. Nada se envía hasta que tú decidas enviarlo.",
    companySectionTitle: "1. Elige empresas",
    companySectionHint:
      "Selecciona cada empresa que quieres contactar. Los nombres de las empresas se quedan en inglés porque son nombres legales y comerciales.",
    companySelectedCount: "{count} empresa seleccionada",
    companySelectedCountPlural: "{count} empresas seleccionadas",
    selectAll: "Seleccionar todas",
    clearSelection: "Borrar selección",
    companyGroupSurveillance: "Vigilancia y analítica",
    companyGroupSurveillanceHint:
      "Empresas ligadas a reconocimiento facial, monitoreo social, herramientas policiales o gestión de casos.",
    companyGroupDataBrokers: "Corredores de datos y buscadores de personas",
    companyGroupDataBrokersHint:
      "Empresas que compran, combinan o revenden registros para localizar personas.",
    companyGroupPlatforms: "Plataformas grandes y empresas de nube",
    companyGroupPlatformsHint:
      "Empresas con gran recopilación de datos del consumidor que puede apoyar rastreo o perfiles.",
    companyGroupTelecom: "Telecomunicaciones y datos de red",
    companyGroupTelecomHint:
      "Empresas de telefonía, ubicación e internet ligadas a compartir datos o vigilancia.",
    noEmail: "Sin correo público de privacidad",
    noEmailShort: "Solo portal",
    rightsSectionTitle: "2. Elige tus derechos",
    rightsSectionHint:
      "Las solicitudes más fuertes ya están seleccionadas. Puedes agregar o quitar derechos.",
    deadlineLabel: "Plazo",
    infoSectionTitle: "3. Agrega tu información",
    infoSectionHint:
      "Tu nombre y correo solo se usan para llenar la carta dentro de tu navegador.",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Tu nombre legal completo",
    email: "Correo electrónico",
    emailPlaceholder: "nombre@ejemplo.com",
    generate: "Generar carta",
    generateFor: "Generar carta para {count} empresas",
    generatedLetterTitle: "Tu carta",
    generatedLetterHint:
      "Revisa el texto y luego cópialo, descárgalo o ábrelo en tu aplicación de correo.",
    copy: "Copiar",
    copied: "Copiado",
    download: "Descargar",
    openEmail: "Abrir borrador de correo",
    letterPreviewLabel: "Carta de derechos de privacidad generada",
    deliveryTitle: "Cómo enviarla",
    deliveryBody:
      "Tú misma o tú mismo envías la carta. Usa el correo de privacidad cuando exista o el portal de privacidad si no aparece un correo.",
    bccExplain:
      "BCC o copia oculta envía la carta a cada empresa sin revelar las otras direcciones. El mensaje va dirigido a ti y cada empresa recibe una copia privada.",
    noEmailWarning: "Estas empresas normalmente requieren envío por portal en lugar de correo:",
    sentCheckbox: "Ya envié esta carta",
    sentCheckboxHelp:
      "Marca esto solo después de enviarla de verdad. Eso inicia la cookie de recordatorio de 45 días en este dispositivo.",
    startCountdown: "Iniciar recordatorio de 45 días",
    markedSent: "Se inició el recordatorio de 45 días",
    countdownTitle: "Seguimiento del plazo",
    countdownDaysLeft: "Quedan {count} días",
    countdownDayLeft: "Queda {count} día",
    countdownSentOn: "Enviada el",
    countdownDeadline: "Fecha límite",
    countdownHelp:
      "Las empresas normalmente deben responder dentro de 45 días calendario. Si no responden, esta página te ayuda a preparar quejas.",
    companiesNotified: "Empresas notificadas",
    overdueTitle: "El plazo ya pasó",
    overdueBody:
      "La ventana de respuesta de 45 días terminó hace {count} días para al menos una empresa.",
    overdueSectionTitle: "Elige las empresas que no respondieron",
    overdueSectionHint:
      "Prepararemos una carta de queja para las empresas que marques aquí.",
    generateComplaint: "Generar carta de queja",
    complaintTitle: "Carta de queja",
    complaintHint:
      "Usa esta carta al presentar una queja ante la Agencia de Protección de Privacidad de California y la Fiscalía General de California.",
    complaintPreviewLabel: "Carta de queja generada",
    fileCPPA: "Presentar con la Agencia de Protección de Privacidad de California",
    fileCPPANote: "Formulario de queja en línea",
    fileAG: "Presentar con la Fiscalía General de California",
    fileAGNote: "Formulario de queja del consumidor",
    startOver: "Empezar de nuevo",
    footerTagline: "Herramienta de derechos sobre datos para inmigrantes",
    footerBody:
      "Esta herramienta no recopila, guarda ni transmite la información que escribes. No es asesoría legal. Para ayuda adicional sobre inmigración o privacidad, puedes contactar a NILC, ACLU o EFF.",
    resourcesTitle: "Recursos de apoyo",
    guideTitle: "Guía legal",
    guideSubtitle:
      "Entiende los plazos, las formas de envío y los pasos para presentar una queja antes o después de enviar tu solicitud.",
    guideKnowRightsTitle: "Conoce tus derechos",
    guideKnowRightsBody1:
      "La California Consumer Privacy Act y la California Privacy Rights Act se aplican a empresas que hacen negocios en California. Aquí importa la obligación de la empresa, no dónde vives.",
    guideKnowRightsBody2:
      "Muchas empresas de esta herramienta cumplen con los umbrales de la ley porque operan en California, recopilan grandes cantidades de información personal o ambas cosas.",
    guideDeadlinesTitle: "Plazos clave",
    guideDeadlinesItems: [
      "45 días calendario para solicitudes de conocer, eliminar, corregir y muchas solicitudes relacionadas con perfiles.",
      "15 días hábiles para dejar de vender o compartir datos y para limitar información personal sensible.",
      "La empresa puede pedir una sola extensión de 45 días, pero debe avisarte dentro de los primeros 45 días.",
    ],
    guideDeliveryTitle: "Cómo enviar tu carta",
    guideDeliveryEmailTitle: "Correo electrónico",
    guideDeliveryEmailBody:
      "Envía la carta al correo de privacidad de la empresa y guarda una copia en tu carpeta de enviados.",
    guideDeliveryPortalTitle: "Portal de privacidad",
    guideDeliveryPortalBody:
      "Si la empresa usa un formulario web en vez de correo, pega ahí la carta y guarda una captura de pantalla.",
    guideDeliveryMailTitle: "Correo certificado",
    guideDeliveryMailBody:
      "El correo certificado puede ayudarte si quieres una prueba de entrega más fuerte.",
    guideTrackerTitle: "Verificador de plazo",
    guideTrackerHint:
      "Ingresa la fecha en que enviaste tu solicitud para ver si la empresa sigue dentro del periodo de respuesta.",
    sentDate: "Fecha de envío",
    trackerStatusOverdue: "Vencido por {count} días",
    trackerStatusRemaining: "Quedan {count} días",
    trackerSent: "Enviado",
    trackerDeadline: "Fecha límite",
    trackerOverdueHelp:
      "Si la empresa no respondió y el plazo ya pasó, puedes preparar una queja abajo.",
    complaintGeneratorTitle: "Generador de queja",
    complaintGeneratorHint:
      "Úsalo después de que la empresa pierda el plazo legal.",
    companyLabel: "Empresa",
    companyPlaceholder: "Selecciona una empresa",
    rightsRequested: "Derechos que solicitaste",
    complaintDateLabel: "Fecha en que enviaste la carta original",
    generateComplaintAction: "Generar queja",
    filingTitle: "Cómo presentar una queja",
    filingStepOneTitle: "Paso 1: Presenta con la CPPA",
    filingStepOneBody:
      "Incluye tu solicitud original, prueba de que la enviaste y la carta de queja.",
    filingStepOneItems: [
      "Llena el formulario en línea.",
      "Adjunta tu carta original de solicitud de privacidad.",
      "Adjunta prueba de entrega o envío.",
      "Adjunta la carta de queja generada aquí.",
    ],
    filingStepTwoTitle: "Paso 2: Presenta con la Fiscalía General",
    filingStepTwoBody:
      "Puedes enviar los mismos documentos al formulario de queja del consumidor de la Fiscalía General de California.",
    filingStepTwoItems: [
      "Identifica claramente la empresa.",
      "Incluye la fecha en que enviaste la solicitud original.",
      "Explica que el plazo legal venció sin una respuesta suficiente.",
    ],
    filingStepThreeTitle: "Paso 3: Guarda tus registros",
    filingStepThreeItems: [
      "Guarda copias de tu carta original, capturas de pantalla, recibos de correo y quejas.",
      "Anota fechas y plazos.",
      "Recuerda que estas agencias hacen cumplir la ley para el público; no se convierten en tu abogada o abogado.",
    ],
    resourcesListTitle: "Organizaciones que pueden ayudar",
    resourcesPageTitle: "Más recursos",
    resourcesPageIntro:
      "OptOut ayuda con cartas de derechos de privacidad, pero el apoyo, la seguridad digital y las exclusiones de corredores de datos también importan.",
    resourcesDataBrokerTitle: "Exclusiones de corredores de datos",
    resourcesDataBrokerBody:
      "Guías y registros para eliminar datos personales de corredores que venden información a autoridades o agencias migratorias.",
    resourcesImmigrantTitle: "Derechos de datos y defensa para inmigrantes",
    resourcesImmigrantBody:
      "Organizaciones que documentan la vigilancia y defienden la privacidad de las comunidades inmigrantes.",
    resourcesSecurityTitle: "Seguridad digital y privacidad",
    resourcesSecurityBody:
      "Guías prácticas para personas que pueden enfrentar mayor riesgo de vigilancia.",
    resourcesWhyTitle: "Por qué importa",
    resourcesWhyItems: [
      "Las empresas de vigilancia con IA combinan registros públicos, redes sociales, datos de ubicación, lectores de placas y otros registros en herramientas para localizar y perfilar personas.",
      "Usar tus derechos bajo CCPA y CPRA es un paso. También pueden ayudar las exclusiones de corredores de datos, las comunicaciones seguras y entender tu huella digital.",
      "No tienes que hacerlo todo de una vez. Empieza con la carta y luego usa los recursos que mejor se ajusten a tu situación.",
    ],
    resourceAclu: "Proyecto de Derechos de los Inmigrantes de la ACLU",
    resourceNilc: "National Immigration Law Center",
    resourceEff: "Electronic Frontier Foundation",
    resourceNip: "National Immigration Project",
    changeLanguage: "Cambiar idioma",
    statusReady: "Lista para generar una carta.",
    statusLetterGenerated: "La carta fue generada y está lista para revisar.",
    statusComplaintGenerated: "La carta de queja fue generada y está lista para revisar.",
    ariaSelectAllCompanies: "Seleccionar todas las empresas",
    ariaClearCompanies: "Borrar la selección de empresas",
    ariaCopyLetter: "Copiar la carta generada",
    ariaDownloadLetter: "Descargar la carta generada",
    ariaOpenEmail: "Abrir un borrador de correo con la carta generada",
    ariaCopyComplaint: "Copiar la carta de queja",
    ariaDownloadComplaint: "Descargar la carta de queja",
    ariaStartCountdown: "Iniciar el recordatorio de 45 días",
    ariaStartOver: "Borrar el seguimiento del plazo y empezar de nuevo",
  },
} as const;

export type Translation = (typeof t)[Lang];

export function formatCopy(
  template: string,
  values: Record<string, string | number>
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}
