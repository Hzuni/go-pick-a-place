FROM node:14.16.1-alpine3.13 AS builder
COPY ./ /var/www/app
WORKDIR '/var/www/app'
RUN npm install 
RUN npm run build

FROM node:14.16.1-alpine3.13
COPY --from=builder /var/www/app/ /var/www/app/
COPY --from=builder /var/www/app/build /var/www/app/build
WORKDIR /var/www/app
CMD node bin/www
