module.exports = {
  webpack: {
    alias: {
      "@": require("path").resolve(__dirname, "src"),
    },
  },
  style: {
    postcss: {
      mode: 'file',
    },
  },
};
