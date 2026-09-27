export type SiteLocale = 'en' | 'es' | 'pt';
export type SitePage = 'about' | 'privacy' | 'terms' | 'contact';

export type SiteLink = {
  label: string;
  href: string;
};

export type SiteSection = {
  heading: string;
  paragraphs: string[];
  links?: SiteLink[];
};

export type SitePageContent = {
  title: string;
  description: string;
  intro: string;
  updated?: string;
  sections: SiteSection[];
};

export const siteLocales: SiteLocale[] = ['en', 'es', 'pt'];

export function toSiteLocale(locale: string): SiteLocale {
  return siteLocales.includes(locale as SiteLocale) ? (locale as SiteLocale) : 'en';
}

export const footerCopy: Record<SiteLocale, {
  about: string;
  privacy: string;
  terms: string;
  contact: string;
  disclaimer: string;
  rights: string;
}> = {
  en: {
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    disclaimer: 'NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.',
    rights: 'Independent catalog made for the Minecraft community.',
  },
  es: {
    about: 'Acerca de',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    disclaimer: 'NO ES UN SERVICIO OFICIAL DE MINECRAFT. NO ESTÁ APROBADO NI ASOCIADO CON MOJANG O MICROSOFT.',
    rights: 'Catálogo independiente creado para la comunidad de Minecraft.',
  },
  pt: {
    about: 'Sobre',
    privacy: 'Privacidade',
    terms: 'Termos',
    contact: 'Contato',
    disclaimer: 'NÃO É UM SERVIÇO OFICIAL DO MINECRAFT. NÃO É APROVADO NEM ASSOCIADO À MOJANG OU À MICROSOFT.',
    rights: 'Catálogo independente feito para a comunidade de Minecraft.',
  },
};

const pages: Record<SiteLocale, Record<SitePage, SitePageContent>> = {
  en: {
    about: {
      title: 'About Guizzprints',
      description: 'Learn how Guizzprints organizes and presents Minecraft community content.',
      intro: 'Guizzprints is an independent catalog built to help Minecraft players discover add-ons, textures, shaders, maps, skins, and community tools.',
      sections: [
        {
          heading: 'What we do',
          paragraphs: [
            'We organize community creations into clear categories and provide useful details such as screenshots, compatibility information, installation guidance, and the creator or source when that information is available.',
            'Our goal is to make discovery and downloading easier without pretending that third-party files belong to Guizzprints.',
          ],
        },
        {
          heading: 'Content and review',
          paragraphs: [
            'Catalog entries should have a meaningful title, an original description, working media, a valid category, and a functional destination. Incomplete or misleading entries may be corrected, unpublished, or removed.',
            'A verification label describes our own catalog and link checks; it is not a guarantee that every third-party file is risk-free. Players should keep their device and Minecraft installation protected and review the destination before downloading.',
          ],
        },
        {
          heading: 'Independent community project',
          paragraphs: [
            'Guizzprints is not an official Minecraft product or service and is not approved by or associated with Mojang or Microsoft. Minecraft names, artwork, and related trademarks belong to their respective owners.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'How Guizzprints handles account, preference, and usage data.',
      intro: 'This policy explains what information Guizzprints processes, why it is used, and the choices available to visitors and account holders.',
      updated: 'Last updated: September 17, 2026',
      sections: [
        {
          heading: 'Information we process',
          paragraphs: [
            'When you create or use an account, we process information such as your email address, username, authentication session, favorites, ratings, and language preference. If you choose Google sign-in, Google shares basic account details needed to create the Guizzprints account; we do not request Gmail or Drive access or store Google refresh tokens. We may also process download counts and security or diagnostic records needed to operate and protect the service.',
            'Do not submit sensitive personal information in usernames, descriptions, or other public fields.',
          ],
        },
        {
          heading: 'How we use information',
          paragraphs: [
            'We use information to authenticate accounts, save preferences, provide favorites and ratings, protect downloads, prevent abuse, diagnose failures, understand aggregate usage, and improve site speed and content.',
          ],
        },
        {
          heading: 'Service providers and external sites',
          paragraphs: [
            'Guizzprints uses Supabase for account and database services and Vercel for hosting, anonymous web analytics, and performance measurements. Downloads may be delivered by external storage providers, whose own terms and privacy policies then apply.',
          ],
        },
        {
          heading: 'Cookies and local storage',
          paragraphs: [
            'Essential cookies or browser storage may be used for login sessions, security, and saved preferences. Vercel Web Analytics is configured as a privacy-focused, cookie-free analytics service.',
          ],
        },
        {
          heading: 'Sharing, retention, and security',
          paragraphs: [
            'We do not sell account information. Data may be shared with service providers only as needed to run the site, comply with law, investigate abuse, or protect users and the service.',
            'Information is kept only as long as reasonably needed for the purposes described here, legal obligations, security, and dispute resolution. We use access controls and other safeguards, but no internet service can promise absolute security.',
          ],
        },
        {
          heading: 'Your choices and requests',
          paragraphs: [
            'You can change your profile and language in Settings. To request access, correction, or deletion of account-related information, use the Contact page and include enough information for us to identify the account safely.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: [
            'We may update this policy when the service or its providers change. The date above will be updated when material revisions are published.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Use',
      description: 'Rules and responsibilities for using the Guizzprints catalog and download flow.',
      intro: 'By using Guizzprints, you agree to use the site lawfully and to respect creators, other users, and third-party services.',
      updated: 'Last updated: September 17, 2026',
      sections: [
        {
          heading: 'Catalog service',
          paragraphs: [
            'Guizzprints provides discovery pages, information, community features, and links to files or external download services. Availability, compatibility, and third-party destinations may change without notice.',
          ],
        },
        {
          heading: 'Accounts and acceptable use',
          paragraphs: [
            'You are responsible for your account and for keeping access credentials secure. Do not attempt to bypass security or download protections, disrupt the site, automate abusive requests, impersonate others, or submit unlawful, deceptive, malicious, or infringing material.',
          ],
        },
        {
          heading: 'Creators and intellectual property',
          paragraphs: [
            'Creators retain rights in their work. Site design, original text, and Guizzprints branding may not be copied or presented as another service. If you own content listed here and believe it should be corrected or removed, send the entry URL and proof of your relationship to the work through the Contact page.',
          ],
        },
        {
          heading: 'Downloads and third parties',
          paragraphs: [
            'External files and services are controlled by their respective providers. Review the destination, permissions, compatibility, and license before downloading or installing anything. Guizzprints cannot guarantee uninterrupted access or that every third-party file will work on every device or game version.',
          ],
        },
        {
          heading: 'Changes and enforcement',
          paragraphs: [
            'We may correct or remove entries, restrict abusive activity, and update these terms when necessary to protect the catalog or comply with applicable requirements. Continued use after an update means the revised terms apply from their publication date.',
          ],
        },
      ],
    },
    contact: {
      title: 'Contact',
      description: 'Contact Guizzprints about support, privacy, copyright, or catalog corrections.',
      intro: 'Use the official community channels below for support, privacy requests, copyright concerns, broken links, or corrections to catalog information.',
      sections: [
        {
          heading: 'Community and support',
          paragraphs: ['Discord is the main support channel. You can also follow the official YouTube channel for project updates.'],
          links: [
            { label: 'Open Guizzprints Discord', href: 'https://discord.gg/fxVzEzXhNe' },
            { label: 'Open Guizzprints YouTube', href: 'https://www.youtube.com/@Guihjzz' },
          ],
        },
        {
          heading: 'Privacy or account requests',
          paragraphs: ['State that your message is a privacy request and identify the account email privately. Never post passwords, verification codes, or access tokens. We may ask for a safe verification step before changing or deleting account information.'],
        },
        {
          heading: 'Copyright and catalog corrections',
          paragraphs: ['Include the exact Guizzprints page URL, identify the work and your relationship to it, explain the requested correction or removal, and provide a reliable way to verify the claim.'],
        },
      ],
    },
  },
  es: {
    about: {
      title: 'Acerca de Guizzprints',
      description: 'Conoce cómo Guizzprints organiza y presenta contenido de la comunidad de Minecraft.',
      intro: 'Guizzprints es un catálogo independiente creado para ayudar a los jugadores de Minecraft a descubrir add-ons, texturas, shaders, mapas, skins y herramientas de la comunidad.',
      sections: [
        { heading: 'Qué hacemos', paragraphs: ['Organizamos creaciones de la comunidad en categorías claras y mostramos información útil como capturas, compatibilidad, instrucciones de instalación y el creador o la fuente cuando esos datos están disponibles.', 'Nuestro objetivo es facilitar el descubrimiento y la descarga sin afirmar que los archivos de terceros pertenecen a Guizzprints.'] },
        { heading: 'Contenido y revisión', paragraphs: ['Cada publicación debe tener un título claro, una descripción original, imágenes válidas, una categoría correcta y un destino funcional. Las publicaciones incompletas o engañosas pueden corregirse, ocultarse o eliminarse.', 'Una etiqueta de verificación describe nuestras comprobaciones del catálogo y del enlace; no garantiza que todos los archivos externos estén libres de riesgos.'] },
        { heading: 'Proyecto independiente', paragraphs: ['Guizzprints no es un producto ni servicio oficial de Minecraft y no está aprobado ni asociado con Mojang o Microsoft. Los nombres, ilustraciones y marcas relacionados con Minecraft pertenecen a sus respectivos propietarios.'] },
      ],
    },
    privacy: {
      title: 'Política de Privacidad',
      description: 'Cómo Guizzprints trata datos de cuenta, preferencias, uso y publicidad.',
      intro: 'Esta política explica qué información procesa Guizzprints, por qué se utiliza y qué opciones tienen los visitantes y titulares de cuentas.',
      updated: 'Última actualización: 17 de septiembre de 2026',
      sections: [
        { heading: 'Información que procesamos', paragraphs: ['Al crear o usar una cuenta, procesamos datos como correo electrónico, nombre de usuario, sesión de autenticación, favoritos, calificaciones y preferencia de idioma. Si eliges iniciar sesión con Google, Google comparte los datos básicos necesarios para crear la cuenta de Guizzprints; no solicitamos acceso a Gmail o Drive ni almacenamos tokens de actualización de Google. También podemos procesar contadores de descargas y registros técnicos o de seguridad necesarios para operar y proteger el servicio.', 'No publiques información personal sensible en nombres de usuario, descripciones u otros campos públicos.'] },
        { heading: 'Cómo usamos la información', paragraphs: ['Usamos la información para autenticar cuentas, guardar preferencias, ofrecer favoritos y calificaciones, proteger descargas, prevenir abusos, diagnosticar fallos, comprender el uso agregado y mejorar la velocidad y el contenido.'] },
        { heading: 'Proveedores y sitios externos', paragraphs: ['Guizzprints usa Supabase para cuentas y base de datos, y Vercel para alojamiento, analítica web anónima y mediciones de rendimiento. Las descargas pueden ser entregadas por proveedores externos, donde se aplican sus propias condiciones y políticas de privacidad.'] },
        { heading: 'Cookies y almacenamiento local', paragraphs: ['Podemos usar cookies esenciales o almacenamiento del navegador para sesiones, seguridad y preferencias. Vercel Web Analytics se configura como analítica centrada en la privacidad y sin cookies. Cuando se active la publicidad, las cookies publicitarias se informarán y gestionarán con las opciones de consentimiento exigidas para la región del visitante.'] },
        { heading: 'Uso compartido, conservación y seguridad', paragraphs: ['No vendemos información de las cuentas. Los datos solo pueden compartirse con proveedores cuando sea necesario para operar el sitio, cumplir la ley, investigar abusos o proteger a los usuarios.', 'Conservamos la información durante el tiempo razonablemente necesario y usamos controles de acceso y otras medidas de protección, aunque ningún servicio de internet puede prometer seguridad absoluta.'] },
        { heading: 'Tus opciones y solicitudes', paragraphs: ['Puedes cambiar tu perfil e idioma en Configuración. Para solicitar acceso, corrección o eliminación de datos de la cuenta, usa la página de Contacto. Las opciones de publicidad y consentimiento también podrán gestionarse mediante el aviso mostrado en las regiones aplicables.'] },
        { heading: 'Cambios en esta política', paragraphs: ['Podemos actualizar esta política cuando cambie el servicio o sus proveedores. La fecha superior se modificará cuando publiquemos cambios importantes.'] },
      ],
    },
    terms: {
      title: 'Términos de Uso',
      description: 'Reglas y responsabilidades al usar el catálogo y las descargas de Guizzprints.',
      intro: 'Al usar Guizzprints, aceptas utilizar el sitio legalmente y respetar a los creadores, otros usuarios y servicios externos.',
      updated: 'Última actualización: 17 de septiembre de 2026',
      sections: [
        { heading: 'Servicio de catálogo', paragraphs: ['Guizzprints ofrece páginas de descubrimiento, información, funciones de comunidad y enlaces a archivos o servicios externos. La disponibilidad, compatibilidad y los destinos externos pueden cambiar sin aviso.'] },
        { heading: 'Cuentas y uso aceptable', paragraphs: ['Eres responsable de tu cuenta y de proteger tus credenciales. No intentes eludir la seguridad o la protección de descargas, interrumpir el sitio, automatizar solicitudes abusivas, suplantar a terceros ni enviar material ilegal, engañoso, malicioso o infractor.'] },
        { heading: 'Creadores y propiedad intelectual', paragraphs: ['Los creadores conservan los derechos sobre sus obras. El diseño, los textos originales y la marca Guizzprints no pueden copiarse ni presentarse como otro servicio. Si eres titular de un contenido y deseas corregirlo o retirarlo, utiliza la página de Contacto.'] },
        { heading: 'Descargas y terceros', paragraphs: ['Los archivos y servicios externos están controlados por sus proveedores. Revisa el destino, permisos, compatibilidad y licencia antes de instalar algo. Guizzprints no garantiza acceso continuo ni que todos los archivos funcionen en todos los dispositivos o versiones del juego.'] },
        { heading: 'Cambios y aplicación', paragraphs: ['Podemos corregir o retirar publicaciones, restringir actividades abusivas y actualizar estos términos para proteger el catálogo o cumplir requisitos aplicables.'] },
      ],
    },
    contact: {
      title: 'Contacto',
      description: 'Contacta con Guizzprints por soporte, privacidad, derechos de autor o correcciones.',
      intro: 'Usa los canales oficiales para soporte, solicitudes de privacidad, derechos de autor, enlaces rotos o correcciones del catálogo.',
      sections: [
        { heading: 'Comunidad y soporte', paragraphs: ['Discord es el canal principal de soporte. También puedes seguir el canal oficial de YouTube.'], links: [{ label: 'Abrir Discord de Guizzprints', href: 'https://discord.gg/fxVzEzXhNe' }, { label: 'Abrir YouTube de Guizzprints', href: 'https://www.youtube.com/@Guihjzz' }] },
        { heading: 'Privacidad o cuenta', paragraphs: ['Indica que se trata de una solicitud de privacidad e identifica en privado el correo de la cuenta. Nunca publiques contraseñas, códigos de verificación ni tokens. Podemos solicitar una comprobación segura antes de cambiar o borrar datos.'] },
        { heading: 'Derechos de autor y correcciones', paragraphs: ['Incluye la URL exacta de Guizzprints, identifica la obra y tu relación con ella, explica la corrección o retirada solicitada y aporta una forma fiable de verificar la reclamación.'] },
      ],
    },
  },
  pt: {
    about: {
      title: 'Sobre o Guizzprints',
      description: 'Saiba como o Guizzprints organiza e apresenta conteúdo da comunidade Minecraft.',
      intro: 'O Guizzprints é um catálogo independente criado para ajudar jogadores de Minecraft a descobrir add-ons, texturas, shaders, mapas, skins e ferramentas da comunidade.',
      sections: [
        { heading: 'O que fazemos', paragraphs: ['Organizamos criações da comunidade em categorias claras e apresentamos informações úteis, como imagens, compatibilidade, instruções de instalação e o criador ou a fonte quando esses dados estão disponíveis.', 'Nosso objetivo é facilitar a descoberta e o download sem afirmar que arquivos de terceiros pertencem ao Guizzprints.'] },
        { heading: 'Conteúdo e revisão', paragraphs: ['Cada publicação deve ter título claro, descrição original, imagens válidas, categoria correta e destino funcional. Publicações incompletas ou enganosas podem ser corrigidas, ocultadas ou removidas.', 'Um selo de verificação descreve nossas próprias verificações de catálogo e de link; ele não garante que todo arquivo externo seja livre de riscos.'] },
        { heading: 'Projeto independente', paragraphs: ['O Guizzprints não é um produto ou serviço oficial do Minecraft e não é aprovado nem associado à Mojang ou à Microsoft. Nomes, artes e marcas relacionados ao Minecraft pertencem aos respectivos proprietários.'] },
      ],
    },
    privacy: {
      title: 'Política de Privacidade',
      description: 'Como o Guizzprints trata dados de conta, preferências e uso.',
      intro: 'Esta política explica quais informações o Guizzprints processa, por que elas são usadas e quais opções estão disponíveis a visitantes e titulares de contas.',
      updated: 'Última atualização: 17 de setembro de 2026',
      sections: [
        { heading: 'Informações que processamos', paragraphs: ['Ao criar ou usar uma conta, processamos dados como e-mail, nome de usuário, sessão de autenticação, favoritos, avaliações e preferência de idioma. Se você escolher entrar com o Google, o Google compartilha os dados básicos necessários para criar a conta do Guizzprints; não pedimos acesso ao Gmail ou Drive nem armazenamos tokens de atualização do Google. Também podemos processar contagens de download e registros técnicos ou de segurança necessários para operar e proteger o serviço.', 'Não publique informações pessoais sensíveis em nomes de usuário, descrições ou outros campos públicos.'] },
        { heading: 'Como usamos as informações', paragraphs: ['Usamos as informações para autenticar contas, salvar preferências, oferecer favoritos e avaliações, proteger downloads, evitar abusos, diagnosticar falhas, compreender o uso agregado e melhorar a velocidade e o conteúdo do site.'] },
        { heading: 'Prestadores de serviço e sites externos', paragraphs: ['O Guizzprints usa Supabase para contas e banco de dados e Vercel para hospedagem, análise anônima de acesso e medição de desempenho. Os downloads podem ser entregues por provedores externos, sujeitos aos próprios termos e políticas de privacidade.'] },
        { heading: 'Cookies e armazenamento local', paragraphs: ['Cookies essenciais ou armazenamento do navegador podem ser usados para login, segurança e preferências. O Vercel Web Analytics está configurado como análise focada em privacidade e sem cookies.'] },
        { heading: 'Compartilhamento, retenção e segurança', paragraphs: ['Não vendemos informações de contas. Os dados podem ser compartilhados com prestadores somente quando necessário para operar o site, cumprir a lei, investigar abuso ou proteger usuários e o serviço.', 'As informações são mantidas pelo tempo razoavelmente necessário. Usamos controles de acesso e outras proteções, mas nenhum serviço na internet pode prometer segurança absoluta.'] },
        { heading: 'Suas opções e solicitações', paragraphs: ['Você pode alterar perfil e idioma em Configurações. Para solicitar acesso, correção ou exclusão de dados da conta, use a página de Contato.'] },
        { heading: 'Alterações desta política', paragraphs: ['Podemos atualizar esta política quando o serviço ou seus prestadores mudarem. A data acima será atualizada quando alterações relevantes forem publicadas.'] },
      ],
    },
    terms: {
      title: 'Termos de Uso',
      description: 'Regras e responsabilidades para usar o catálogo e os downloads do Guizzprints.',
      intro: 'Ao usar o Guizzprints, você concorda em utilizar o site legalmente e respeitar criadores, outros usuários e serviços externos.',
      updated: 'Última atualização: 17 de setembro de 2026',
      sections: [
        { heading: 'Serviço de catálogo', paragraphs: ['O Guizzprints oferece páginas de descoberta, informações, recursos de comunidade e links para arquivos ou serviços externos. Disponibilidade, compatibilidade e destinos de terceiros podem mudar sem aviso.'] },
        { heading: 'Contas e uso aceitável', paragraphs: ['Você é responsável por sua conta e por proteger suas credenciais. Não tente contornar segurança ou proteção de downloads, interromper o site, automatizar solicitações abusivas, fingir ser outra pessoa nem enviar material ilegal, enganoso, malicioso ou que viole direitos.'] },
        { heading: 'Criadores e propriedade intelectual', paragraphs: ['Os criadores mantêm os direitos sobre suas obras. O design, os textos originais e a marca Guizzprints não podem ser copiados ou apresentados como outro serviço. Se você é titular de um conteúdo e deseja corrigi-lo ou removê-lo, use a página de Contato.'] },
        { heading: 'Downloads e terceiros', paragraphs: ['Arquivos e serviços externos são controlados pelos respectivos provedores. Confira destino, permissões, compatibilidade e licença antes de instalar algo. O Guizzprints não garante acesso ininterrupto nem que todos os arquivos funcionem em todos os dispositivos ou versões do jogo.'] },
        { heading: 'Alterações e aplicação', paragraphs: ['Podemos corrigir ou remover publicações, restringir atividades abusivas e atualizar estes termos quando necessário para proteger o catálogo ou atender a requisitos aplicáveis.'] },
      ],
    },
    contact: {
      title: 'Contato',
      description: 'Fale com o Guizzprints sobre suporte, privacidade, direitos autorais ou correções.',
      intro: 'Use os canais oficiais abaixo para suporte, solicitações de privacidade, direitos autorais, links quebrados ou correções no catálogo.',
      sections: [
        { heading: 'Comunidade e suporte', paragraphs: ['O Discord é o principal canal de suporte. Você também pode acompanhar o canal oficial no YouTube.'], links: [{ label: 'Abrir o Discord do Guizzprints', href: 'https://discord.gg/fxVzEzXhNe' }, { label: 'Abrir o YouTube do Guizzprints', href: 'https://www.youtube.com/@Guihjzz' }] },
        { heading: 'Privacidade ou conta', paragraphs: ['Informe que a mensagem é uma solicitação de privacidade e identifique o e-mail da conta em conversa privada. Nunca publique senhas, códigos de verificação ou tokens. Podemos pedir uma confirmação segura antes de alterar ou excluir dados.'] },
        { heading: 'Direitos autorais e correções', paragraphs: ['Inclua a URL exata da página no Guizzprints, identifique a obra e sua relação com ela, explique a correção ou remoção solicitada e forneça uma forma confiável de verificar a alegação.'] },
      ],
    },
  },
};

export function getSitePage(locale: string, page: SitePage): SitePageContent {
  return pages[toSiteLocale(locale)][page];
}
