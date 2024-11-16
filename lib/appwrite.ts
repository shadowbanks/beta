import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Models,
  Storage,
  ImageGravity,
} from "react-native-appwrite";
import { formType } from "../app/(tabs)/create";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.shadowTech.beta",
  projectId: "672687d9002c49f2666b",
  databaseId: "67268c1000213656fcef",
  userCollectionId: "67268c4c000728c62471",
  videoCollectionId: "67268c82002889563c27",
  storageId: "6735248a001aaaa2e48f",
};
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) {
      throw new Error("Account not created");
    }
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getSession = async () => {
  try {
    const sessions = await account.listSessions();
    return sessions.sessions.length > 0 ? sessions.sessions[0] : null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const deleteSession = async (sessionId: string) => {
  try {
    await account.deleteSession(sessionId);
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

export const getCurrentUser = async (): Promise<Models.Document | null> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getFilePreview = async (
  fileId: string,
  type: "image" | "video"
) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = await storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = await storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error();
    }

    if (!fileUrl) {
      throw new Error("File not found");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error in getFilePreview:", error);
    throw new Error(String(error));
  }
};

type VideoType = formType["video"];
type ThumbnailType = formType["thumbnail"];

export const uploadFile = async (
  file: VideoType | ThumbnailType,
  type: "image" | "video"
) => {
  if (!file) return;

  const assest = {
    name: file.fileName || "",
    type: file.mimeType || "",
    size: file.fileSize || 0,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      assest
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw new Error(String(error));
  }
};

interface createVideoProps extends formType {
  userId: string;
}

export const createVideo = async (form: createVideoProps) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error in createVideo:", error);
    throw new Error(String(error));
  }
};

export { Models };
