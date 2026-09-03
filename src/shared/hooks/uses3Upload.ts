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

            const { data } = await api.post("/api/signed-url", {
                fileName: file.name,
                fileType: file.type,
            });

            const responseData = data.data ? data.data : data;
            const { uploadUrl, fileUrl: finalUrl, provider, cloudinaryData } = responseData;

            if (provider === 'cloudinary' && cloudinaryData) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", cloudinaryData.apiKey);
                formData.append("timestamp", cloudinaryData.timestamp.toString());
                formData.append("signature", cloudinaryData.signature);
                formData.append("folder", cloudinaryData.folder);
                formData.append("public_id", cloudinaryData.publicId);

                const cloudinaryResponse = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData,
                });

                if (!cloudinaryResponse.ok) {
                    throw new Error("Cloudinary upload failed");
                }
            } else {
                // Upload directly to S3 using fetch
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
