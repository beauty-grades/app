import { generateMimeTypes } from "uploadthing/client"
import type { DANGEROUS__uploadFiles } from "uploadthing/client"
import type { ExpandedRouteConfig, FileRouter } from "uploadthing/server"

import { useUploadThing } from "./useUploadThing"

type EndpointHelper<TRouter extends void | FileRouter> = void extends TRouter
  ? "YOU FORGOT TO PASS THE GENERIC"
  : keyof TRouter

const generatePermittedFileTypes = (config?: ExpandedRouteConfig) => {
  const fileTypes = config ? Object.keys(config) : []

  const maxFileCount = config
    ? Object.values(config).map((v) => v.maxFileCount)
    : []

  return { fileTypes, multiple: maxFileCount.some((v) => v && v > 1) }
}

const capitalizeStart = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const INTERNAL_doFormatting = (config?: ExpandedRouteConfig): string => {
  if (!config) return ""

  const allowedTypes = Object.keys(config) as (keyof ExpandedRouteConfig)[]

  const formattedTypes = allowedTypes.map((f) => (f === "blob" ? "file" : f))

  // Format multi-type uploader label as "Supports videos, images and files";
  if (formattedTypes.length > 1) {
    const lastType = formattedTypes.pop()
    return `${formattedTypes.join("s, ")} and ${lastType}s`
  }

  // Single type uploader label
  const key = allowedTypes[0]
  const formattedKey = formattedTypes[0]

  // @ts-ignore
  const { maxFileSize, maxFileCount } = config[key]!

  if (maxFileCount && maxFileCount > 1) {
    return `${formattedKey}s up to ${maxFileSize}, max ${maxFileCount}`
  } else {
    return `${formattedKey} (${maxFileSize})`
  }
}

const allowedContentTextLabelGenerator = (
  config?: ExpandedRouteConfig
): string => {
  return capitalizeStart(INTERNAL_doFormatting(config))
}

/**
 * @example
 * <UploadButton<OurFileRouter>
 *   endpoint="someEndpoint"
 *   onUploadComplete={(res) => console.log(res)}
 *   onUploadError={(err) => console.log(err)}
 * />
 */

export function UploadButton<TRouter extends void | FileRouter = void>(props: {
  endpoint: EndpointHelper<TRouter>
  onClientUploadComplete?: (
    res?: Awaited<ReturnType<typeof DANGEROUS__uploadFiles>>
  ) => void
  onUploadError?: (error: Error) => void
}) {
  const { startUpload, isUploading, permittedFileInfo } =
    useUploadThing<string>({
      endpoint: props.endpoint as string,
      onClientUploadComplete: props.onClientUploadComplete,
      onUploadError: props.onUploadError,
    })

  const { fileTypes, multiple } = generatePermittedFileTypes(
    permittedFileInfo?.config
  )

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <label className="flex h-10 w-36 cursor-pointer items-center justify-center rounded-md bg-blue-600">
        <input
          className="hidden"
          type="file"
          multiple={multiple}
          accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
          onChange={(e) => {
            if (!e.target.files) return
            void startUpload(Array.from(e.target.files))
          }}
        />
        <span className="px-3 py-2 text-white">
          {isUploading ? <Spinner /> : `Choose File${multiple ? `(s)` : ``}`}
        </span>
      </label>
      <div className="h-[1.25rem]">
        {fileTypes && (
          <p className="text-xs leading-5 text-gray-600">
            {allowedContentTextLabelGenerator(permittedFileInfo?.config)}
          </p>
        )}
      </div>
    </div>
  )
}

const Spinner = () => {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 576 512"
    >
      <path
        fill="currentColor"
        d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
      />
    </svg>
  )
}
