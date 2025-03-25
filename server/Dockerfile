FROM node:14-alpine
WORKDIR /app/server
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
