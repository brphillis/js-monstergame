const monsters = {
  Ralph: {
    position: {
      x: 260,
      y: 300,
    },
    image: {
      src: "./monster-assets/ralph.png",
    },
    frames: {
      max: 4,
      hold: 25,
    },
    animate: true,
    name: "Ralph",
    attacks: [attacks.Tackle, attacks.Superbark],
  },

  Eyegorr: {
    position: {
      x: 620,
      y: 150,
    },
    image: {
      src: "./monster-assets/eyegorr.png",
    },
    frames: {
      max: 4,
      hold: 25,
    },
    animate: true,
    isEnemy: true,
    name: "Eyegorr",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};
