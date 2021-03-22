FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "pnpm-lock.yaml", "tsconfig.json", "./"]
RUN npm i -g pnpm && pnpm install
COPY ./src ./src
COPY ./public ./public
RUN pnpm build

FROM go-fiber-react:1.0.0
COPY --from=0 /app/build /app/build
EXPOSE 80
