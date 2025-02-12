/*
ESLint Configuration File

This file sets up ESLint, a tool for:
- Maintaining code quality in JavaScript (JS).
- Enforcing style consistency.
- Detecting errors and suspicious patterns.
- Promoting best coding practices.
*/

// Import the recommended ESLint configuration for JavaScript.
import js from '@eslint/js';

/* 
This file uses ES Modules (ECMAScript Modules), which is the standard JS
module system. ES Modules use 'export' and 'import' statements to share code
between files.

This config can be imported in other files using:
import config from './eslint.config.js'
*/

// Export an array of configurations for ESLint, including the recommended JS rules and custom settings.
export default [

    // Use the recommended configuration from @eslint/js for common JS best practices.
    js.configs.recommended,
    {
        /*
        'ignores' specifies directories or files that ESLint should ignore. Here, we exclude 
        node_modules to avoid unnecessary linting of external dependencies.
        */
        "ignores": ["node_modules/"],
    
        // 'languageOptions' configures how ESLint interprets your JS code.
        "languageOptions": {
    
            /*
            'ecmaVersion': Specifies which version of ECMAScript (the standard for JS) syntax to use for parsing.
            Here, we are using the latest ECMAScript features supported by ESLint.
            */
            "ecmaVersion": "latest",
            
            // 'globals': specifies a set of global variables that ESLint should recognize for the project.
            "globals": {
    
                // Since this is a browser-only project, we're setting browser globals to true.
                "browser": true,

                /*
                Declare 'window' as a global variable to avoid undefined errors in ESLint.
                'window' is the global object in client-side JavaScript that represents the browser window
                and contains all global JavaScript objects, functions, and variables.
                */
                "window": true,

                /*
                Declare 'document' as a global variable to avoid undefined errors in ESLint.
                'document' represents the web page loaded in the window and serves as the
                entry point to the web page's content (the DOM).
                */
                "document": true,
                
                /*
                Declare 'localStorage' as a global variable to avoid undefined errors in ESLint.
                'localStorage' is part of the Web Storage API that allows storing key-value pairs 
                persistently in the user's browser.
                */

                "localStorage": true
            }
        },

        // 'rules': where you customize which coding practices ESLint should enforce or warn about in your project.
        "rules": {
    
            /*
            'no-console' is set to "warn" because while console statements are invaluable for
            debugging during development, they're often not needed or wanted in production code.
            */ 
            "no-console": "warn",
    
            /*
            'no-unused-vars' is set to "error" because unused variables can indicate dead code 
            or mistakes in logic, leading to clutter. 
            */ 
            "no-unused-vars": "error"
        }
    }
];

// Note: More configurations, plugins, or custom rules can be added here as the project evolves.