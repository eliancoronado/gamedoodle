// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
};
