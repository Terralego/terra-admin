# Terralego Admin

## Install

    $ npm i

## Usage

    $ npm start

## Configuration

You'll need to load a config file with some env variables like API_HOST which will tell to the app where the backend is located.
The app will try to find a `from` querystring with the host of the referrer. It will try to fetch a `${host}/env.json` file. If no `from` param si passed, it will look on its own host. And finally, for dev purpose, you may change the public/env.json file in your working copy.
