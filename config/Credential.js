const environment = {
  dev: {
    DATABASE: "tutor_app",
    USER: "root",
    HOST: "localhost",
    PASSWORD: "",
    DB_PORT: "3306",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
  },
  test: {
    DATABASE: "",
    USER: "",
    HOST: "",
    PASSWORD: "",
    DB_PORT: "",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
  },
  prod: {
    DATABASE: "",
    USER: "",
    HOST: "",
    PASSWORD: "",
    DB_PORT: "",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
  },
};

module.exports = environment;
