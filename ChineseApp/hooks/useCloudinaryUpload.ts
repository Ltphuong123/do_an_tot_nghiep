import * as ImagePicker from "expo-image-picker";

export const uploadCloudinary = async (image: ImagePicker.ImagePickerAsset) => {
  const data = new FormData();

  // Lấy mime type đúng
  const fileExt = image.uri.split(".").pop()?.toLowerCase();
  const mimeType =
    fileExt === "png"
      ? "image/png"
      : fileExt === "jpg" || fileExt === "jpeg"
      ? "image/jpeg"
      : "image/jpeg";

  data.append("file", {
    uri: image.uri,
    type: mimeType,
    name: image.fileName || `image.${fileExt || "jpg"}`,
  } as any);

  data.append("upload_preset", "my_preset");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dk6cteyfg/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();
  console.log("Cloudinary upload result:", result.secure_url);
  return result.secure_url;
};
