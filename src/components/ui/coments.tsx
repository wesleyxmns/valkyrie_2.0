'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { useComments } from "@/hooks/comments/use-comments";
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { getInitials } from "@/shared/functions/get-initials";
import { formatDate } from 'date-fns';
import { Bold, Italic, Palette, Paperclip, SendIcon, X } from 'lucide-react';
import Image from "next/image";
import { parseCookies } from "nookies";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import ImageAudio from '../../../public/assets/images/png/audio.png';
import ImageDWG from '../../../public/assets/images/png/dwg.png';
import ImageEmail from '../../../public/assets/images/png/email.png';
import ImagePDF from '../../../public/assets/images/png/pdf.png';
import ImageSTL from '../../../public/assets/images/png/stl.png';
import ImageVideo from '../../../public/assets/images/png/video.png';
import ImageZIP from '../../../public/assets/images/png/zip.png';
import { Label } from "./label";

interface TextFormat {
  bold: boolean;
  italic: boolean;
  color: string | null;
}

type Comment = {
  id: number;
  author: string;
  content: string;
}

interface CommentsDialogProps {
  showComponent?: boolean;
  issueKey?: string;
}

export function Comments({ issueKey, showComponent }: CommentsDialogProps) {
  const { useGetCommentsAndAttachs, useSendAttachments, useSendComment } = useBrynhildrData()

  const { user } = useAuth();
  const { '@valkyrie:auth-token': token } = parseCookies();
  const { comment, attachments, setComment, setAttachments } = useComments();
  const [localComment, setLocalComment] = useState(comment);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachs, setAttachs] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<TextFormat>({ bold: false, italic: false, color: null });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendComment = async () => {
    if (localComment.trim() !== '') {
      useSendComment(issueKey as string, localComment, token);
    }
  };

  const resetForm = () => {
    setLocalComment('');
    setComment('');
    setAttachments([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando um atraso

      if (issueKey) {
        if (attachments.length > 0) {
          useSendAttachments(issueKey, attachments);
        }

        await sendComment();
        toast.success('Comentário enviado com sucesso!');
        resetForm();
        getCommentsAndAttachs();
      }
    } catch (error) {
      toast.error('Erro ao enviar comentário. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFormatting = (text: string, format: TextFormat) => {
    let formattedText = text;
    if (format.bold) formattedText = `<b>${formattedText}</b>`;
    if (format.italic) formattedText = `<i>${formattedText}</i>`;
    if (format.color) formattedText = `<span style="color:${format.color}">${formattedText}</span>`;
    return formattedText;
  };

  const handleBlur = () => {
    setComment(localComment);
  };

  const insertFormattedText = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = comment.substring(start, end);

      if (selectedText) {
        const formattedText = applyFormatting(selectedText, currentFormat);
        const updatedComment = comment.substring(0, start) + formattedText + comment.substring(end);
        setComment(updatedComment);

        const newCursorPosition = start + formattedText.length;
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newCursorPosition;
            textareaRef.current.selectionEnd = newCursorPosition;
            textareaRef.current.focus();
          }
        }, 0);
      }
    }
  };

  const toggleFormat = (type: keyof TextFormat) => {
    setCurrentFormat(prev => {
      const newFormat = { ...prev, [type]: !prev[type] };
      if (type === 'color' && newFormat.color === null) {
        newFormat.color = '#000000';
      }
      return newFormat;
    });
    insertFormattedText();
  };

  const handleColorChange = (color: string) => {
    setCurrentFormat(prev => ({ ...prev, color }));
    insertFormattedText();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files);
      setAttachments([...attachments, ...newAttachments]);

      newAttachments.forEach((file) => {
        const attachmentLink = `!${file.name}|thumbnail!`;
        setComment(`${comment}${comment ? '\n' : ''}${attachmentLink}`);
      });
    }
  };

  const removeAttachment = (index: number) => {
    const removedAttachment = attachments[index];
    setAttachments(attachments.filter((_, i) => i !== index));

    const attachmentLink = `!${removedAttachment.name}|thumbnail!`;
    setComment(comment.replace(attachmentLink, '').trim());
  };

  async function getCommentsAndAttachs() {
    if (!issueKey) return;
    const { data: fields } = useGetCommentsAndAttachs(issueKey);
    setAttachs(fields.attachment);
    setComments(fields.comment.comments);
  }

  useEffect(() => {
    getCommentsAndAttachs();
  }, [])

  return (
    <Fragment>
      {showComponent && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline" >Ver Comentários</Button>
          </DialogTrigger>
          <DialogContent onPointerDownOutside={avoidDefaultDomBehavior} onInteractOutside={avoidDefaultDomBehavior} className="sm:w-full w-auto">
            <div className="flex flex-col md:flex-row gap-4 p-4">
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative border rounded-md">
                    <div className="absolute top-2 left-2 z-10 flex space-x-2">
                      <Button
                        type="button"
                        variant={currentFormat.bold ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => toggleFormat("bold")}
                      >
                        <Bold size={15} />
                      </Button>
                      <Button
                        type="button"
                        variant={currentFormat.italic ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => toggleFormat("italic")}
                      >
                        <Italic size={15} />
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="sm">
                            <Palette size={15} style={{ color: currentFormat.color || undefined }} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker
                            color={currentFormat.color || '#000000'}
                            onChange={handleColorChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={15} />
                      </Button>
                    </div>
                    <Textarea
                      ref={textareaRef}
                      placeholder="Adicione um comentário..."
                      value={localComment}
                      onChange={(e) => setLocalComment(e.target.value)}
                      onBlur={handleBlur}
                      className="min-h-[150px] pt-12"
                      style={{
                        fontWeight: currentFormat.bold ? 'bold' : 'normal',
                        fontStyle: currentFormat.italic ? 'italic' : 'normal',
                        color: currentFormat.color || 'inherit',
                      }}
                    />
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                  </div>
                  {attachments.length > 0 && (
                    <ScrollArea className="h-20 w-full rounded-md border">
                      <div className="flex p-2">
                        {attachments.map((attachment, index) => {
                          const extension = attachment.name.split('.').pop() || '';
                          const imageURL = blobLink(attachment);
                          return (
                            <div key={index} className="relative inline-block mr-2 last:mr-0">
                              <div className="rounded flex items-center justify-center overflow-hidden">
                                <Image
                                  src={buildFilesThumbnails(attachment, extension, imageURL)}
                                  width={50}
                                  height={50}
                                  alt={attachment.name}
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 p-1"
                                onClick={() => removeAttachment(index)}
                              >
                                <X size={15} />
                              </Button>
                              <p className="text-xs mt-1 truncate w-20">{attachment.name}</p>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  )}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Fragment>
                        <span className="mr-2">Enviando...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <SendIcon className="mr-2 h-4 w-4" /> Enviar Comentário
                      </Fragment>
                    )}
                  </Button>
                </form>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-4">Comentários</h2>
                {comments.length > 0 ? (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {comments.map((comment: Record<string, any>) => {
                      const avatarUrl = user?.getAvatarUrls()[`${48}x${48}`];
                      const proxyUrl = `/api/jira-proxy?url=${encodeURIComponent(avatarUrl ?? '')}`;
                      return (
                        <div key={comment.id} className="mb-4 pb-4 border-b last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={proxyUrl} alt="user-avatar" />
                              <AvatarFallback>{getInitials(comment.author.displayName)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{comment.author.displayName}</span>
                            <span className="text-sm text-gray-500">{formatDate(comment.created, 'dd/MM/yyyy')}</span>
                          </div>
                          <p className="mb-2" dangerouslySetInnerHTML={{ __html: comment.body }}></p>
                        </div>
                      )
                    })}
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[400px] w-full rounded-md border p-4">
                    <Label>Não existem comentários.</Label>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

function blobLink(file: File) {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Erro ao criar blobLink:", error);
    return '';
  }
}

function buildFilesThumbnails(file: File, extension: string, url: string) {
  const imageFiles: Record<string, any> = {
    "pdf": ImagePDF,
    "mp3": ImageAudio,
    "wav": ImageAudio,
    "ogg": ImageAudio,
    "flac": ImageAudio,
    "aac": ImageAudio,
    "mp4": ImageVideo,
    "wmv": ImageVideo,
    "mkv": ImageVideo,
    "msg": ImageEmail,
    "stl": ImageSTL,
    "dwg": ImageDWG,
    "zip": ImageZIP,
    "rar": ImageZIP,
  };

  return imageFiles[extension.toLowerCase()] || url;
}