
if(!window._genesys)window._genesys = {};
   if(!window._gt)window._gt = [];
 
window._genesys.widgets = {
      main: {
            debug: true,
            theme: "light",
            i18n: "./i18n/widgets-ar.i18n.json",
            lang: "ar",
            preload: []
      },
      webchat: {
            userData: {},
            emojis: true,
            cometD: {
                  enabled: false
            },
            autoInvite: {
                  enabled: false,
                  timeToInviteSeconds: 5,
                  inviteTimeoutSeconds: 30
            },
            chatButton: {
                  enabled: false,
                  openDelay: 1000,
                  effectDuration: 300,
                  hideDuringInvite: true
            },
            form:{
                  wrapper: "<table></table>",
                 inputs: [{
                       id: "cx_webchat_form_firstname",
                       name: "firstname",
                       maxlength: "100",
                       placeholder: "@i18n:webchat.ChatFormPlaceholderFirstName",
                       label: "@i18n:webchat.ChatFormFirstName",
                       autofocus: !0,
                       validate: function(event, form, input, label, $, CXBus, Common) {
                             if(input) {
                                   if (input.val() )
                                         return true;
                                   else
                                         return false;
                             }
                             return false;
                       }
                 }, {
                       id: "cx_webchat_form_lastname",
                       name: "lastname",
                       maxlength: "100",
                       placeholder: "@i18n:webchat.ChatFormPlaceholderLastName",
                       label: "@i18n:webchat.ChatFormLastName",
                       validate: function(event, form, input, label, $, CXBus, Common) {
                             if(input) {
                                   if (input.val() )
                                         return true;
                                   else
                                         return false;
                             }
                             return false;
                       }
                 }, 
                 
               

                 {
                       id: "cx_webchat_form_email",
                       name: "email",
                       maxlength: "100",
                       placeholder: "@i18n:webchat.ChatFormPlaceholderEmail",
                       label: "@i18n:webchat.ChatFormEmail"
                 },
                 {
                  id: "cx_webchat_form_subject", 
                  name: "subject", 
                  type: "select", // Specify this as a dropdown
                  label: "@i18n:webchat.ChatFormSubject",
                  options: [
                        { value: "شكوى", text: "شكوى" },
                        { value: "استفسار", text: "استفسار" },
                        { value: "اقتراح", text: "اقتراح" }
                  ]
                 }

                 
                 ]
},
            uploadsEnabled: false,
            dataURL: "https://chatbot.sera.gov.sa:8443/genesys/2/chat/request-chat",
            apikey: "",
            async: {
                  enabled: true,
                  newMessageRestoreState: "full"
            }
      },
      sidebar: {
            showOnStartup: true,
            position: "right",
            expandOnHover: false,
            channels: [
                  {
                        name: "WebChat"
                  }
            ]
      }
};