const GCP_projectId = process.env.GCP_PROJECT_ID || "_";
const GCP_bucketName = process.env.GCP_BUCKET_NAME || "_";
const SERVICE_ACCOUNT_CREDENTIALS = process.env.SERVICE_ACCOUNT_CREDENTIALS || "{}";

const GCP_serviceAccountCredentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS);

export { GCP_projectId, GCP_bucketName, GCP_serviceAccountCredentials };
