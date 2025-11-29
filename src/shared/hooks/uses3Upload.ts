import { useState } from "react";
import api from "@/lib/axios";

interface UploadResult {
    fileUrl: string | null;
    uploadToS3: (file: File) => Promise<string | null>;
    loading: boolean;
    error: string | null;
}
export const useS3Upload = (): UploadResult => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadToS3 = async (file: File): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            // 1️⃣ Request signed URL from backend
            const { data } = await api.post("/api/signed-url", {
                fileName: file.name,
                fileType: file.type,
            });

            const { uploadUrl, fileUrl: finalUrl } = data;

            // 2️⃣ Upload directly to S3 using fetch
            const s3Response = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!s3Response.ok) {
                throw new Error("S3 upload failed");
            }

            setFileUrl(finalUrl);
            return finalUrl;

        } catch (err) {
            console.error("S3 upload error:", err);
            setError("Upload failed");
            return null;

        } finally {
            setLoading(false);
        }
    };

    return { fileUrl, uploadToS3, loading, error };
};
