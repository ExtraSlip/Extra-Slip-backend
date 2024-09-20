export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['myKeyA', 'myKeyB']),
  },
  admin: {
    auth: {
      secret: 'xKcVOxKzqMvAIklppnBiA0w7Phl8Sg6tha2XeObhOLI=',
    },
  },
});