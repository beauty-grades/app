"use client"

import { OurFileRouter } from "@/app/api/uploadthing/core"
import { UploadButton as UTUploadButton } from "@uploadthing/react"
import { DANGEROUS__uploadFiles } from "uploadthing/client"

interface UploadImageButtonProps {
  multiple?: boolean | undefined
  onClientUploadComplete?:
    | ((res?: Awaited<ReturnType<typeof DANGEROUS__uploadFiles>>) => void)
    | undefined
  onUploadError?: ((error: Error) => void) | undefined
}

export const UploadImageButton = ({
  onClientUploadComplete,
  onUploadError,
}: UploadImageButtonProps) => {
  return (
    <UTUploadButton<OurFileRouter>
      endpoint="imageUploader"
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
    />
  )
}
