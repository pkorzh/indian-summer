System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  meta: {
    "*.json": {
      "loader": "json"
    },
    "*.txt": {
      "loader": "txt"
    },
    "*.css": {
      "loader": "css"
    }
  },

  map: {
    "babel": "npm:babel-core@5.8.24",
    "babel-runtime": "npm:babel-runtime@5.8.24",
    "core-js": "npm:core-js@1.1.4",
    "css": "github:systemjs/plugin-css@0.1.16",
    "json": "github:systemjs/plugin-json@0.1.0",
    "systemjs/plugin-css": "github:systemjs/plugin-css@0.1.16",
    "systemjs/plugin-json": "github:systemjs/plugin-json@0.1.0",
    "systemjs/plugin-text": "github:systemjs/plugin-text@0.0.2",
    "txt": "github:systemjs/plugin-text@0.0.2",
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.24": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@1.1.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});
