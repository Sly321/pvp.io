import "./components/statistic-cell.js"
import "./components/loading-spinner.js"
import "./components/wowclass-span.js"
import "./components/rating.js"
import "./components/login-page.js"

Vue.component('character', {
  template: `\
    <tr v-if="character.level === 120">\
      <td class="name-cell">
        <div class="character-name">
          <wowclass-span v-bind:wowclass="character.playable_class.name">{{ character.name }}</wowclass-span>
        </div>
        <div class="character-realm">{{ character.realm.name }}</div>
        </div>
      </td>
      <rating v-bind:rating="character.bracket2v2.rating" />\
      <statistic-cell v-bind:value="character.bracket2v2.season_match_statistics.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="character.bracket2v2.season_match_statistics.lost" />\
      <statistic-cell v-bind:value="character.bracket2v2.season_match_statistics.played" />\
      <statistic-cell v-bind:value="character.bracket2v2.weekly_match_statistics.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="character.bracket2v2.weekly_match_statistics.lost" />\
      <statistic-cell v-bind:value="character.bracket2v2.weekly_match_statistics.played" v-bind:className="'space-right'" />\
      <rating v-bind:rating="character.bracket3v3.rating" />\
      <statistic-cell v-bind:value="character.bracket3v3.season_match_statistics.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="character.bracket3v3.season_match_statistics.lost" />\
      <statistic-cell v-bind:value="character.bracket3v3.season_match_statistics.played" />\
      <statistic-cell v-bind:value="character.bracket3v3.weekly_match_statistics.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="character.bracket3v3.weekly_match_statistics.lost" />\
      <statistic-cell v-bind:value="character.bracket3v3.weekly_match_statistics.played" />\
    </tr>\
  `,
  props: ['character']
})

Vue.component('characters-overview', {
  data: function() {
    return { characters: [] }
  },
  created: function() {
    fetch("/api/v1/characters/ratings").then(res => {
      res.json().then(body => {
        console.log(body)
        this.characters = body.characters
      })
    })
  },
  template: `
  <div id="characters">
      <table v-if="characters.length !== 0">
          <thead>
              <tr>
                  <th colspan="1"></th>
                  <th class="bracket space-right" colspan="7">
                      <div>2v2</div>
                  </th>
                  <th class="bracket" colspan="7">
                      <div>3v3</div>
                  </th>
              </tr>
              <tr>
                  <th colspan="2"></th>
                  <th class="bracket" colspan="3">
                      <div>season</div>
                  </th>
                  <th class="bracket space-right" colspan="3">
                      <div>weekly</div>
                  </th>
                  <th />
                  <th class="bracket" colspan="3">
                      <div>season</div>
                  </th>
                  <th class="bracket" colspan="3">
                      <div>weekly</div>
                  </th>
              </tr>
              <tr>
                  <th>name</th>
                  <th class="space-left">rating</th>
                  <th class="space-left">win</th>
                  <th>lose</th>
                  <th>played</th>
                  <th class="space-left">win</th>
                  <th>lose</th>
                  <th class="space-right">played</th>
                  <th class="space-left">rating</th>
                  <th class="space-left">win</th>
                  <th>lose</th>
                  <th>played</th>
                  <th class="space-left">win</th>
                  <th>lose</th>
                  <th>played</th>
              </tr>
          </thead>
          <tbody>    
              <tr
                  is="character"
                  v-for="(character, index) in characters"
                  v-bind:key="character.id"
                  v-bind:character="character"
              />
          </tbody>
      </table>
      <loading-spinner v-else />
  </div>`
})

var auth = new Vue({
  el: '#auth',
  data: {
    loggedIn: undefined,
    state: "pending",
    user: undefined
  },
  created: function() {
    fetch("/api/v1/profile").then(res => {
      if (res.status == 404) {
        this.loggedIn = false
        this.state = "anonymous"
      } else {
        this.loggedIn = true
        this.state = "authenticated"
        res.json().then(v => this.user = v)
      }
    }).catch(e => console.log(e))
  }
})