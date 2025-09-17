"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { BloodDonation } from "@/types";

export interface BloodRequestResponse {
  success: boolean;
  data: BloodDonation[];
  message?: string;
}

export const getAllUserBloodRequest = async (): Promise<BloodRequestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/donation-Request/user`,
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
    return {
      success: false,
      data: [],
      message: error.message
    };
  }
};
export const getAllAdminBloodRequest = async (): Promise<BloodRequestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/donation-Request`,
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
    return {
      success: false,
      data: [],
      message: error.message
    };
  }
};
export const getOwnBloodRequest = async (): Promise<BloodRequestResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/donation-Request/my`,
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
    return {
      success: false,
      data: [],
      message: error.message
    };
  }
};
export interface BloodRequestActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const ApprovedBloodRequest = async (
  id: string,
  status: "approved" | "rejected" | "completed" | "pending"
): Promise<BloodRequestActionResponse> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/donation-Request/${id}/verify`,
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
export interface BloodRequestPayload {
  bloodType: string;
  location: string;
  emergencyRequest?: boolean;
  requesterMessage?: string;
}

export const CreateBloodRequest = async (payload: BloodRequestPayload): Promise<BloodRequestActionResponse> => {
  const token = (await cookies()).get("accessToken")!.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/donation-Request`,
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
