# Dockerfile para aplicación React Aqueron Frontend

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
RUN npm install -g serve

EXPOSE 5000

CMD ["serve", "-s", "dist", "-l", "5000"]
