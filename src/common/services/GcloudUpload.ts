import { Storage } from "@google-cloud/storage";
import config from "config";
import { Logger } from "winston";
import { FileStorage } from "../types/storage";

export class GcloudUpload implements FileStorage {
    private storage: Storage;
    private bucketName: string = config.get("gcloud.bucketName");

    constructor(private logger: Logger) {
        this.storage = new Storage({
            keyFilename: "./src/common/services/key.json",
            projectId: config.get("gcloud.projectId"),
        });
    }

    async upload(fileData: ArrayBuffer, filePath: string) {
        try {
            const buffer = Buffer.from(fileData);
            await this.storage
                .bucket(this.bucketName)
                .file(filePath)
                .save(buffer, {
                    gzip: true,
                    public: true,
                    metadata: {
                        cacheControl: "public, max-age=31536000",
                    },
                });
        } catch (error) {
            this.logger.error(
                `Error uploading file to ${this.bucketName}`,
                error,
            );
        }
    }

    async delete(filePath: string) {
        try {
            await this.storage.bucket(this.bucketName).file(filePath).delete();
        } catch (error) {
            this.logger.error(
                `Error deleting ${filePath} from ${this.bucketName}`,
                error,
            );
        }
    }

    // get download Url
    getObjectUri(filePath: string): string {
        try {
            // const [url] = await this.storage.bucket(this.bucketName).file(filePath).getSignedUrl({
            //     action: "read",
            //     expires: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
            // });
            const url = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
            return url;
        } catch (error) {
            this.logger.error(
                `Error getting signed url for ${filePath}`,
                error,
            );
            return "";
        }
    }
}
