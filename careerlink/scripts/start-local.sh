#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Read literal dotenv values without executing shell expressions in secrets.
# Explicitly exported environment variables take precedence.
if [[ -f "$ROOT_DIR/.env" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ "$line" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]] || continue
    key="${BASH_REMATCH[2]}"
    value="${BASH_REMATCH[3]}"
    if [[ "$value" == \"*\" || "$value" == \'*\' ]]; then
      value="${value:1:${#value}-2}"
    fi
    if ! printenv "$key" >/dev/null 2>&1; then
      export "$key=$value"
    fi
  done < "$ROOT_DIR/.env"
fi

JAVA_HOME_DIR="${JAVA_HOME:-$ROOT_DIR/.tools/jdk/Contents/Home}"
JAVA_BIN="$JAVA_HOME_DIR/bin/java"
JWT_SECRET_VALUE="${JWT_SECRET:-01234567890123456789012345678901}"
MONGODB_URI_VALUE="${MONGODB_URI:-mongodb://localhost:27017/careerlink}"
EUREKA_DEFAULT_ZONE_VALUE="${EUREKA_DEFAULT_ZONE:-http://localhost:8761/eureka/}"

mkdir -p "$ROOT_DIR/.run-logs" "$ROOT_DIR/.run-pids"

start_service() {
  local name="$1"
  local port="$2"
  local jar="$3"
  local port_var="$4"

  if lsof -iTCP:"$port" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
    echo "$name already listening on port $port"
    return
  fi

  echo "Starting $name on port $port"
  env \
    JAVA_HOME="$JAVA_HOME_DIR" \
    PATH="$JAVA_HOME_DIR/bin:/usr/bin:/bin:/usr/sbin:/sbin" \
    JWT_SECRET="$JWT_SECRET_VALUE" \
    MONGODB_URI="$MONGODB_URI_VALUE" \
    EUREKA_DEFAULT_ZONE="$EUREKA_DEFAULT_ZONE_VALUE" \
    GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-}" \
    "$port_var"="$port" \
    nohup "$JAVA_BIN" -jar "$ROOT_DIR/$jar" > "$ROOT_DIR/.run-logs/$name.log" 2>&1 < /dev/null &
  echo "$!" > "$ROOT_DIR/.run-pids/$name.pid"
}

if [[ ! -x "$JAVA_BIN" ]]; then
  echo "Java not found at $JAVA_BIN"
  exit 1
fi

start_service "eureka-server" "8761" "eureka-server/target/eureka-server-1.0.0.jar" "EUREKA_PORT"
sleep 6
start_service "auth-service" "8081" "auth-service/target/auth-service-1.0.0.jar" "AUTH_SERVICE_PORT"
start_service "profile-service" "8082" "profile-service/target/profile-service-1.0.0.jar" "PROFILE_SERVICE_PORT"
start_service "job-service" "8083" "job-service/target/job-service-1.0.0.jar" "JOB_SERVICE_PORT"
start_service "application-service" "8084" "application-service/target/application-service-1.0.0.jar" "APPLICATION_SERVICE_PORT"
sleep 10
start_service "api-gateway" "8080" "api-gateway/target/api-gateway-1.0.0.jar" "GATEWAY_PORT"

echo
echo "Started requested services. Logs are in $ROOT_DIR/.run-logs"
echo "Eureka dashboard: http://localhost:8761"
echo "API Gateway:      http://localhost:8080"
