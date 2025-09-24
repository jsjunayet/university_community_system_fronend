"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllUserJobPost = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${(await cookies()).get("accessToken")!.value}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["event"], // Optional Next.js cache control
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getAllAdminJobPost = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${(await cookies()).get("accessToken")!.value}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["event"], // Optional Next.js cache control
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getOwnJobPost = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${(await cookies()).get("accessToken")!.value}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["event"], // Optional Next.js cache control
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const ApprovedJobPost = async (
  id: string,
  status: string
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/job/${id}/status`,
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
    revalidateTag("event");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const CreateJobPost = async (payload: any): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/job`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    revalidateTag("event");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
