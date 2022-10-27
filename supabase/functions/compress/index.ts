// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
// import Compressor from "compressorj";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

console.log(`Compress Running!`);

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const dataURLtoFile = (dataurl: string) => {
  const arr = dataurl.split(","),
    bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], "compressed", { type: "image/jpeg" });
};

// const handleCompressedUpload = (image) => {
//   new Compressor(image, {
//     quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
//     success: (compressedResult) => {
//       // compressedResult has the compressed file.
//       // Use the compressed file to upload the images to your server.
//       console.log("asdasdsadsa", compressedResult);
//     },
//   });
// };

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    const convertedImage: File = dataURLtoFile(`${image}`);
    // const compressedImage = handleCompressedUpload(convertedImage);
    const data = await toBase64(convertedImage);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
