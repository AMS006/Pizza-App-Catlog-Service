import cloudinary from "cloudinary";
import config from "config";

cloudinary.v2.config({
    cloud_name: config.get("cloudinary.cloudName"),
    api_key: config.get("cloudinary.apiKey"),
    api_secret: config.get("cloudinary.apiSecret"),
});

export default class CloudinaryUpload {
    async upload(file: Buffer, folder: string) {
        return new Promise<string[]>((resolve, reject) => {
            cloudinary.v2.uploader
                .upload_stream(
                    {
                        folder,
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve([result!.secure_url, result!.public_id]);
                        }
                    },
                )
                .end(file);
        });
    }

    async delete(publicId: string) {
        await cloudinary.v2.uploader.destroy(publicId);
    }

    async getObjectUrl(publicId: string) {
        return cloudinary.v2.utils.url(publicId);
    }
}
