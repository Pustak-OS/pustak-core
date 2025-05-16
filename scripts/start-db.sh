#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ ${TRACE-0} == 1 ]]; then
  set -o xtrace
fi

# Default values, can be overridden by environment variables
PG_TAG=${PG_TAG:-16-alpine}
PG_USER=${POSTGRES_USER:-"pustak"}
PG_PASSWORD=${POSTGRES_PASSWORD:-"secret"}
PG_DATABASE=${POSTGRES_DB:-"pustak"}
ADMINER_PORT=${ADMINER_PORT:-"8080"} # Changed from 8010 to avoid potential conflict with other services

DB_CONTAINER_NAME="pustak_db"
ADMINER_CONTAINER_NAME="pustak_adminer"
DB_VOLUME_NAME="pustak_pg_data"

# Function to stop and remove containers
cleanup() {
  echo "Stopping and removing Docker containers..."
  docker stop "$DB_CONTAINER_NAME" "$ADMINER_CONTAINER_NAME" || true
  docker rm "$DB_CONTAINER_NAME" "$ADMINER_CONTAINER_NAME" || true
  echo "Cleanup complete."
}

# Trap SIGINT and SIGTERM to run cleanup function
trap cleanup SIGINT SIGTERM

echo "Removing existing containers if they exist..."
docker rm -f "$DB_CONTAINER_NAME" "$ADMINER_CONTAINER_NAME" >/dev/null 2>&1 || true

echo "Starting PostgreSQL container ($DB_CONTAINER_NAME) on port 5432..."
# verbose output    

docker run \
  --name "$DB_CONTAINER_NAME" \
  --publish 5432:5432 \
  --detach \
  --env POSTGRES_USER="$PG_USER" \
  --env POSTGRES_PASSWORD="$PG_PASSWORD" \
  --env POSTGRES_DB="$PG_DATABASE" \
  --volume "$DB_VOLUME_NAME:/var/lib/postgresql/data" \
  --pull always \
  postgres:"$PG_TAG"

echo "Waiting for PostgreSQL to be ready..."
# Loop until PostgreSQL is ready
until docker exec "$DB_CONTAINER_NAME" pg_isready -U "$PG_USER" -d "$PG_DATABASE" -q; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up - executing command"


echo "Starting Adminer container ($ADMINER_CONTAINER_NAME) on port $ADMINER_PORT..."
docker run \
  --name "$ADMINER_CONTAINER_NAME" \
  --publish "$ADMINER_PORT":"$ADMINER_PORT" \
  --detach \
  --pull always \
  --add-host=host.docker.internal:host-gateway \
  adminer \
  php -S "[::]:$ADMINER_PORT" -t /var/www/html


# Give Adminer a moment to start
sleep 3

echo
printf "\\033[0;32mPostgreSQL URI: postgresql://%s:%s@localhost:5432/%s\\033[0m\\n" "$PG_USER" "$PG_PASSWORD" "$PG_DATABASE"
printf "\\033[0;32mAdminer available at http://localhost:%s\\033[0m\\n" "$ADMINER_PORT"
printf "\\033[0;33mPress Ctrl+C to stop Postgres and Adminer and remove containers.\\033[0m\\n"
echo

# Setup Adminer plugins (local-login, color-banners, favorite-queries, pretty-json-editor)
# These are adapted from your sample script.

echo "Setting up Adminer plugins..."

docker exec -i "$ADMINER_CONTAINER_NAME" mkdir -p /var/www/html/plugins-enabled

docker exec -i "$ADMINER_CONTAINER_NAME" tee /var/www/html/plugins-enabled/local-login.php >/dev/null <<END
<?php
class AdminerAutoLogin {
  function loginForm() {
    ?>
    <input type=hidden name='auth[driver]' value=pgsql>
    <input type=hidden name='auth[server]' value=host.docker.internal>
    <input type=hidden name='auth[db]' value='<?php echo "$PG_DATABASE"; ?>'>
    <input type=hidden name='auth[username]' value='<?php echo "$PG_USER"; ?>'>
    <input type=hidden name='auth[password]' value='<?php echo "$PG_PASSWORD"; ?>'>
    <button style='font-size: 2em'>🚀 Login to <?php echo "$PG_DATABASE"; ?> (local)</button>
    </form>
    <br><hr><br>
    <form action method=post>
    <?php
  }
}
return new AdminerAutoLogin();
END

docker exec -i "$ADMINER_CONTAINER_NAME" tee /var/www/html/plugins-enabled/color-banners.php >/dev/null <<END
<?php
class AdminerColorBanners extends Adminer\Plugin {
  function tablesPrint() {
    \$banners_by_host = [
      "host.docker.internal" => [
        "label" => "Local Database ($PG_DATABASE)",
        "bg_light" => "green",
        "fg_light" => "white",
        "bg_dark" => "darkgreen",
        "fg_dark" => "white",
      ],
      // Add other host configurations here if needed
    ];
    \$current_host = \$_GET["pgsql"] ?? (\$_POST["auth"]["server"] ?? "");
    \$banner = \$banners_by_host[\$current_host] ?? null;

    if (isset(\$banner)) {
      ?>
        <h3 id=sa-color-banner><?php echo htmlspecialchars(\$banner["label"]); ?></h3>
        <style>
        #sa-color-banner {
          background: <?php echo htmlspecialchars(\$banner["bg_light"]); ?>;
          color: <?php echo htmlspecialchars(\$banner["fg_light"]); ?>;
          margin: 0 0 1em 0; /* Adjusted margin */
          padding: .4em 1em;
          border-radius: 0 0 5px 5px;
          text-align: center;
        }
        @media (prefers-color-scheme: dark) {
          #sa-color-banner {
            background: <?php echo htmlspecialchars(\$banner["bg_dark"]); ?>;
            color: <?php echo htmlspecialchars(\$banner["fg_dark"]); ?>;
          }
        }
        /* Ensure layout compatibility */
        body { padding-top: 40px; } /* Adjust if banner height changes */
        #menu { top: 40px; } /* Adjust if banner height changes */
        #breadcrumb { top: 40px; } /* Adjust if banner height changes */
        .logout { top: 40px; right: 10px; } /* Adjust if banner height changes */
        #content { margin-top: 1em; }
        </style>
      <?php
    }
  }
}
return new AdminerColorBanners();
END

echo "Adminer plugins setup complete."

# Optional: A function to run when the script is about to exit, to stop the containers.
# This is useful if the script is not terminated by Ctrl+C but by other means.
on_exit() {
    echo "Script exiting. Cleaning up..."
    cleanup
}

# Keep the script running until Ctrl+C is pressed
read -p "Press Ctrl+C to stop Postgres and Adminer and remove containers."