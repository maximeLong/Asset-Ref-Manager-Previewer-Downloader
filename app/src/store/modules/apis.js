
export const apis = {
  namespaced: true, //access actions with 'apis/whatever'

  actions: {

    getSketchfabAssets: function(store, search) {
      return new Promise((resolve, reject) => {
        var defaultUrl = 'https://api.sketchfab.com/v3/search?type=models&downloadable=true&staffpicked=true&sort_by=-publishedAt';
        var searchUrl = 'https://api.sketchfab.com/v3/search?type=models&downloadable=true&q=' + search;
        var fetchUrl = search ? searchUrl : defaultUrl;
        fetch(fetchUrl)
          .then(function(response) {
            return response.json();
          })
          .then(function(jsonResponse) {
            resolve()
            console.log('sketchfab gotten')
            store.commit('SET_SKETCHFAB_ASSETS', jsonResponse.results)
          });
      })
    }

  },

  //-- STATE AND MUTATORS
  //
  state: {
    sketchfabAssets: []
  },
  mutations: {
    SET_SKETCHFAB_ASSETS: function(state, val) { state.sketchfabAssets = val }
  }
}
