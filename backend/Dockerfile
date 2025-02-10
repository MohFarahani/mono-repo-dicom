FROM node:18-slim

# Install Python and required packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install Node dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Set up Python environment and install dependencies
COPY requirements.txt ./
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN yarn build

# Create symbolic link for @ imports in dist
RUN mkdir -p dist/node_modules && ln -s /app/dist dist/node_modules/@

# Create dicom_files directory with proper permissions
RUN mkdir -p dicom_files && chmod 777 dicom_files

# Make Python script executable
RUN chmod +x /app/scripts/process_dicom.py

# Set environment variables
ENV PYTHON_PATH=/opt/venv/bin/python3
ENV PYTHONPATH=/opt/venv/lib/python3.9/site-packages
ENV NODE_ENV=production
ENV NODE_PATH=/app/dist
ENV PATH="/opt/venv/bin:$PATH"

# Expose the port the app runs on
EXPOSE 4000

CMD ["yarn", "start"] 