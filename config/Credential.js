const environment = {
  dev: {
    DATABASE: "extra_slip",
    USER: "root",
    HOST: "localhost",
    PASSWORD: "",
    DB_PORT: "3306",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
    EMAIL_FROM: "info@extraslip.com",
    EMAIL_PASSWORD: "Vtcx[7sE",
    EMAIL_HOST: "smtp.hostinger.com",
    EMAIL_SERVICE: "Hostinger",
    EMAIL_PORT: "465",
    BASE_URL: "http://localhost:8000",
    MAIL_BASE_URL: "http://localhost:3000",
  },
  test: {
    DATABASE: "extra_slip",
    USER: "extra_slip_user",
    HOST: "localhost",
    PASSWORD: "User!234",
    DB_PORT: "3306",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
    EMAIL_FROM: "info@extraslip.com",
    EMAIL_PASSWORD: "Vtcx[7sE",
    EMAIL_HOST: "smtp.hostinger.com",
    EMAIL_SERVICE: "Hostinger",
    EMAIL_PORT: "465",
    BASE_URL: "http://localhost:8000",
    MAIL_BASE_URL: "http://localhost:3000"
  },
  prod: {
    DATABASE: "",
    USER: "",
    HOST: "",
    PASSWORD: "",
    DB_PORT: "",
    SECRET_KEY: "(?9n%]9Q*k[,,.\vJ89-",
    EMAIL_FROM: "info@extraslip.com",
    EMAIL_PASSWORD: "Vtcx[7sE",
    EMAIL_HOST: "smtp.hostinger.com",
    EMAIL_SERVICE: "Hostinger",
    EMAIL_PORT: "465",
    BASE_URL: "http://localhost:8000",
    MAIL_BASE_URL: "https://admin.midcricket.com"
  },
};

module.exports = environment;
