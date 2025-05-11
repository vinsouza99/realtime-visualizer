# Use Node as the base image
FROM node:18-bullseye

# Install Python and pip dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean

# Create main app directory
WORKDIR /app

# Copy backend package files and install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy the rest of the backend including Python scripts and server.js
COPY server/ ./

# Install required Python packages
COPY server/requirements.txt /app/server/requirements.txt
RUN pip3 install -r requirements.txt

# Copy frontend files and install + build frontend
COPY realtime-visualizer/package*.json /app/realtime-visualizer/
WORKDIR /app/realtime-visualizer
RUN npm install
COPY realtime-visualizer/ ./
RUN npm run build

# Add entrypoint script
COPY start.sh /app/server/start.sh
RUN chmod +x /app/server/start.sh

# Expose both backend and frontend ports
EXPOSE 8080 5173

# Start both servers via the script
WORKDIR /app/server
ENTRYPOINT ["./start.sh"]
