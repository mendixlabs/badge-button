### Badge button

Badge button is a special distinctive mark or token put on any display as a button

### Features

 * Display a badge on a button.
 * Attach an onclick microflow 
 * Set a static label text when the persisted label is empty or not specified

### Dependencies

Mendix 7.1

### Demo project

https://badge-button.mxapps.io

### Usage

Place the widget in the context of an object that has attributes for data, label and style

## Issues, suggestions and feature requests

We are actively maintaining this widget, please report any issues or suggestion for improvement at https://github.com/mendixlabs/badge-button/issues.

## Developer
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/FlockOfBirds/badge-button.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project.

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests, run:

    npm test

or

    karma start
