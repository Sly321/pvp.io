import "./components/statistic-cell.js"
import "./components/loading-spinner.js"
import "./components/wowclass-span.js"
import "./components/rating.js"

Vue.component('login-with-bnet', {
  template: `<a class="bnet" href="/auth/bnet">Login with Battle.net</a>`
})

Vue.component('character', {
  data: function() {
    return {
        bracket2v2: { 
          rating: "",
          statistics: {
            season: {
              lost: "",
              won: "",
              played: ""
            },
            weekly:  {
              lost: "",
              won: "",
              played: ""
            }
          }
        },
        bracket3v3: { 
          rating: "",
          statistics: {
            season: {
              lost: "",
              won: "",
              played: ""
            },
            weekly:  {
              lost: "",
              won: "",
              played: ""
            }
          }
        },
      }
  },
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

const characters = new Vue({
  el: '#characters',
  data: {
    characters: [],
  },
  created: function() {
    fetch("/api/v1/characters/ratings").then(res => {
      res.json().then(body => {
        console.log(body)
        this.characters = body.characters
      })
    })
  },
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
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})