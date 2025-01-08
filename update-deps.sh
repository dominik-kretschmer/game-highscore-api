#!/bin/sh

docker compose down -v

docker compose build --no-cache --pull

docker compose run php /bin/sh -c 'composer update; composer outdated'
docker compose run pwa /bin/sh -c 'pnpm install; pnpm update; pnpm outdated'

cd api
composer recipes:update

echo 'Run `git diff` and carefully inspect the changes made by the recipes.'
echo 'Run `docker compose up --wait --force-recreate` now and check that everything is fine!'
echo 'Run `docker compose exec php /bin/sh -c ''bin/console -e test doctrine:database:create ; bin/console -e test doctrine:migrations:migrate --no-interaction ; bin/phpunit ; bin/console -e test doctrine:schema:validate''` to check that the tests are green.'
