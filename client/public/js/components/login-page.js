Vue.component('login-page', {
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
  