/*
  Configuration File: ESLint

  This file sets up ESLint, a tool for maintaining code quality in JavaScript (JS) by:
    - Enforcing style consistency.
    - Detecting errors and suspicious patterns.
*/

/*
  Import ESLint's recommended rule set for JavaScript from the official @eslint/js package.
  These are defaults compiled over time by JS experts to catch common issues and keep code solid.
*/
import js from '@eslint/js';

/*
  This file uses ES Modules, the standard JS module system, with `export` and `import` to share code.
    - For example, another config could import it like: `import config from './eslint.config.js'`.
    - This lets you reuse it for stuff like test config files with different rules.
*/

// Export a single config object combining recommended JS rules with custom settings for this project.
export default {

    // Copies ESLint’s recommended rules into our config, combining them with our custom settings.
    ...js.configs.recommended,

    /*
      'ignores' tells ESLint which directories or files to skip.
      We’re skipping node_modules here so it doesn’t mess with external stuff
      (i.e. we avoid linting external dependencies).

      What is meant by external stuff?

      There is code that our project needs written by a bunch of really smart devs.
      We just get to import this code in node_modules and stuff just works.
      But it's not code we wrote personally, so we don't need to lint it.
    */
    "ignores": ["node_modules/"],

    // 'languageOptions' is an object that defines how ESLint processes your JavaScript, like its version or environment.
    "languageOptions": {

    /*
      'ecmaVersion' is a property that specifies which version of ECMAScript syntax (the standard for JS, 
      defining how code can be written) to use for parsing.

      Here, we set "latest" to enable the most current ECMAScript syntax ESLint supports at any given time —
      ideal for smaller or cutting-edge projects chasing new features.

      Without setting this, ESLint defaults to a stable version from its last release, which may not include the newest syntax.
      Larger, established projects might prefer a specific stable version (e.g., 2020) for reliability.
    */
    "ecmaVersion": "latest",

        /*
          'globals' is a property that tells ESLint about global variables — special names (like 'window' or 'document')
          that are automatically available in every JavaScript file because of the environment we’re coding in,
          like a browser.
          
          Without listing them here, ESLint would complain they’re “undefined” since we didn’t
          declare them ourselves.
          
          For this browser-only project, we’re setting up globals that match what a
          browser provides, so our code makes sense to ESLint and runs smoothly.
        */
        "globals": {

            /*
              The 'browser' property, when set to true, tells ESLint this project runs in a browser environment.
              This makes ESLint recognize all standard browser global variables (like 'window', 'document',
              'console', 'localStorage') without needing to list them one by one.

              Without this, ESLint would flag these globals as “undefined” since we didn’t declare them ourselves,
              breaking our linting for this browser-only setup.
            */
            "browser": true
        }
    },

    // The 'rules' property lets you customize which coding practices ESLint should enforce or warn about in your project.
    "rules": {
  
        /*
        We are including "warn" in the rule to apply warnings to console usage in general.
        We are then excluding "warn" and "error" from those warnings to permit console.warn and console.error, 
        recognizing their value in both development and production environments.
        */ 
        "no-console": ["warn", { "allow": ["warn", "error"] }],
  
        /*
        'no-unused-vars' is set to "error" because unused variables can indicate dead code 
        or mistakes in logic, leading to clutter. 
        */ 
        "no-unused-vars": "error"
    }
};
