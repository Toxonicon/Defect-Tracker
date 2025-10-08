FROM node:18-alpine
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++ sqlite

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs backups public/docs

# Set permissions
RUN chmod 755 uploads logs backups

EXPOSE 3000
CMD ["npm", "start"]
