FROM node:alpine

WORKDIR /app
COPY . .

WORKDIR /app/web
RUN yarn && yarn build

ENV PORT=80
EXPOSE 80
CMD ["yarn", "start"]


