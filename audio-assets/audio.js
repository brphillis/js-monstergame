const audio = {
  Map: new Howl({
    src: "./audio-assets/map.wav",
    html5: true,
    volume: 0.5,
  }),
  initBattle: new Howl({
    src: "./audio-assets/initBattle.wav",
    html5: true,
    volume: 0.1,
  }),
  battle: new Howl({
    src: "./audio-assets/battle.mp3",
    html5: true,
    volume: 0.3,
  }),
  tackleHit: new Howl({
    src: "./audio-assets/tackleHit.wav",
    html5: true,
    volume: 0.1,
  }),
  superbarkHit: new Howl({
    src: "./audio-assets/superbarkHit.wav",
    html5: true,
    volume: 0.1,
  }),
  initSuperbark: new Howl({
    src: "./audio-assets/initSuperbark.wav",
    html5: true,
    volume: 0.1,
  }),
  victory: new Howl({
    src: "./audio-assets/victory.wav",
    html5: true,
    volume: 0.3,
  }),
};
