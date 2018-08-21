# Neutron Go: Opinionated C++ Framework

## Requirements
- C++ >= 8
- Redis >= 4

## Features
- Create a new multithread C++ server with Pug templating with 8 threads (Ruby on Rails has 5 for their server's scalibity)
- Setup your own database (any SQL database or MongoDB)
- Generate new api controllers
- Generate new api versions
- Creates automatic API documentation for endpoints on creation with no extra configuration (no YAML files) (data pulled directly from the database ** hide routes on production **)
- Generate new pages with assets with a custom route (Static serverside responses)

## Coming Soon
(Any of your choice)
- Generate server side React Application
- Generate server side Angular 4 Application
- Generate server side Vue Application
- Autogenerated unit tests for each API endpoint
- Generate new page components for each type of frontend web framework/library
- Generate new reusable (global) components for each type of frontend web framework/library
- Generate new json files to plugin into your components
- Automatic deployment scripts to Elastic Beanstalk on AWS using the EB Cli

## Installation
```
// brew install redis
// Must have redis running on default port 6379: redis-server
npm i -g @lfaler/neutronjs
neutron create <Your project>
neutron setup-data-base <Your database type [sql *or* mongodb]>
neutron new-page blogs --routePath='/blogs'
npm start
```

## Documentation
```
// For all commands
neutron

// For a single command
neutron <command-name> --help
```
