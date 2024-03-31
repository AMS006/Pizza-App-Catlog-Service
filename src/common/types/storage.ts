export interface FileStorage {
    upload(fileData: ArrayBuffer, filePath: string): Promise<void>;
    delete(filePath: string): Promise<void>;
    getObjectUri(filePath: string): string;
}
