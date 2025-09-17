export const uploadImagesToCloudinary = async (files: any) => {
  const uploads = files.map(async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
    ); // Use environment variable
    // formData.append("cloud_name", "your_cloud_name"); // 🔁 Replace with your Cloudinary cloud name
    //    const res = await fetch(
    //   `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  });

  return Promise.all(uploads);
};

export const singleImageUpaload = async (file: any) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
  );
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.log(err);
  }
};
