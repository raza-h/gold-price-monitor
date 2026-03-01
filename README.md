# Gold Price Scraper & Kafka Producer ⛏️📈

A lightweight Node.js cron job that scrapes gold prices periodically, stores changes in a SQLite database, and produces Kafka events when price thresholds are crossed. Perfect for automated monitoring and real-time alerting systems.

## Features

- ✨ Scrapes live gold prices from an API or website  
- 💾 Stores price history in a SQLite database  
- 🚀 Produces Kafka events when price crosses configurable thresholds  
- ⚙️ Configurable via `.env` variables (API, thresholds, Kafka brokers, topic)  
- 🔄 Automated scheduling with cron for periodic scraping  

## Getting Started

### Prerequisites

- Node.js v18+  
- Kafka cluster access  
- SQLite3 installed (or included via npm)  

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Cron Schedules](#cron-schedules)
- [Contributing](#contributing)
- [License](#license)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/raza-h/gold-price-monitor.git
cd gold-price-monitor
yarn       # or npm i
yarn dev   # or npm run dev
```

## Configuration

1. Create a `.env` file in the root directory with the following variables:

    ```env
    # Kafka Configuration (Event Production)
    KAFKA_BROKER_URL=HOST:PORT

    # Price Alert Configuration
    THRESHOLD=5000
    ```

2. For production, if you want data persistence, you will need a named volume. See the `docker-compose.yml` for reference.

3. For local development and testing, add a data folder in the root directory and create `db.sqlite` file in that folder:
    ```bash
    mkdir data
    cd data
    touch db.sqlite
    ```
    Finally, navigate to config/sqlite.js and update `dbPath` from `/data` to `./data`.

## Project Structure

```
.
├── constants.js       # Configuration constants
├── index.js           # Cron setup
├── config/
│   ├── db.js          # SQLite database configuration
│   ├── producer.js    # Kafka producer configuration
│   └── logger.js      # Winston logger configuration
├── services/          # Modules handling gold price retrieval and processing
│   ├── jobs.js        # Instances of jobs responsible for sending notifications
│   ├── trackers.js    # Instances of in-memory tracking states
│   └── scrapers.js    # Web scraping functions for different websites
├── entities/
│   ├── RecordedPrice.js         # Implementation for state for previously recorded gold price
│   ├── ScrapeGoldPriceJob.js    # Implementation for scraping gold prices and generating events
│   └── Event.js                 # Implementation for Event creation and generation to Kafka broker / cluster
├── utils.js              # Shared utility functions (e.g. wrapError for structured error logging)
├── .env.example       # Example environment variables
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── yarn.lock
└── README.md
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `THRESHOLD` | Price change threshold for alerts | No | `5000` |
| `KAFKA_BROKER_URL` | Kafka broker url for event production | Yes | - |

## Cron Schedules

I've set up three cron schedules based on three sessions:
- Asian Session (Tokyo/Shanghai): 4:00 AM – 1:00 PM PKT. This session is usually calmer but can see movement based on Chinese and Japanese economic data.
- European Session (London): 1:00 PM – 10:00 PM PKT. This is a highly liquid period as the London market opens.
- North American Session (New York): 6:00 PM – 3:00 AM PKT. This session often brings high volatility due to U.S. economic news releases.

Schedules based on priority:
- Low Priority: 4:00 AM - 1:00 PM (check every hour)
- High Priority: 1:00 PM - 6:00 PM and 10:00 PM to 3:00 AM (check every 15 minutes)
- Very High Priority: 6:00 PM - 10:00 PM (check every 5 minutes)
- Break: 3:00 AM to 4:00 AM


```javascript
// Every 5 minutes from 6-10 PM on business days
*/5 18-21 * * 1-6

// Every 15 minutes from 1-6 PM and 10 PM - 3 AM
*/15 13-17,22-23,0-3 * * 1-6

// Every hour from 4 AM - 12 PM
0 4-12 * * 1-6
```

## Troubleshooting

### Common Issues

**Database setup:**
- Navigate to config/sqlite.js and update `dbPath` from `/data` to `./data` for local development and testing

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License
