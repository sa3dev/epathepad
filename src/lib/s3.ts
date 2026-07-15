import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

// Constructed lazily (not at module scope) so importing this module — e.g. during
// Next.js's build-time route analysis — never requires S3 env vars to be set.
let s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: requireEnv("S3_ENDPOINT"),
      credentials: {
        accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
      },
    });
  }
  return s3Client;
}

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

export async function createPresignedUploadUrl(params: {
  artistProfileId: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  if (!ALLOWED_CONTENT_TYPES.has(params.contentType)) {
    throw new Error(`Unsupported content type: ${params.contentType}`);
  }

  const bucket = requireEnv("S3_BUCKET");
  const extension = params.contentType.split("/")[1];
  const key = `artists/${params.artistProfileId}/${randomUUID()}.${extension}`;

  const uploadUrl = await getSignedUrl(
    getS3Client(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: params.contentType }),
    { expiresIn: 60 * 5 },
  );

  const publicBaseUrl = requireEnv("S3_PUBLIC_BASE_URL").replace(/\/$/, "");

  return { uploadUrl, publicUrl: `${publicBaseUrl}/${key}`, key };
}
