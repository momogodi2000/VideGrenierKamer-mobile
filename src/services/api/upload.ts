import apiClient from './client';

export interface UploadResponse {
  url: string;
  key: string;
  mime: string;
}

export const uploadApi = {
  async uploadFile(file: FormData): Promise<UploadResponse> {
    return apiClient.upload<UploadResponse>('/mobile/api/upload/', file);
  },

  async uploadImage(file: FormData): Promise<UploadResponse> {
    return apiClient.upload<UploadResponse>('/mobile/api/upload/image/', file);
  },

  async deleteFile(key: string): Promise<void> {
    return apiClient.delete(`/mobile/api/upload/${key}/`);
  },
};
