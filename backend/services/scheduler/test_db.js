const mysql = require("mysql2/promise");

const testDB = async () => {
    try {
        const connection = await mysql.createConnection({
            user: "avnadmin",
            password: "AVNS_usW6GsGWX_qbc6xq9zJ",
            database: "defaultdb",
            host: "crescendo-service-crescendo-admin-portal.l.aivencloud.com",
            port: 24922,
        });
        console.log(" Database connected!");
        await connection.end();
    } catch (error) {
        console.error(" Database connection failed:", error.message);
    }
};

testDB();
