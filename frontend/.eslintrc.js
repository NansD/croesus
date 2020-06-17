module.exports = {
    "extends": "airbnb",
    "ignorePatterns": ["build/**"],
    "rules": {
        "no-console": "off",
    "no-restricted-syntax": [
        "error",
        {
            "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
            "message": "Unexpected property on console object was called"
        }
    ],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    "env": {
        "browser": true,
        "jest": true,
    }
};