"use server";
import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
// import { FieldValues } from "react-hook-form";

export const SignUpUser = async (userData: FieldValues) => {
  console.log(userData);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/register`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const result = await res.json();
    console.log(result);
    // if (result.success) {
    //   (await cookies()).set("accessToken", result.data.accessToken);
    //   //   (await cookies()).set("refreshToken", result?.data?.refreshToken);
    // }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    console.log(res);

    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);

      revalidateTag("loginUser");
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
export const tokenFornotification = async (userData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/notify/save-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
// export const dashbaordOverview = async (): Promise<any> => {
//   const token = (await cookies()).get("accessToken")!.value;

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/metadata`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         next: {
//           tags: ["loginUser", "post", "category"],
//         },
//       }
//     );

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };
// export const analyticsOverview = async (): Promise<any> => {
//   const token = (await cookies()).get("accessToken")!.value;

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/post/admin/analytics`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         next: {
//           tags: ["loginUser", "post", "category"],
//         },
//       }
//     );

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     throw new Error(error.message || "Something went wrong");
//   }
// };

export const singleUserget = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/single-retreive/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["loginUser"],
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getAlluser = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/all-retreive`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["loginUser"],
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getAllDashbaordData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/admin/metadata`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["loginUser"],
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const DeletedUser = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/deleted/${id}`,
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
    revalidateTag("loginUser");

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const UpdateRole = async (id: string, payload: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/role/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    revalidateTag("loginUser");

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const PasswordChange = async (payload: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/changePassword`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            (await cookies()).get("accessToken")!.value
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    revalidateTag("loginUser");

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
export const getCurrentUser = async () => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // First decode the token to get basic user info
    const decodedData = jwtDecode(accessToken);
    console.log("Decoded token:", decodedData);

    // Then fetch complete user data from the server
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["loginUser"],
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user data", res.status);
      // If server request fails, still return decoded token data as fallback
      return decodedData;
    }

    const userData = await res.json();
    console.log("Fetched user data:", userData);

    if (userData.success) {
      return userData.data;
    } else {
      // If API returns success:false, fall back to decoded token
      return decodedData;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
  revalidateTag("loginUser");
};
