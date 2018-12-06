const boton = document.getElementsByClassName('clic-info');
const video = document.getElementById('video');
const request = new XMLHttpRequest();
let response;
let holding = false;
const btnAleatortio = document.getElementById('aleatorio');
const track = document.getElementById('track');
const progress = document.getElementById('progress');
const play = document.getElementById('play');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const art = document.getElementById('art');
let currentTrack = 0, currentVideo = 0;
let song;
let audio;
let duration;
let playing = false;

request.addEventListener('load', (event) => {
  response = event.target.response;
  song = response[currentTrack];
  audio = new Audio();
  audio.src = song.song;
  title.textContent = song.name;
  artist.textContent = song.artist;
  art.src = song.image;
  cargarListeners();
  for (const i of boton) {
    i.setAttribute('data', currentVideo);
    i.children[0].setAttribute('data', currentVideo);
    i.children[1].setAttribute('data', currentVideo);
    i.addEventListener('click', (event) => {
      video.src = response[event.target.getAttribute('data')].url;
    });
    currentVideo++;
  }
});

function cargarListeners() {
  audio.addEventListener('timeupdate', updateTrack, false);
  audio.addEventListener('loadedmetadata', function () { // eslint-disable-line
    duration = this.duration;
  }, false);
  window.onmousemove = function (e) { // eslint-disable-line
    e.preventDefault();
    if (holding) seekTrack(e);
  }
  window.onmouseup = function (e) { // eslint-disable-line
    holding = false;
    console.log(holding);
  }
  track.onmousedown = function (e) { // eslint-disable-line
    holding = true;
    seekTrack(e);
  }
  play.onclick = function () { // eslint-disable-line
    playing ? audio.pause() : audio.play();
    playing = !playing;
  }
  audio.addEventListener('pause', function () { // eslint-disable-line
    play.innerHTML = '<img class="pad" src="http://abarcarodriguez.com/lab/play.png"/>';
    playing = false;
  }, false);

  audio.addEventListener('playing', function () { // eslint-disable-line
    play.innerHTML = '<img src="http://abarcarodriguez.com/lab/pause.png"/>';
    playing = true;
  }, false);
  next.addEventListener('click', nextTrack, false);
  prev.addEventListener('click', prevTrack, false);
}

request.responseType = 'json';
request.open('GET', 'datos/data.json');
request.send();

function updateTrack() {
  const curtime = audio.currentTime;
  const percent = Math.round((curtime * 100) / duration);
  progress.style.width = percent + '%';
  handler.style.left = percent + '%';
}

function seekTrack(e) {
  event = e || window.event;
  const x = e.pageX - player.offsetLeft - track.offsetLeft;
  percent = Math.round((x * 100) / track.offsetWidth);
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;
  progress.style.width = percent + '%';
  handler.style.left = percent + '%';
  audio.play();
  audio.currentTime = (percent * duration) / 100;
}
function nextTrack() {
  currentTrack++;
  currentTrack = currentTrack % (response.length);
  song = response[currentTrack];
  audio.src = song.song;
  audio.onloadeddata = function () { // eslint-disable-line
    updateInfo();
  }
}

function prevTrack() {
  currentTrack--;
  currentTrack = (currentTrack == -1 ? (response.length - 1) : currentTrack);
  song = response[currentTrack];
  audio.src = song.song;
  audio.onloadeddata = function () { // eslint-disable-line
    updateInfo();
  }
}

function updateInfo() {
  title.textContent = song.name;
  artist.textContent = song.artist;
  art.src = song.image;
  art.onload = function () { // eslint-disable-line
    audio.play();
  }
}

const modal = document.getElementById('modal');
const openModal = document.getElementsByClassName('clic-info');
const closeModal = document.getElementsByClassName('close')[0];

for (const i of openModal) {
  i.addEventListener('click', () => {
    modal.style.display = 'block';
  })
}
closeModal.onclick = function () { // eslint-disable-line
  modal.style.display = 'none';
  video.pause();
}

function random() {
  const cancionRandom = Math.floor(Math.random() * 21);
  return cancionRandom;
}
btnAleatortio.onclick = () => {
  const num = random();
  currentTrack = num;
  currentTrack = currentTrack % (response.length);
  song = response[currentTrack];
  audio.src = song.song;
  audio.onloadeddata = function () { // eslint-disable-line
    updateInfo();
  }
};
