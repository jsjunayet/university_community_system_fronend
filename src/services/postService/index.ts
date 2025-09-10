"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

//  get all posts
export const getAllPost = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/post/all-retreive-user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["post"], // Optional Next.js cache control
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getMyPost = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${(await cookies()).get("accessToken")!.value}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["post"], // Optional Next.js cache control
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getAllPostForAdmin = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/post/all-retreive-admin`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["post"], // Optional Next.js cache control
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

// create post
export const createPost = async (
  postData: Record<string, any>
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/post/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const result = await res.json();
    revalidateTag("post");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const postAprroved = async (
  id: string,
  status: string
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/post/approve/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    const result = await res.json();
    revalidateTag("post");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const createVote = async (data: Record<string, any>): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/vote/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    revalidateTag("post");
    return res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const createComment = async (
  data: Record<string, any>
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/comment/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    revalidateTag("post");
    return res.json();
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const DeletedPost = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/post/deleted/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    revalidateTag("post");

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
