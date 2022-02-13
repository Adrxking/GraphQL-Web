#!/usr/bin/env sh

set -x
npm run build
set +x

echo 'El comando "npm" ejecuta la app Node.js/React.'
echo 'El "npm start" tiene un ampersand lo que provoca que el comando se ejecute'
echo 'en segundo plano. Si no este comando podría pausar los builds.'
echo 'El "npm start" va seguido de otro comando que devuelvo el PID of proceso anterior'
echo 'y lo escribe en el .pidfile.'

set -x
npm start &
sleep 1

echo $! > .pidfile
set +x