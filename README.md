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
|`npm start`|       - starts the web server and backend server. Or Use `npm run zen:watch`|
|`npm run zen:watch`|         - starts the web server and backend server in watch mode.|
|`npm run zen:watch:debug`|    - starts the web server and backend server in debug and watch mode.|
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
         common-server-core      - Core interfaces and its implementation code for Server.   
         common-client-core     - Client State related code which consists of Redux and Graphql Gql
         common-client-react     - React pure components and containers are defined. 
         common-graphql-schema   - Graphql Schema for Server.
     servers                     - Has the packages to organize the codebase into multi-package repositories.
         frontend-server         - Frontend Client Server. This is useful to show demo of this package.
         backend-server          - Backend apollo server. 
    

## [Project Setup](docs/Project_Setup.md)

In Order to get started with the development you need to go through the 
documentation first

- [Getting Started with lerna](./docs/lerna-build-tools.md)
- [Running the servers](./docs/How_to_Run_Various_Options.md)
- [Dos and Dont](./docs/DoAndDont.md)

