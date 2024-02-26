import AuthService from "./service/AuthService.js";
import * as fs from 'fs';

const DEFAULT_ENDPOINTS_FOLDER = "./endpoints";
const DEFAULT_MODELS_FOLDER = "./models";

async function getEndpoints() {
  let endpoints = [];

  let files = fs.readdirSync(DEFAULT_ENDPOINTS_FOLDER);

  for (let i = 0; i < files.length; i++) {
    let fileArgs = files[i].split(".");

    if (fileArgs.length >= 3 && fileArgs[fileArgs.length - 1] == "js") {
      fileArgs.pop();
      await import(DEFAULT_ENDPOINTS_FOLDER + "/" + files[i]).then(m => {
        let module = m.default;

        if (module) {
          module.id = fileArgs.join(":");

          if (fileArgs[0] == "system") {
            fileArgs.shift();
          }

          module.url = "/" + fileArgs.join("/");

          module.authService = AuthService;
          endpoints.push(module);
        }
      })
    }
  }

  return endpoints;
}

async function getModels() {
  let models = [];

  let files = fs.readdirSync(DEFAULT_MODELS_FOLDER);

  for (let i = 0; i < files.length; i++) {
    let fileArgs = files[i].split(".");

    if (fileArgs[fileArgs.length - 1] == "js" && fileArgs.length <= 2) {
      fileArgs.pop();

      await import(DEFAULT_MODELS_FOLDER + "/" + files[i]).then(m => {
        let model = m.default;
        let modelName = fileArgs[0];

        models.push({
          name: modelName,
          model: model
        });
      })
    }
  }

  return models;
}

async function start() {
  let endpoints = await getEndpoints();
  let models = await getModels();

  AuthService.start({
    endpoints: endpoints,
    models: models
  });
}

start();