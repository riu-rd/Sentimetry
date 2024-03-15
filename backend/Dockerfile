FROM python:3.11.8

WORKDIR /

# Copy requirements.txt to the container
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Add a non-root user to run the application
RUN useradd -m -u 1000 user

# Set the user and home directory environment variables
USER user
ENV HOME=/home/user \
  PATH=/home/user/.local/bin:$PATH

# Create the application directory
WORKDIR $HOME/app

# Copy the application code and model files
COPY --chown=user . $HOME/app/

# Ensure the directory for the SavedModel exists
RUN mkdir -p prod_models/emo_model_tf

# Specify the correct path to the SavedModel
ENV SAVED_MODEL_PATH=$HOME/app/prod_models/emo_model_tf

# Expose the port the FastAPI app runs on
EXPOSE 7860

# Command to run the FastAPI app
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]