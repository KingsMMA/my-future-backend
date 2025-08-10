const { MongoClient } = require("mongodb");
const {checkPassword, hashPassword} = require("./crypt");
const {v4} = require("uuid");
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

    async getUserByUuid(uuid) {
        if (!uuid) return null;

        const user = await this.getDb()
            .collection("users")
            .findOne({ uuid });
        if (!user) return null;

        return {
            uuid: user.uuid,
            email: user.email,
            points: user.points,
            name: user.name,
            accountType: user.accountType,
            address: user.address,
            pfp: user.pfp,
            contributedTo: user.contributedTo || [],
        };
    }

    /**
     * Creates a new user in the database.
     * @param user The <b>validated</b> user data
     * @return {Promise<{uuid: string, email: string, accountType: string}|null>} The created user data or null if the email is already registered
     */
    async createUser(user) {
        if (await this.getDb()
            .collection("users")
            .findOne({ email: user.email }))
            return null;

        let uuid;
        do {
            uuid = v4();
        } while (await this.getDb()
            .collection("users")
            .findOne({ uuid }));
        Object.assign(user, {
            uuid,
            points: 10,
            password: hashPassword(user.password),
            contributedTo: [],
        });

        const result = await this.getDb()
            .collection("users")
            .insertOne(user);
        if (!result.acknowledged) return null;

        return {
            uuid: user.uuid,
            email: user.email,
            accountType: user.accountType,
        };
    }

    async listProjects() {
        return await this.getDb()
            .collection("projects")
            .find({}, { projection: { _id: 1, name: 1, description: 1, category: 1, dateStarted: 1, dateCompleted: 1, thumbnail: 1, progress: 1, goal: 1 } })
            .toArray();
    }

    async getProjectById(id) {
        if (!id) return null;

        return await this.getDb()
            .collection("projects")
            .findOne({ id: id }, { projection: { _id: 0, citizenContributions: 0 } });
    }

    /**
     * Creates a new project in the database.
     * @param project The <b>validated</b> project data
     * @return {Promise<boolean | null>} True if the project was created successfully, false if a project with the same id already exists, or null if an error occurred
     */
    async createProject(project) {
        if (await this.getDb()
            .collection("projects")
            .findOne({ id: project.id }))
            return false;

        Object.assign(project, {
            progress: 0,
            citizenContributions: [],
            businessDonations: [],
            dateStarted: new Date(),
        });

        const result = await this.getDb()
            .collection("projects")
            .insertOne(project);
        if (!result.acknowledged) return null;

        return true;
    }
}

const MONGO_URI = process.env.MONGO_URI;
const databaseConnector = new DatabaseConnector(MONGO_URI);

module.exports = databaseConnector;
