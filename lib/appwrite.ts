import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Models,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.shadowTech.beta",
  projectId: "672687d9002c49f2666b",
  databaseId: "67268c1000213656fcef",
  userCollectionId: "67268c4c000728c62471",
  videoCollectionId: "67268c82002889563c27",
  storageId: "67268e34000c9040292c",
};
const 
{endpoint,
platform,
projectId,
databaseId,
userCollectionId,
videoCollectionId,
storageId,} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

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
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
    )
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    )
    return posts.documents;
  } catch (error) {
    throw new Error(String(error));
  }
}

export { Models };
