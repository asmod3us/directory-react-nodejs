module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "node": true,
        "jquery": true
    },
    "installedESLint": true,
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "no-console": ["error", { allow: ["debug"] }]
    },
    "globals": {
        "Q": true,
        "employeeService": true,
        "pluginService": true,
        "requestKeyCache": true,
        "requestService": true,
        "router": true,
        "cordova": true,
        "React": true
    },
    "plugins": [
        "standard",
        "promise"
    ]
};
