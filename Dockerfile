# Step 1: Use an official Node.js runtime as the base image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Step 4: Install app dependencies
RUN npm install

# Step 5: Copy the rest of the app files
COPY . .

# Step 6: Expose the port on which your app runs (e.g., 3000)
EXPOSE 4040

# Step 7: Define the command to start the app
CMD ["npm", "run", "start"]
