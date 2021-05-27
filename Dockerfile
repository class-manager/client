FROM node:14-alpine
ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "pnpm-lock.yaml", "tsconfig.json", "./"]
RUN npm i -g pnpm && pnpm install
COPY ./src ./src
COPY ./public ./public
RUN pnpm build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
