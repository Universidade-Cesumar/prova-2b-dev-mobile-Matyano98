module.exports = function (api) {
  // Mantém o cache do Babel ativo para melhorar a execução dos testes
  api.cache(true);

  return {
    // Preset padrão utilizado em projetos Expo
    presets: ['babel-preset-expo'],
  };
};
