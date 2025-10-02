window._genesys || (window._genesys = {}),
  window._gt || (window._gt = []),
  (window._genesys.widgets = {
    main: { debug: !0, theme: 'light', i18n: '', lang: 'en', preload: [] },
    webchat: {
      userData: {},
      emojis: !0,
      cometD: { enabled: !1 },
      autoInvite: { enabled: !1, timeToInviteSeconds: 5, inviteTimeoutSeconds: 30 },
      chatButton: { enabled: !1, openDelay: 1e3, effectDuration: 300, hideDuringInvite: !0 },
      uploadsEnabled: !1,
      dataURL: 'https://chatbot.sera.gov.sa:8443/genesys/2/chat/request-chat',
      apikey: '',
      async: { enabled: !0, newMessageRestoreState: 'full' },
    },
    sidebar: {
      showOnStartup: !0,
      position: 'right',
      expandOnHover: !1,
      channels: [{ name: 'WebChat' }],
    },
  });
