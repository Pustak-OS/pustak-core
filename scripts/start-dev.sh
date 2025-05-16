#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

if [[ "${TRACE-}" == 1 ]]; then
    set -o xtrace
fi

project_root="$(git rev-parse --show-toplevel)"

# Load environment variables from .env file at project root if it exists
if [ -f "$project_root/.env" ]; then
  echo "Loading environment variables from $project_root/.env for script execution..."
  # Export variables, ignoring lines starting with # and empty lines
  # This handles simple VAR=value lines. It may not handle complex values with spaces without quotes perfectly.
  # For production, proper environment management is key.
  export $(grep -v '^\s*#' "$project_root/.env" | grep -v '^\s*$' | xargs)
echo "Environment variables loaded."
else
  echo "Warning: $project_root/.env file not found. Server might not get all required environment variables."
fi

SERVER_COMMAND="cd '$project_root/apps/server' && while ! nc -z localhost 5432 </dev/null; do echo 'Waiting for PostgreSQL to be ready on port 5432...' && sleep 1; done; yarn dev"
WEB_COMMAND="cd '$project_root/apps/web' && yarn dev"
# Start database and adminer using the new script
DB_SCRIPT_PATH="$project_root/scripts/start-db.sh"
DOCKER_COMMAND="bash '$DB_SCRIPT_PATH'"

SESSION_NAME="PustakDev"

main_pane_command='cat <<END

PUSTAK DEVELOPMENT ENVIRONMENT

--------------------------------------------------------------------------------
 HOTKEYS 
--------------------------------------------------------------------------------
  :     - tmux command prompt
  d     - detach session (tmux detach)
  x     - kill current pane (tmux kill-pane)
  c     - create new window (tmux new-window)
  ,     - rename current window (tmux rename-window)
  %     - split pane horizontally (tmux split-window -h)
  "     - split pane vertically (tmux split-window -v)

  Use arrow keys with Ctrl-b to navigate panes.

--------------------------------------------------------------------------------
 CUSTOM HOTKEYS (press Ctrl-b, then 'r', then the key)
--------------------------------------------------------------------------------
  r r   - restart current pane
  r s   - restart Server (apps/server)
  r w   - restart Web (apps/web)
  r d   - restart Docker services (db)

--------------------------------------------------------------------------------
 OTHER
--------------------------------------------------------------------------------
  Ctrl-b g K  - Kill all services and the tmux session.

--------------------------------------------------------------------------------
 SERVICE LINKS
--------------------------------------------------------------------------------
  Web App Client: http://localhost:4200
  Server API    : http://localhost:4300 (e.g., http://localhost:4300/api/health)
  PostgreSQL    : localhost:5432 (User: pustak, Pass: secret, DB: pustak)

END'

_new_tmux_window() {
   echo "Creating new window: $1 in session $SESSION_NAME"
   local window_name="$1"
   local command_to_run="$2"
   # Get current window count for reliable indexing if needed, or let tmux manage.
   # Using -t "$SESSION_NAME" adds to the next available slot.
   local new_window_index
   new_window_index=$(tmux new-window -d -c "$project_root" -t "$SESSION_NAME" -n "$window_name" -P -F '#I' "$command_to_run")
   tmux set-option -w -t "$SESSION_NAME:$new_window_index" remain-on-exit on
   echo "Window $window_name created with index $new_window_index"
}

# Function to ensure the session exists
EnsureSessionExists() {
    local sessionName="$1"
    local main_window_name="main" # Define for clarity and reuse

    if ! tmux has-session -t="$sessionName" 2>/dev/null; then
        echo "Creating new session: $sessionName with window $main_window_name"
        # Create the Tmux session, detached, with the main window.
        # project_root and main_pane_command are defined globally in the script.
        TMUX='' tmux new-session -ds "$sessionName" -c "$project_root" -n "$main_window_name" "$main_pane_command"
        tmux set-option -w -t "$sessionName:$main_window_name" remain-on-exit on
    else
        echo "Session $sessionName already exists."
        # Check if the main window exists in the existing session
        # The -F "#{window_name}" formats output to be just window names, one per line.
        # grep -Fxq matches whole lines (-x) literally (-F) and quietly (-q).
        if ! tmux list-windows -t "$sessionName" -F "#{window_name}" 2>/dev/null | grep -Fxq "$main_window_name"; then
            echo "Window $main_window_name not found in session $sessionName. Creating it..."
            # Create the main window if it doesn't exist. -d for detached.
            # project_root and main_pane_command are defined globally.
            # Adding to "$sessionName:" lets tmux pick the next available index.
            tmux new-window -d -c "$project_root" -t "$sessionName:" -n "$main_window_name" "$main_pane_command"
            tmux set-option -w -t "$sessionName:$main_window_name" remain-on-exit on
        else
            echo "Window $main_window_name already exists in session $sessionName."
        fi
    fi
    # Global session options (apply regardless of new/existing session)
    tmux set-option -s -t "$sessionName" remain-on-exit on # For new windows by default in this session
    tmux set-option -g -t "$sessionName" mouse on # Mouse support for this session
}

EnsureSessionExists "$SESSION_NAME"

# Bindings and other windows are created *after* session is confirmed to exist
echo "Setting up default bindings for session $SESSION_NAME"
# These are global key bindings (no tmux prefix needed before them)
# Use with caution if they conflict with other applications
tmux bind-key -n : command-prompt
tmux bind-key -n Tab select-window -n
tmux bind-key -n S-Tab select-window -p

echo "Setting up custom bindings for session $SESSION_NAME"

# Custom restart bindings (Ctrl-b r <key>)
tmux bind-key -T root     r switch-client -T restart
tmux bind-key -T restart  r respawn-pane -k
tmux bind-key -T restart  s "respawn-pane -k -t \"$SESSION_NAME:server\"; select-window -t \"$SESSION_NAME:server\""
tmux bind-key -T restart  w "respawn-pane -k -t \"$SESSION_NAME:web\"; select-window -t \"$SESSION_NAME:web\""
tmux bind-key -T restart  d "respawn-pane -k -t \"$SESSION_NAME:docker\"; select-window -t \"$SESSION_NAME:docker\""

# Custom global bindings (Ctrl-b g <key>)
tmux bind-key -T root     g switch-client -T prefix_g
tmux bind-key -T prefix_g K "send-keys -t \"$SESSION_NAME:docker\" Enter; \
                                send-keys -t \"$SESSION_NAME:web\" Enter; \
                                send-keys -t \"$SESSION_NAME:server\" Enter; \
                                send-keys -t \"$SESSION_NAME\" Enter; \
                                kill-session -t \"$SESSION_NAME\""

echo "Finished setting up custom bindings for session $SESSION_NAME"

echo "Creating service windows for session $SESSION_NAME"
_new_tmux_window "docker" "$DOCKER_COMMAND"
_new_tmux_window "web" "$WEB_COMMAND"

echo "Waiting a few seconds for Docker services (db) to initialize..."
sleep 1

_new_tmux_window "server" "$SERVER_COMMAND"

# Select the main info window first, if the session was newly created or it makes sense in your flow
tmux select-window -t "$SESSION_NAME:main"

# Attach or switch to the session at the very END
if [[ -z "${TMUX-}" ]]; then
  echo "Attaching to session $SESSION_NAME..."
  exec tmux attach-session -t "$SESSION_NAME" # Use exec here as it's the last command
else
  if [[ "$(tmux display-message -p '#S')" != "$SESSION_NAME" ]]; then
    echo "Already in tmux. Switching to session $SESSION_NAME..."
    exec tmux switch-client -t "$SESSION_NAME" # Use exec here
  else
    echo "Already attached to session $SESSION_NAME."
  fi
fi 