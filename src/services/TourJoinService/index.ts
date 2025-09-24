"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getMyGroupJoin = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tour-join/my-joins`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["tour"], // Optional Next.js cache control
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const ApprovedOrRejectedStatusGroupJoin = async (
  id: string,
  status: string
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tour-join/${id}/verify`,
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

export const CreateTourGroupJoin = async (payload: any): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/tour-join`, {
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
