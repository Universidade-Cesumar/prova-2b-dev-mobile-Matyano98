module.exports = {
  // Usa a configuração própria do Expo para testes com React Native
  preset: 'jest-expo',

  // Configuração extra para os testes do React Native
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],

  // Ignora a pasta sysalmoxarifado para evitar conflito com outro package.json
  modulePathIgnorePatterns: [
    '<rootDir>/sysalmoxarifado',
  ],

  // Evita que o Jest procure testes dentro da pasta sysalmoxarifado
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/sysalmoxarifado/',
  ],

  // Permite que o Jest transforme dependências usadas pelo React Native e Expo
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo|expo-.*|@expo|@expo/.*|@react-navigation|@react-navigation/.*|react-native-.*)/)',
  ],
};