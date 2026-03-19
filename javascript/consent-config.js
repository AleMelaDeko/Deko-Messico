(() => {
  const GA4_ID = "G-LVQ45T4JS0"; // Il tuo ID GA4 corretto
  const PLAUSIBLE_DOMAIN = "dekosrl.com.mx";

  // ----- Loader Plausible (solo dopo consenso) -----
  function loadPlausibleOnce() {
    if (document.querySelector('script[data-deko-plausible="1"]')) return;

    // Crea lo stub prima, così se parte subito non rompe
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };

    window.plausible.init =
      window.plausible.init ||
      function (i) {
        window.plausible.o = i || {};
      };

    // Carica lo script Plausible
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://plausible.io/js/pa-Zeybz08ecOOOBLm79kksV.js";
    s.setAttribute("data-deko-plausible", "1");
    s.onload = () => {
      window.plausible.init();
      console.log("Plausible caricato con successo");
    };
    document.head.appendChild(s);
  }

  // ----- GA4 Consent Mode: default denied (privacy by design) -----
  function initGAConsentModeStub() {
    window.dataLayer = window.dataLayer || [];

    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    // Default DENIED: finché non accetti, GA non deve tracciare
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
      region: ["IT", "PT", "BR"], // Include Italia, Portogallo e Brasile
    });

    console.log("Consent Mode inizializzato - default denied");
  }

  // ----- Loader GA4 (solo dopo consenso) -----
  function loadGA4Once() {
    if (document.querySelector('script[data-deko-ga4="1"]')) return;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    s.setAttribute("data-deko-ga4", "1");

    s.onload = function () {
      console.log("GA4 caricato con successo - ID:", GA4_ID);

      window.gtag("js", new Date());
      window.gtag("config", GA4_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        restricted_data_processing: true,
        send_page_view: true,
        cookie_flags: "SameSite=None;Secure",
      });

      console.log("GA4 configurato con impostazioni privacy");
    };

    s.onerror = function () {
      console.error("Errore nel caricamento di GA4");
    };

    document.head.appendChild(s);
  }

  // Inizializza il Consent Mode stub
  initGAConsentModeStub();

  // Configurazione Silktide
  function initCookieBanner() {
    if (!window.silktideCookieBannerManager) {
      console.error("Silktide Cookie Banner Manager non trovato");
      return;
    }

    console.log("Configurazione Silktide Cookie Banner in corso...");

    window.silktideCookieBannerManager.updateCookieBannerConfig({
      background: {
        showBackground: true,
        backgroundColor: "rgba(0,0,0,0.5)",
      },

      cookieIcon: {
        position: "bottomRight",
        colorScheme: "light",
      },

      cookieTypes: [
        {
          id: "necessary",
          name: "Necessário",
          description:
            "<p>Esses cookies são necessários para o funcionamento do site e não podem ser desativados. Incluem cookies técnicos para navegação e acesso a áreas protegidas.</p>",
          required: true,
          onAccept: function () {
            console.log("Cookie necessários ativos");
          },
        },
        {
          id: "analytics",
          name: "Análises",
          description:
            "<p>As análises nos ajudam a entender como os visitantes interagem com o site, coletando informações de forma anônima. Usamos Google Analytics e Plausible para melhorar constantemente nossos conteúdos.</p>",
          required: false,
          defaultValue: false,

          onAccept: function () {
            console.log("Cookie analytics ACEITOS - Ativando ferramentas");

            // Aggiorna il consenso per GA
            window.gtag("consent", "update", {
              analytics_storage: "granted",
            });

            // Carica analytics SOLO ORA
            loadPlausibleOnce();
            loadGA4Once();

            // Evento opzionale
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "consent_accepted_analytics",
              consent_type: "analytics",
            });
          },

          onReject: function () {
            console.log(
              "Cookie analytics REJEITADOS - Ferramentas desativadas",
            );

            // GA denied
            window.gtag("consent", "update", {
              analytics_storage: "denied",
            });

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "consent_rejected_analytics",
              consent_type: "analytics",
            });
          },
        },
      ],

      text: {
        banner: {
          description:
            '<p>Usamos cookies necessários para o funcionamento do site. Com o seu consentimento, também usamos ferramentas de análise (Google Analytics e Plausible) para melhorar o desempenho e entender como o site é utilizado. <a href="/política-de-cookies/" style="text-decoration: underline; color: inherit;">Política de Cookies</a> para mais informações.</p>',
          acceptAllButtonText: "Aceitar tudo",
          acceptAllButtonAccessibleLabel:
            "Aceitar todos os cookies, incluindo ferramentas de análise",
          rejectNonEssentialButtonText: "Rejeitar itens não essenciais",
          rejectNonEssentialButtonAccessibleLabel:
            "Aceitar apenas cookies necessários",
          preferencesButtonText: "Preferências",
          preferencesButtonAccessibleLabel: "Abrir preferências de cookies",
        },
        preferences: {
          title: "Personalize suas preferências de cookies",
          description:
            "<p>Você pode escolher quais tipos de cookies permitir. Os cookies necessários estão sempre ativos pois são essenciais para o funcionamento do site. Suas preferências serão salvas por 6 meses.</p>",
          creditLinkText: "Gerenciamento de cookies por Silktide",
        },
      },

      position: {
        banner: "bottomRight",
      },

      bannerSuffix: "deko_main",

      showBanner: true,

      onBannerOpen: function () {
        console.log("Banner de cookies visualizado");
      },

      onBannerClose: function () {
        console.log("Banner de cookies fechado");
      },

      onPreferencesOpen: function () {
        console.log("Painel de preferências aberto");
      },

      onPreferencesClose: function () {
        console.log("Painel de preferências fechado");
      },

      onAcceptAll: function () {
        console.log("Todos os cookies aceitos");
      },

      onRejectAll: function () {
        console.log("Cookies não essenciais rejeitados");
      },
    });

    console.log("Configuração Silktide concluída");
  }

  // Inizializza il banner quando il DOM è pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieBanner);
  } else {
    initCookieBanner();
  }

  // Funzioni di debug (opzionali, rimuovere in produzione)
  window.DEKO = window.DEKO || {};
  window.DEKO.cookieManager = {
    getPreferences: function () {
      const prefs = {};
      const cookieTypes = ["necessary", "analytics"];
      cookieTypes.forEach((type) => {
        prefs[type] =
          localStorage.getItem(`silktideCookieChoice_${type}_deko_main`) ===
          "true";
      });
      console.log("Preferências de cookies atuais:", prefs);
      return prefs;
    },
    resetPreferences: function () {
      const cookieTypes = ["necessary", "analytics"];
      cookieTypes.forEach((type) => {
        localStorage.removeItem(`silktideCookieChoice_${type}_deko_main`);
      });
      localStorage.removeItem("silktideCookieBanner_InitialChoice_deko_main");
      console.log(
        "Preferências de cookies redefinidas. Recarregue a página para ver o banner.",
      );
      location.reload();
    },
  };
})();
