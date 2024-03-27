# Blockchain Processing Simulation

This project simulates blockchain processing using a microservices architecture developed with NestJS. It includes two main services: a blockchain service acting as a front controller (API gateway) and a block-processor service handling the core business logic.

## Installation

### Prerequisites:
- Docker: Ensure Docker is installed on your system. If not, install it from [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Getting Started:
1. With Docker running, clone the project repository.
2. Navigate to the project directory.
3. Execute the following command to build and run the services:



## Project Structure

- **Blockchain Service**: Serves as the API gateway. It includes a controller with a `getState` method, triggered by an HTTP request (e.g., `http://0.0.0.0:9999/state?fileName=blocks.json&blockNumber=2`). This service generates a session string for each request to separate data per request.
- **Block-Processor Service**: Contains logic to process blockchain data. It includes methods for processing blocks and retrieving file state based on a session.
- **Communication**: Services communicate using the messaging mechanism from `@nestjs/microservices`. The default TCP transport can be swapped for other message queues like Redis, RabbitMQ, or Kafka.
- **Data Processing**: The block-processor service processes data in chunks and employs a mutex strategy to prevent race conditions.

## Key Features and Methods

- **Blockchain Service**:
- `getState`: Retrieves the state by making an HTTP request.
- **Block-Processor Service**:
- `processBlocks`: Initiates the block processing requested by the blockchain service.
- `getFileState`: Retrieves data based on the session.

## Limitations and Future Improvements

- **Testing**: Currently, the project includes only partial unit tests.
- **Configuration**: There's no environment configuration to manage parameters like chunk size or file locations.
- **Error Handling**: Missing file or block-not-found scenarios are not adequately handled.

## Notes

- This setup is designed for demonstration purposes and showcases how blockchain data can be processed using a microservices architecture in NestJS.
- The project's architecture facilitates easy scaling and adaptation, such as transitioning to a WebSocket approach for handling requests.


