module.exports = {
    "parser": "babel-eslint",
    "extends": ["airbnb"],
    "plugins": ["testing-library", "jest-dom", "react", "react-hooks", "import"],
    "ignorePatterns": ["build/**"],
    "rules": {
        "react/prop-types": 0, // let's see if we can do without it for now
        "no-console": "off",
        "react/jsx-props-no-spreading": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ],
        "no-underscore-dangle":  ["error", { "allow": ["_id"] }],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    "env": {
        "browser": true,
        "jest": true,
    }
};