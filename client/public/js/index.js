import "./components/match-statistik.js"
import "./components/bracket-2v2.js"
import "./components/bracket-3v3.js"

Vue.component('character', {
  data: function() {
    return {
        bracket2v2: { 
          rating: "<no rating>",
          statistics: {
            season: null,
            weekly: null
          }
        },
        bracket3v3: { 
          rating: "<no rating>",
          statistics: {
            season: null,
            weekly: null
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
  template: '\
    <tr v-if="character.level === 120">\
      <td>{{ character.name }}</td>\
      <td>{{ character.realm.name }}</td>\
      <td>{{ character.level }}</td>\
      <bracket-2v2 v-bind:rating="bracket2v2.rating" />\
      <td class="space-left">{{ bracket2v2.statistics.season !== null && bracket2v2.statistics.season.won }}</td>\
      <td>{{ bracket2v2.statistics.season !== null && bracket2v2.statistics.season.lost }}</td>\
      <td>{{ bracket2v2.statistics.season !== null && bracket2v2.statistics.season.played }}</td>\
      <td class="space-left">{{ bracket2v2.statistics.weekly !== null && bracket2v2.statistics.weekly.won }}</td>\
      <td>{{ bracket2v2.statistics.weekly !== null && bracket2v2.statistics.weekly.lost }}</td>\
      <td>{{ bracket2v2.statistics.weekly !== null && bracket2v2.statistics.weekly.played }}</td>\
      <bracket-2v2 v-bind:rating="bracket3v3.rating" />\
      <td class="space-left">{{ bracket3v3.statistics.season !== null && bracket3v3.statistics.season.won }}</td>\
      <td>{{ bracket3v3.statistics.season !== null && bracket3v3.statistics.season.lost }}</td>\
      <td>{{ bracket3v3.statistics.season !== null && bracket3v3.statistics.season.played }}</td>\
      <td class="space-left">{{ bracket3v3.statistics.weekly !== null && bracket3v3.statistics.weekly.won }}</td>\
      <td>{{ bracket3v3.statistics.weekly !== null && bracket3v3.statistics.weekly.lost }}</td>\
      <td>{{ bracket3v3.statistics.weekly !== null && bracket3v3.statistics.weekly.played }}</td>\
    </tr>\
  ',
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
      } else {
        this.loggedIn = true
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