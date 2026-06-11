FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production --no-audit --silent
# newsletter.mjs est monté en volume (mise à jour sans rebuild)
CMD ["node", "newsletter.mjs"]
