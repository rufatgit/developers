FROM node:26-slim

WORKDIR /app

# Declare build argument
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm install


COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host" ]



