/* eslint-disable array-callback-return */
'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { JIRA_PROXY_URL } from '@/config/env/jira-proxy-url'

const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase()
  switch (extension) {
    case 'doc':
    case 'docx':
      return <FileTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
    case 'xls':
    case 'xlsx':
    case 'csv':
      return (
        <FileSpreadsheetIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
      )
    case 'pdf':
      return <FileIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
    default:
      return <FileIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
  }
}

const AttachmentThumbnail = ({ attachment, onClick }) => {
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
    attachment.filename.split('.').pop().toLowerCase(),
  )

  const handleDownload = (e) => {
    e.stopPropagation()
    const downloadUrl = `${JIRA_PROXY_URL}=${encodeURIComponent(attachment.content)}`
    window.open(downloadUrl, '_blank')
  }

  return (
    <Card
      className="w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 flex flex-col items-center justify-between overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-1 sm:p-2 relative w-full h-20 sm:h-24 flex items-center justify-center">
        {isImage ? (
          <img
            src={`${JIRA_PROXY_URL}${encodeURIComponent(attachment.thumbnail)}`}
            alt={attachment.filename}
            className="max-w-full max-h-[50vh] sm:max-h-[70vh] object-contain"
          />
        ) : (
          getFileIcon(attachment.filename)
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
          {attachment.filename}
        </div>
      </CardContent>
      <div className="flex justify-between w-full p-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDownload}>
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </Card>
  )
}

const ImageControls = ({
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  isFullscreen,
  onResetZoom,
  zoomPercentage,
}) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full p-2 flex space-x-2 z-50 items-center">
    <Button size="icon" variant="ghost" onClick={onZoomIn}>
      <ZoomIn className="h-4 w-4 text-white" />
    </Button>
    <Button size="icon" variant="ghost" onClick={onZoomOut}>
      <ZoomOut className="h-4 w-4 text-white" />
    </Button>
    <Button size="icon" variant="ghost" onClick={onToggleFullscreen}>
      {isFullscreen ? (
        <Minimize className="h-4 w-4 text-white" />
      ) : (
        <Maximize className="h-4 w-4 text-white" />
      )}
    </Button>
    <Button size="icon" variant="ghost" onClick={onResetZoom}>
      <FileIcon className="h-4 w-4 text-white" />
    </Button>
    <span className="text-white text-sm">
      {Math.round(zoomPercentage * 100)}%
    </span>
  </div>
)

const AttachmentPreview = ({
  attachments,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const attachment = attachments[currentIndex]
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
    attachment.filename.split('.').pop().toLowerCase(),
  )
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'Escape') {
        setIsFullscreen(false)
        resetZoom()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrevious, onNext])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1))
  }, [])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback(
    (e) => {
      if (scale > 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        setPosition({ x: newX, y: newY })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const fileNameWithoutExtension = attachment.filename
    .split('.')
    .slice(0, -1)
    .join('.')

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-11/12 max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-base">
            {fileNameWithoutExtension}
          </DialogTitle>
        </DialogHeader>
        <div
          className="flex-grow relative overflow-hidden cursor-move"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-full w-full flex items-center justify-center">
            {isImage ? (
              <img
                ref={imageRef}
                src={`/api/jira-proxy?url=${attachment.content}`}
                alt={attachment.filename}
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out select-none"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center center',
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-100 rounded">
                {getFileIcon(attachment.filename)}
                <p className="mt-2 sm:mt-4 text-center text-sm sm:text-base">
                  Preview não disponível para este tipo de arquivo.
                  <br />
                  Por favor, faça o download para visualizar.
                </p>
              </div>
            )}
            {isImage && (
              <ImageControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onToggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
                onResetZoom={resetZoom}
                zoomPercentage={scale}
              />
            )}
          </div>
          {attachments.length > 1 && (
            <>
              <Button
                className="fixed top-1/2 left-2 transform -translate-y-1/2"
                onClick={onPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                className="fixed top-1/2 right-2 transform -translate-y-1/2"
                onClick={onNext}
                disabled={currentIndex === attachments.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const AttachmentThumbnails = ({ attachments }) => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const handlePreview = (index) => {
    setPreviewIndex(index)
  }

  const handleClosePreview = () => {
    setPreviewIndex(null)
  }

  const handlePreviousAttachment = () => {
    setPreviewIndex((prevIndex) =>
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex,
    )
  }

  const handleNextAttachment = () => {
    setPreviewIndex((prevIndex) =>
      prevIndex !== null && prevIndex < attachments.length - 1
        ? prevIndex + 1
        : prevIndex,
    )
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="border rounded-md p-4 text-center text-gray-500">
        Nenhum arquivo anexado.
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-2 sm:gap-4 p-2 sm:p-4 w-full h-full overflow-x-auto">
        {attachments.map((attachment, index) => {
          ;<AttachmentThumbnail
            key={attachment.id}
            attachment={attachment}
            onClick={() => handlePreview(index)}
          />
        })}
      </div>
      {previewIndex !== null && (
        <AttachmentPreview
          attachments={attachments}
          currentIndex={previewIndex}
          onClose={handleClosePreview}
          onPrevious={handlePreviousAttachment}
          onNext={handleNextAttachment}
        />
      )}
    </div>
  )
}

export default AttachmentThumbnails
