'use client'
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";
import { Controller } from "react-hook-form";
import ImageAudio from '../../../../public/assets/images/png/audio.png';
import ImageDWG from '../../../../public/assets/images/png/dwg.png';
import ImageEmail from '../../../../public/assets/images/png/email.png';
import ImagePDF from '../../../../public/assets/images/png/pdf.png';
import ImageSTL from '../../../../public/assets/images/png/stl.png';
import ImageVideo from '../../../../public/assets/images/png/video.png';
import ImageZIP from '../../../../public/assets/images/png/zip.png';
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";

export function FileUpload({ form, name, disabled }: SelectControllerProps) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropzone}
                    className={`bg-background rounded-lg p-1 w-full ${disabled ? 'opacity-50' : ''}`}
                >
                    <FileInput className={`outline-dashed outline-1 outline-primary p-3 ${disabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                        <div className="flex items-center justify-center p-1">
                            <FileSvgDraw />
                        </div>
                    </FileInput>
                    {field.value && field.value.length > 0 && (
                        <ScrollArea className="whitespace-nowrap rounded-md border">
                            <FileUploaderContent className="flex flex-row">
                                {field.value.map((file: File, i: number) => {
                                    const imageURL = blobLink(file);
                                    const extension = getCaptureFileExtension(file.name);

                                    return (
                                        <FileUploaderItem key={i} index={i} aria-roledescription={`file ${i + 1} containing ${file.name}`} className=" min-w-24 h-20">
                                            <AspectRatio ratio={16 / 8}>
                                                <Image
                                                    src={buildFilesThumbnails(file, extension, imageURL)}
                                                    alt={file.name}
                                                    className="object-cover rounded-md"
                                                    fill
                                                />
                                            </AspectRatio>
                                        </FileUploaderItem>
                                    )
                                })}
                            </FileUploaderContent>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </FileUploader>
            )}
        />
    )
}

const FileSvgDraw = () => {
    return (
        <div className="flex items-center justify-center gap-1" >
            <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Clique para fazer upload</span>
                &nbsp; ou arraste e solte
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
            </p>
        </div>
    );
};

const dropzone = {
    accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".svg"],
        "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm"],
        "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aac"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc", ".docx"],
        "application/vnd.ms-excel": [".xls", ".xlsx"],
        "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
        "text/plain": [".txt"],
        "application/zip": [".zip", ".rar"],
        "application/octet-stream": [".bin"],
        "application/vnd.ms-outlook": [".msg", ".eml"],  // Email files
        "model/3mf": [".3mf"],  // 3D Manufacturing Format
        "model/gltf+json": [".gltf"],  // GLTF
        "model/gltf-binary": [".glb"],  // GLB
        "model/iges": [".iges", ".igs"],  // IGES
        "model/mesh": [".msh"],  // MSH
        "model/stl": [".stl"],  // STL
        "model/vrml": [".wrl"],  // VRML
        "model/x3d+xml": [".x3d"],  // X3D
        "application/sla": [".stl"],  // Stereolithography
        "application/x-step": [".step", ".stp"],  // STEP
        "application/x-3ds": [".3ds"],  // 3DS
        "application/vnd.autodesk.dwfx": [".dwfx"],  // DWFx
        "application/vnd.autocad.dwg": [".dwg"],  // DWG
        "application/vnd.autocad.dxf": [".dxf"],  // DXF
    },
    multiple: true,
    maxFiles: 100,
    maxSize: 1 * 1024 * 1024 * 1024,
} satisfies DropzoneOptions;

const imageFiles: Record<string, any> = {
    default: (filename: any) =>
        filename.urlAttach,
    "pdf": ImagePDF,
    "mpeg": ImageAudio,
    "mp3": ImageAudio,
    "wma": ImageAudio,
    "wav": ImageAudio,
    ".wav": ImageAudio,
    ".ogg": ImageAudio,
    ".flac": ImageAudio,
    ".aac": ImageAudio,
    "mp4": ImageVideo,
    "wmv": ImageVideo,
    "mkv": ImageVideo,
    "msg": ImageEmail,
    "stl": ImageSTL,
    "dwg": ImageDWG,
    "zip": ImageZIP,
    "rar": ImageZIP,
}

function blobLink(img: any) {
    try {
        return URL.createObjectURL(img);
    } catch (error) {
        return img;
    }
}

function buildFilesThumbnails(el: any, extension: string, url: string) {
    return (
        imageFiles[extension] ?? ((el.id || el.attachId) ? el.urlAttach : url)
    )
}

function getCaptureFileExtension(name: string) {
    const length = name?.length;

    const extension: any = [];

    for (const index in name?.split("")) {
        if (name[length - Number(index)] !== ".") {
            extension.push(name[length - Number(index)]);
        } else {
            break;
        }
    }

    return extension.reverse().join("");
}