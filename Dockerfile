FROM node:alpine

# Define the working directory, where the application will reside inside the Docker
WORKDIR /usr/src/app

# Copy package.json to the working directory
COPY package*.json .

# Run the npm install command to install the application dependencies on Docker
RUN npm install

# Copy the rest of the application files to Docker, i.e., app.js
COPY . .

EXPOSE 5173

CMD ["npm","run", "dev"]