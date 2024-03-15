FROM node:20 as build

WORKDIR /app
COPY package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]