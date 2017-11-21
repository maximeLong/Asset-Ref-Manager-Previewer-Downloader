<template>
  <div id="options-panel-team">

    <transition name="fadedown" mode="out-in">

      <!-- main panel -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'main'" key="main">
        <div class="form-title">My Teams</div>
        <div class="teams-list" v-if="user.teams.length !== 0">
          <div class="form-subtitle" v-for="team in user.teams">{{team.name}}</div>
        </div>
        <div class="form-subtitle" v-else>No teams...</div>
        <div class="seperator"></div>
        <div class="button-solid" @click="setTeamPanel('createTeam')">Create New Team</div>
      </div>

      <!-- create team -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'createTeam'" key="create">
        <div class="back-arrow" @click="setTeamPanel('main')">back</div>
        <div class="form-title">Create Team</div>
        <div class="form-subtitle">Team Name:</div>
          <input :value="formTeamName" @input="updateFormTeamName" placeholder="team name">
        <div class="button-solid" @click="tryCreateTeam(formTeamName, user._id)">Create Team</div>
      </div>

      <!-- add member -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'addMember'" key="member">
        <div class="back-arrow" @click="setTeamPanel('main')">back</div>
        <div class="form-title">Add Member to {{currentTeam.name}}</div>
        <div class="form-subtitle">Team Name:</div>
          <input :value="formTeamName" @input="updateFormTeamName" placeholder="team name">
        <div class="button-solid" @click="tryCreateTeam(formTeamName, user._id)">Create Team</div>
      </div>

    </transition>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'

export default {
  data: function(){
    return {
      currentTeamPanel: 'main' // 'main', 'createTeam', 'addMember'
    }
  },

  computed: {
    userIsLoggedIn: function()  { return this.user ? true : false },
    user: function()            { return this.$store.state.auth.user },
    ...mapState([
      'userPanel',
      'formTeamName'
    ])
  },

  methods: {

    setTeamPanel: function(val) { this.currentTeamPanel = val },
    updateFormTeamName: function(e) { this.$store.commit('SET_FORM_TEAMNAME', e.target.value) },

    tryCreateTeam: function(name, creator){
      console.log({name, creator})
      this.createTeam({name, creator})
        .then(response =>
          console.log(response)
        )
        .catch(error => {
          console.log(error)
        })
    },

    ...mapActions('teams', {
      createTeam: 'create',
      patchTeam: 'patch'
    })
  }

}
</script>

<style scoped lang="sass">
@import src/styles/main

#options-panel-team


</style>
