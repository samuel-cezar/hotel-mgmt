FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

ENV JWT_SECRET=${JWT_SECRET:-your_secret_key}
ENV DB_NAME=${DB_NAME:-web2_db}
ENV DB_HOST=${DB_HOST:-localhost}
ENV DB_USER=${DB_USER:-postgres}
ENV DB_PASSWORD=${DB_PASSWORD:-1234}
ENV DB_DIALECT=${DB_DIALECT:-postgres}
ENV NODE_ENV=${NODE_ENV:-development}

CMD ["npm", "start"]
