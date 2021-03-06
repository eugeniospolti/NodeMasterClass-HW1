var environments = {};

environments.staging = {
  port: 3000,
  envName: "staging"
};

environments.production = {
  port: 5000,
  envName: "production"
};

var currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : "";

var envToExport =
  typeof environments[currentEnv] == "object"
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;
