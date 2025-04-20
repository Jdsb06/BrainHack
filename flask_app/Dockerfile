FROM python:3.9-slim

WORKDIR /app

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV FLASK_ENV=production
ENV FLASK_PORT=8080
ENV ALLOWED_ORIGINS="http://localhost:9002,http://localhost:3000,http://localhost:8080,https://your-production-domain.com"

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app", "--workers", "4"]
