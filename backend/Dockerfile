FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY dist/ ./dist/
COPY migrations/ ./migrations/
COPY contracts/ ./contracts/
EXPOSE 4003
CMD ["npm", "start"]
