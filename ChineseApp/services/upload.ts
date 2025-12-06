export const uploadImage = async (uri: string): Promise<string> => {
  // TODO: Implement image upload to server or cloud storage
  // For now, return the URI as is (server should handle URI to URL conversion)
  // Or use a service like Cloudinary, Firebase Storage, etc.

  // Example with imgbb (free image hosting):
  // const formData = new FormData();
  // formData.append('image', {
  //   uri,
  //   name: 'image.jpg',
  //   type: 'image/jpeg',
  // } as any);
  // const res = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
  //   method: 'POST',
  //   body: formData,
  // });
  // const data = await res.json();
  // return data.data.url;

  // For now, return URI (backend needs to handle this)
  return uri;
};
