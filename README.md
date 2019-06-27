# Terralego Admin

## Install

    $ npm i

## Configuration

For development purpose, you can copy the template file :

    $ cp public/env.dist.json public/env.json

and edit it.

Otherwise you can set some env variables like `API_HOST` which will tell to the app where the backend is located.

The app will also try to find a `from` querystring parameters with the host of the referrer. 
It will try to fetch a `${host}/env.json` file. If no `from` param si passed, it will look on its own host.

## Usage

    $ npm start


