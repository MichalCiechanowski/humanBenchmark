FROM node:14-alpine
WORKDIR /app/client
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
