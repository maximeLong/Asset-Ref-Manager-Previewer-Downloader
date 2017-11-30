<template>
  <div id="options-panel-team">

    <transition name="fadedown" mode="out-in">

      <!-- main panel -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'main'" key="main">
        <div class="form-title">My Teams</div>
        <div class="teams-list" v-if="teams.length !== 0">
          <div class="form-subtitle" v-for="team in teams">
            <div class="set-team" @click="setCurrentTeam(team)">{{team.name}}</div>
          </div>
        </div>
        <div class="form-subtitle" v-else>No teams...</div>
        <div class="seperator"></div>
        <button class="submit-button" @click="setTeamPanel('createTeam')">Create New Team</button>
      </div>

      <!-- create team -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'createTeam'" key="create">
        <div class="back-arrow" @click="setTeamPanel('main')">back</div>
        <div class="form-title">Create Team</div>
        <div class="form-subtitle">Team Name:</div>
          <input :value="formTeamName" @input="updateFormTeamName" placeholder="team name">
        <button class="submit-button" @click="tryCreateTeam()">Create Team</button>
      </div>

      <!-- add member -->
      <div class="team-subpanel" v-if="currentTeamPanel == 'addMember'" key="member">
        <div class="back-arrow" @click="setTeamPanel('main')">back</div>
        <div class="form-title">Add Member to {{currentTeam.name}}</div>
        <div class="form-subtitle">Member Email:</div>
          <input :value="formInviteEmail" @input="updateFormInviteEmail" placeholder="invitees email">
        <button class="submit-button" @click="inviteMember()">Add a member</button>
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
    teams: function() { return this.$store.getters['teams/list'] },
    user: function()            { return this.$store.state.auth.user },
    ...mapState([
      'userPanel',
      'formTeamName',
      'formInviteEmail',
      'currentTeam'
    ])
  },

  methods: {

    setTeamPanel: function(val) { this.currentTeamPanel = val },
    updateFormTeamName: function(e) { this.$store.commit('SET_FORM_TEAMNAME', e.target.value) },
    updateFormInviteEmail: function(e) { this.$store.commit('SET_FORM_INVITEEMAIL', e.target.value) },

    setCurrentTeam: function(team) {
      this.$store.commit('SET_CURRENT_TEAM', team);
      this.$store.dispatch('users/patch', [this.user._id, { currentTeam: this.currentTeam._id }] )
      .then(res => { console.log(res) })
      .catch(err => { console.log (err) })

      this.currentTeamPanel = 'addMember';
    },
    inviteMember: function(){
      this.$store.dispatch('teams/patch', [this.currentTeam._id, {$push: { invites: this.formInviteEmail }}] )
      .then(res => { console.log(res) })
      .catch(err => { console.log (err) })
    },

    tryCreateTeam: function(){
      this.createTeam({
        creator: this.user._id,
        name: this.formTeamName,
        users: [this.user._id],
        admins: [this.user._id]
      })
      .then(response =>
        this.setCurrentTeam(response)
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
  .submit-button
    +button(false,false,$action_color)
  .set-team
    +clickable

</style>
