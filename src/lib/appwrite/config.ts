import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appWriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APP_DATABASE_ID,
  userCollectionId: import.meta.env.VITE_APP_USERS,
  postCollectionId: import.meta.env.VITE_APP_POSTS,
  storageId: import.meta.env.VITE_APP_STORAGE_ID,
  savedCollectionId: import.meta.env.VITE_APP_SAVES,
};

export const client = new Client();

client.setEndpoint(import.meta.env.VITE_APPWRITE_URL);
client.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
