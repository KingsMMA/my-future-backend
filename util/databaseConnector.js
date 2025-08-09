const { MongoClient } = require("mongodb");
const {checkPassword} = require("./crypt");
const RETRY_INTERVALS = [0, 5000, 5000];

class DatabaseConnector {
    constructor(uri) {
        this.uri = uri;
        this.client = null;
        this.db = null;
        this.isConnected = false;
        this.retryIndex = 0;
        this.connectWithRetry();
    }

    connectWithRetry() {
        const interval = RETRY_INTERVALS[this.retryIndex] ?? 30000;
        setTimeout(async () => {
            try {
                this.client = new MongoClient(this.uri, {
                    useUnifiedTopology: true,
                });
                await this.client.connect();
                this.db = this.client.db();
                this.isConnected = true;
                this.retryIndex = 0;
                console.log("Connected to MongoDB");
                this.client.on("close", this.handleDisconnect.bind(this));
            } catch (err) {
                this.isConnected = false;
                this.retryIndex++;
                console.error(
                    "MongoDB connection failed, retrying in",
                    interval / 1000,
                    "seconds",
                );
                this.connectWithRetry();
            }
        }, interval);
    }

    handleDisconnect() {
        this.isConnected = false;
        this.retryIndex = 0;
        console.error("MongoDB disconnected, retrying...");
        this.connectWithRetry();
    }

    getDb() {
        if (!this.isConnected) throw new Error("Not connected to MongoDB");
        return this.db;
    }

    async authenticate(email, password) {
        if (!email || !password) return null;

        const user = await this.getDb()
            .collection("users")
            .findOne({ email });
        if (!user?.password) return null;
        if (!await checkPassword(password, user.password)) return null;

        return {
            uuid: user.uuid,
            email: user.email,
            accountType: user.accountType,
        };
    }
}

const MONGO_URI = process.env.MONGO_URI;
const databaseConnector = new DatabaseConnector(MONGO_URI);

module.exports = databaseConnector;
