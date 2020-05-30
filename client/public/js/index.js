import "./components/statistic-cell.js"
import "./components/bracket-2v2.js"
import "./components/bracket-3v3.js"

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
  mounted: function() {
    const realmSlug = this.character.realm.slug
    const name = this.character.name
    fetch(`/api/v1/rating?bracket=2v2&name=${name.toLowerCase()}&realmSlug=${realmSlug}`).then(res => {
      res.json().then(rating => {
        this.bracket2v2.rating = rating.rating
        this.bracket2v2.statistics.season = rating.season_match_statistics
        this.bracket2v2.statistics.weekly = rating.weekly_match_statistics
      }).catch(() => {
      })
    })

    fetch(`/api/v1/rating?bracket=3v3&name=${name.toLowerCase()}&realmSlug=${realmSlug}`).then(res => {
      res.json().then(rating => {
        this.bracket3v3.rating = rating.rating
        this.bracket3v3.statistics.season = rating.season_match_statistics
        this.bracket3v3.statistics.weekly = rating.weekly_match_statistics
      }).catch(() => {
      })
    })
  },
  template: `\
    <tr v-if="character.level === 120">\
      <td class="name-cell">
        <div class="character-name">
          <span v-bind:class="'class-' + character.playable_class.name.toLowerCase().replace(' ', '-')">{{ character.name }}</span>
        </div>
        <div class="character-realm">{{ character.realm.name }}</div>
        </div>
      </td>
      <bracket-2v2 v-bind:rating="bracket2v2.rating" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.season.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.season.lost" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.season.played" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.weekly.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.weekly.lost" />\
      <statistic-cell v-bind:value="bracket2v2.statistics.weekly.played" />\
      <bracket-2v2 v-bind:rating="bracket3v3.rating" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.season.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.season.lost" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.season.played" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.weekly.won" v-bind:className="'space-left'" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.weekly.lost" />\
      <statistic-cell v-bind:value="bracket3v3.statistics.weekly.played" />\
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
    fetch("/api/v1/characters").then(res => {
      res.json().then(chars => {
        this.characters = chars
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
  components: {
    "match-statistic": {
      template: `<div>
        <td>{{ statistic.won }}</td>
        <td>{{ statistic.lost }}</td>
        <td>{{ statistic.played }}</td>
      </div>
      `,
      props: ['statistic']
    }
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