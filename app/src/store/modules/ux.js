
export const ux = {
  namespaced: true,

  //-- STATE AND MUTATORS
  //
  state: {
    userPanel: { open: false, panelType: 'userInfo' }, //panelType can be: 'signIn', 'createAccount', 'userInfo', 'team'
    assetImportModal: { isOpen: false, panelType: 'file', relatedAsset: undefined }, //panelType can be: 'file', 'sketchfab'
    sceneOptionsModalIsOpen: false,    //scene options panel
    assetInfoModalIsOpen: false,      //asset info panel

    //various form info holders
    formEmail: '',
    formTeamName: '',
    formSceneName: '',
    formPassword: '',
    formInviteEmail: '',
    formAssetName: '',

    //model info on import
    modelGeometryInfo: {},
    modelFileSize: '',
    modelFile: undefined,
    modelSnapshot: undefined,

    //model standin that exists between upload click and server response
    assetStandin: false
  },

  mutations: {
    SET_USER_PANEL: function(state, {open, panelType}) {
      state.userPanel.open = open;
      if (panelType != undefined) { state.userPanel.panelType = panelType; }
    },
    SET_ASSET_IMPORT_MODAL: function(state, {isOpen, panelType, relatedAsset}) {
      state.assetImportModal.isOpen = isOpen;
      if (panelType != undefined)     { state.assetImportModal.panelType = panelType; }
      if (relatedAsset != undefined)  { state.assetImportModal.relatedAsset = relatedAsset }
    },
    SET_ASSET_INFO_MODAL_IS_OPEN: function(state, val)    { state.assetInfoModalIsOpen = val; },
    SET_SCENE_OPTIONS_MODAL_IS_OPEN: function(state, val) { state.sceneOptionsModalIsOpen = val; },

    SET_FORM_ASSETNAME: function(state, val)    { state.formAssetName = val },
    SET_FORM_EMAIL: function(state, val)        { state.formEmail = val; },
    SET_FORM_TEAMNAME: function(state, val)     { state.formTeamName = val; },
    SET_FORM_SCENENAME: function(state, val)    { state.formSceneName = val; },
    SET_FORM_PASSWORD: function(state, val)     { state.formPassword = val; },
    SET_FORM_INVITEEMAIL: function(state, val)  { state.formInviteEmail = val },

    SET_MODEL_GEOMETRY_INFO: function(state, val)   { state.modelGeometryInfo = val },
    SET_MODEL_FILE_SIZE: function(state, val)       { state.modelFileSize = val },
    SET_MODEL_FILE: function(state, val)            { state.modelFile = val },
    SET_MODEL_SNAPSHOT: function(state, val)        { state.modelSnapshot = val },

    SET_ASSET_STANDIN: function(state, val) { state.assetStandin = val },
  }
}
