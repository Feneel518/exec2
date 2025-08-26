import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => ({ userId: "anonymous" }))
    .onUploadComplete(async ({ file, metadata }) => ({
      fileUrl: file.url,
      uploadedBy: metadata.userId,
    })),
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => ({ userId: "anonymous" }))
    .onUploadComplete(async ({ file, metadata }) => ({
      fileUrl: file.url,
      uploadedBy: metadata.userId,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
