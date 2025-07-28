FROM node:18-alpine
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY package.json package-lock.json* ./
RUN npm install
EXPOSE 3000
CMD ["node", "backend/index.js"]
