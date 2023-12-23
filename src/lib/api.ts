import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
  account,
  appWriteConfig,
  avatars,
  databases,
  storage,
} from "./appwrite/config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarsUrl = avatars.getInitials(user.name);

    const newUser = await saveUserInDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarsUrl,
      username: user.username,
    });

    return newUser;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function saveUserInDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (err) {
    console.log(err);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (err) {
    console.log(err);
  }
}

export async function getCurrentAccount() {
  try {
    const currentAccount = await account.get();

    if (!createUserAccount) {
      throw Error;
    }

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (err) {
    console.log(err);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appWriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPosts() {
  const posts = await databases.listDocuments(
    appWriteConfig.databaseId,
    appWriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId,
      { likes: likesArray }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (err) {
    console.log(err);
  }
}

export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savedCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      savedId
    );

    if (!statusCode) throw Error;

    return { statusCode: "ok" };
  } catch (err) {
    console.log(err);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId
    );
    if (!post) throw Error;

    return post;
  } catch (err) {
    console.log(err);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId
    );

    return { status: "Ok" };
  } catch (err) {
    console.log(err);
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const query: any[] = [Query.orderDesc(`$updatedAt`), Query.limit(10)];

  if (pageParam) {
    query.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      query
    );

    if (!posts) throw Error;
    return posts;
  } catch (err) {
    console.log(err);
  }
}

export async function searchPost(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;
    return posts;
  } catch (err) {
    console.log(err);
  }
}


export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
