FROM node:12.13.0-alpine

ENV NODE_ENV production

# Create app directory
WORKDIR /gearlaunch2-backend-rest-demo

# Install app dependencies
COPY .npmrc ./
COPY package*.json ./
COPY npm-shrinkwrap.json ./

RUN npm ci

# Bundle app source
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:production"]
