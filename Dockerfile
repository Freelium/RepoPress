FROM node:20 as build

WORKDIR /app
COPY package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
ENV CCP_API_URL=''
EXPOSE 80

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
