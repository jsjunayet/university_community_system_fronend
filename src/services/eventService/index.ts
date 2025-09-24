"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getEvenUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event`, {
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
export const getEventForAdmin = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/admin`, {
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
export const getOwnEvent = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/event/my-events`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["event"], // Optional Next.js cache control
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const deletedEvent = async (id: string): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    revalidateTag("event");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
export const updateEvent = async (id: string, payload: any): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/event/${id}`, {
      method: "PATCH",
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
export const ApprovedEvent = async (
  id: string,
  status: string
): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/event/${id}/approve`,
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
export const CreateEvent = async (payload: any): Promise<any> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/event/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const result = await res.json();
    revalidateTag("event");
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};
