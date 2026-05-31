import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  sessionSecret:
    process.env.SESSION_SECRET ?? "dev-only-change-this-secret-before-production-use",
  mysql: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  remediationEmail: (process.env.REMEDIATION_EMAIL ?? "remediation@oasisci.com").trim(),
  remediationPhone: (process.env.REMEDIATION_PHONE ?? "").trim(),
};

