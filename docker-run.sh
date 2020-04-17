# docker run -d -p 8080:8080 \
#   -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@postgres:5432/postgres \
#   -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
#   -e HASURA_GRAPHQL_ADMIN_SECRET="myadminsecretkey" \
#   hasura/graphql-engine:latest

docker run -p 8080:8080 \
    -e HASURA_GRAPHQL_ADMIN_SECRET="myadminsecretkey" \
    hasura/graphql-engine:latest \
    graphql-engine \
    --database-url postgres://postgres:postgrespassword@postgres:5432/postgres \
    serve
