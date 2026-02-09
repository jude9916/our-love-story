// Use stable NPM imports to prevent crashes
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

Deno.serve(async (req) => {
  // 1. Handle Handshake
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Safe Secret Retrieval (Auto-fix URL mistakes)
    let endpoint = Deno.env.get("R2_ENDPOINT") || "";
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");

    // Check if secrets are missing
    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error("Missing Secrets! Check Supabase Dashboard.");
    }

    // Auto-fix the URL if it's missing https:// or has double https://
    if (!endpoint.startsWith("http")) {
      endpoint = `https://${endpoint}`;
    }
    
    // 3. Connect to S3 (With error catching)
    const S3 = new S3Client({
      region: "auto",
      endpoint: endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    // 4. Parse Body
    const { filename, fileType } = await req.json();

    // 5. Generate URL
    const command = new PutObjectCommand({
      Bucket: "judeandsam", // Your bucket name
      Key: filename,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 60 });

    return new Response(
      JSON.stringify({ url: signedUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});