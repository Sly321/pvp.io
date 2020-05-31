import "./components/statistic-cell.js"
import "./components/loading-spinner.js"
import "./components/wowclass-span.js"
import "./components/rating.js"

Vue.component('login-with-bnet', {
  template: `<section class="container mt-5">
  <h2>What is this?</h2>
  <div class="split-2 description-container mt-3">
    <p class="description">
    I created this because I wanted an overview for my characters and their ratings.
    Since I found it pretty useful, i decided to publish it for others too. The client
    uses the <a href="https://develop.battle.net/">official Blizzard API</a> to fetch your characters (much like <a href="https://raider.io">raider.io</a> does) and give you an overview for all your level 120 characters and their arena raiting and statistics. This is very much under construction! So if you have ideas, problems or concerns feel free to contact me ingame (Slyox#2863). I hope you like it!
    </p>
    <img alt="showcase of the application" src="/assets/showcase.png" />
  </div>
  <div class="login-btn-container">
    <a class="bnet" href="/auth/bnet">Login with Battle.net</a>
  </div>
  </section>`
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