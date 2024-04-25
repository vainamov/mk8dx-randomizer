import { CUPS } from './cups.js';
import { TRACKS } from './tracks.js';

const state = {
  modifiers: {
    excludeTour: false,
  },
  tracks: [],
};

function addTrack() {
  state.tracks.push(getRandomTrack(state.tracks.map((track) => track.id)));

  renderTracks();
}

function getRandomTrack(exclude = []) {
  const pool = TRACKS.filter((track) => {
    if (exclude.includes(track.id)) return false;

    if (state.modifiers.excludeTour && track.source === 'tour') return false;

    return true;
  });

  return pool[~~(pool.length * Math.random())];
}

function renderTracks() {
  let content = state.tracks.reduce((acc, cur) => {
    const cup = CUPS.find((cup) => cup.id === cur.id.split('-')[0]);

    const html = `
      <li class="track">
        <section class="id">
          ${cur.id}
        </section>

        <section class="cup">
          ${cup.name}
        </section>

        <section class="name" data-source="${cur.source !== '8' ? cur.source : ''}">
          ${cur.name}
        </section>
      </li>
    `;

    return `${acc}${html}`;
  }, '');

  document.querySelectorAll('[rk-tracks-slot]').forEach((el) => el.innerHTML = content);
}

function reroll() {
  state.tracks = state.tracks.reduce((acc, _) => (
    [...acc, getRandomTrack(acc.map((track) => track.id))]
  ), []);

  renderTracks();
}

function setModifier(event) {
  const modifier = event.target.getAttribute('rk-modifier');
  state.modifiers[modifier] = event.target.checked;
}

function setTracks(event) {
  const count = +event.currentTarget.getAttribute('rk-set-tracks');

  state.tracks = new Array(count).fill(undefined);

  reroll();
}

document.querySelectorAll('[rk-add-track]').forEach((el) => el.addEventListener('click', addTrack));

document.querySelectorAll('[rk-modifier]').forEach((el) => {
  el.addEventListener('change', setModifier);
  setModifier({ target: el });
});

document.querySelectorAll('[rk-reroll]').forEach((el) => el.addEventListener('click', reroll));

document.querySelectorAll('[rk-set-tracks]').forEach((el) => el.addEventListener('click', setTracks));