# Common Stack Packages

*Helper packages to support Fullstack-pro project.* This project doesn't not have any example server for any demo, to use server you can use https://github.com/cdmbase/fullstack-pro/tree/next

Purpose: 
---
It has all the common packages that are useful for other microservice projects. 

Useful commands:
---
|command|Description|
|--------------------------|-----------|    
|`lerna clean`|                 - removes the node_modules directory from all packages. |
|`npm run watch`|               - build the packages in watchmode (Useful for development)|
|`npm run lerna`|               - installs external dependencies at the repo root so they are available to all packages.|
|`npm run build`|               - build all the packages. You don't need to run as `npm run lerna` runs anyways|
|`npm install`|                - runs `lerna` and `build`|
|`npm run test`|                - to run test using jest
|`npm run test:watch`|          - to run test in watch mode. You can additionally use `-w` and use regex expression to test only specific test.|
|`lerna publish`|               - publishes packages in the current Lerna project. |

Files explained:
---    
It uses `lerna.json` for creating the packages structure. Under packages you can create different modules based on its usage. For example:

     packages                    - Has the packages to organize the codebase into multi-package repositories.
         common-core             - Core interfaces of the packages which can be shared between server and client.
         common-client-core      - Core interfaces and its implementation code for Client.
         common-client-redux     - Redux's reducers and actions are defined. Which may use `@common-stack\client-core` or `@common-stack\core`    

## Getting Started

If you want to develop FullStack locally you must follow the following instructions:

* Fork or Clone this repository

* Install the project in your computer
1. Clone common-stack locally
```
git clone https://github.com/cdmbase/common-stack
cd common-stack
```
2. Install dependencies.
```
npm install

To run build with watch. Useful for auto reloading changes into the server to be productive during development.
```
npm run watch
```
[lerna-clean]: https://github.com/lerna/lerna#clean

