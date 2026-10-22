"use client"

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  forwardRef,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, ExternalLink, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Project {
  id: string
  image: string
  title: string
  description?: string
  href?: string
}

export interface AnimatedFolderProps {
  title: string
  projects: Project[]
  description?: string
  href?: string
  badge?: string
  className?: string
  folderColor?: {
    back?: string
    front?: string
    tab?: string
  }
  onFolderClick?: () => void
  cardClickAction?: "lightbox" | "navigate" | "none"
  isOpen?: boolean
}

export function AnimatedFolder({
  title,
  projects,
  description,
  href,
  badge,
  className,
  folderColor,
  onFolderClick,
  cardClickAction = "lightbox",
  isOpen,
}: AnimatedFolderProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const isExpanded = isOpen !== undefined ? (isOpen || isHovered) : isHovered
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleProjectClick = (project: Project, index: number) => {
    if (cardClickAction === "none") return

    if (cardClickAction === "navigate" && (project.href || href)) {
      router.push(project.href || href!)
      return
    }

    const cardEl = cardRefs.current[index]
    if (cardEl) {
      setSourceRect(cardEl.getBoundingClientRect())
    }
    setSelectedIndex(index)
    setHiddenCardId(project.id)
  }

  const handleCloseLightbox = () => {
    setSelectedIndex(null)
    setSourceRect(null)
  }

  const handleCloseComplete = () => {
    setHiddenCardId(null)
  }

  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex)
    setHiddenCardId(projects[newIndex]?.id || null)
  }

  const handleFolderContainerClick = (e: React.MouseEvent) => {
    if (onFolderClick) onFolderClick()
    if (href) {
      router.push(href)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && href) {
      e.preventDefault()
      if (onFolderClick) onFolderClick()
      router.push(href)
    }
  }

  const dynamicStyle: React.CSSProperties = {
    minWidth: "280px",
    minHeight: "330px",
    perspective: "1000px",
    ...(folderColor?.back ? ({ "--folder-back": folderColor.back } as React.CSSProperties) : {}),
    ...(folderColor?.front ? ({ "--folder-front": folderColor.front } as React.CSSProperties) : {}),
    ...(folderColor?.tab ? ({ "--folder-tab": folderColor.tab } as React.CSSProperties) : {}),
  }

  return (
    <>
      <div
        role={href ? "link" : undefined}
        tabIndex={href ? 0 : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center select-none cursor-pointer",
          "p-4 transition-all duration-500 ease-out",
          "group focus-visible:outline-none",
          className,
        )}
        style={dynamicStyle}
        onClick={handleFolderContainerClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle background glow on hover or open */}
        <div
          className="absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--folder-front, var(--accent)) 0%, transparent 70%)",
            opacity: isExpanded ? 0.15 : 0,
          }}
        />

        <div className="relative flex items-center justify-center my-4" style={{ height: "160px", width: "200px" }}>
          {/* Folder back layer - z-index 10 */}
          <div
            className="absolute w-32 h-24 bg-folder-back rounded-lg shadow-md"
            style={{
              transformOrigin: "bottom center",
              transform: isExpanded ? "rotateX(-15deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Folder tab - z-index 10 */}
          <div
            className="absolute w-12 h-4 bg-folder-tab rounded-t-md"
            style={{
              top: "calc(50% - 48px - 12px)",
              left: "calc(50% - 64px + 16px)",
              transformOrigin: "bottom center",
              transform: isExpanded ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Project cards - z-index 20, between back and front */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                image={project.image}
                title={project.title}
                delay={index * 80}
                isVisible={isExpanded}
                index={index}
                isClickable={cardClickAction !== "none"}
                onClick={cardClickAction !== "none" ? () => handleProjectClick(project, index) : undefined}
                isSelected={hiddenCardId === project.id}
              />
            ))}
          </div>

          {/* Folder front layer - z-index 30 */}
          <div
            className="absolute w-32 h-24 bg-folder-front rounded-lg shadow-lg"
            style={{
              top: "calc(50% - 48px + 4px)",
              transformOrigin: "bottom center",
              transform: isExpanded ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
            }}
          />

          {/* Folder shine effect - z-index 31 */}
          <div
            className="absolute w-32 h-24 rounded-lg overflow-hidden pointer-events-none"
            style={{
              top: "calc(50% - 48px + 4px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
              transformOrigin: "bottom center",
              transform: isExpanded ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 31,
            }}
          />
        </div>

        {/* Folder title */}
        <h3
          className="text-lg font-semibold text-foreground mt-2 transition-all duration-300"
          style={{
            transform: isExpanded ? "translateY(2px)" : "translateY(0)",
          }}
        >
          {title}
        </h3>

        {/* Optional Description */}
        {description && (
          <p
            className="text-sm text-muted-foreground transition-all duration-300 text-center max-w-[220px] line-clamp-1 mt-0.5"
            style={{
              opacity: isExpanded ? 0.9 : 0.75,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {cardClickAction !== "none" && (
        <ImageLightbox
          projects={projects.slice(0, 3)}
          currentIndex={selectedIndex ?? 0}
          isOpen={selectedIndex !== null}
          onClose={handleCloseLightbox}
          sourceRect={sourceRect}
          onCloseComplete={handleCloseComplete}
          onNavigate={handleNavigate}
          parentHref={href}
        />
      )}
    </>
  )
}

export interface ImageLightboxProps {
  projects: Project[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  sourceRect: DOMRect | null
  onCloseComplete?: () => void
  onNavigate: (index: number) => void
  parentHref?: string
}

export function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  parentHref,
}: ImageLightboxProps) {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial")
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [internalIndex, setInternalIndex] = useState(currentIndex)
  const [prevIndex, setPrevIndex] = useState(currentIndex)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")
  const containerRef = useRef<HTMLDivElement>(null)

  const totalProjects = projects.length
  const hasNext = internalIndex < totalProjects - 1
  const hasPrev = internalIndex > 0

  const currentProject = projects[internalIndex]
  const targetHref = currentProject?.href || parentHref

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      const direction = currentIndex > internalIndex ? "left" : "right"
      setSlideDirection(direction)
      setPrevIndex(internalIndex)
      setIsSliding(true)

      const timer = setTimeout(() => {
        setInternalIndex(currentIndex)
        setIsSliding(false)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, isOpen, internalIndex, isSliding])

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex)
      setPrevIndex(currentIndex)
      setIsSliding(false)
    }
  }, [isOpen, currentIndex])

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return
    onNavigate(internalIndex + 1)
  }, [internalIndex, totalProjects, isSliding, onNavigate])

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return
    onNavigate(internalIndex - 1)
  }, [internalIndex, isSliding, onNavigate])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    onClose()
    setTimeout(() => {
      setIsClosing(false)
      setShouldRender(false)
      setAnimationPhase("initial")
      onCloseComplete?.()
    }, 400)
  }, [onClose, onCloseComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowRight") navigateNext()
      if (e.key === "ArrowLeft") navigatePrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleClose, navigateNext, navigatePrev])

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true)
      setAnimationPhase("initial")
      setIsClosing(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating")
        })
      })
      const timer = setTimeout(() => {
        setAnimationPhase("complete")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, sourceRect])

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return
    onNavigate(idx)
  }

  if (!shouldRender || !currentProject) return null

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {}

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const targetWidth = Math.min(768, viewportWidth - 64)
    const targetHeight = Math.min(viewportHeight * 0.85, 600)

    const targetX = (viewportWidth - targetWidth) / 2
    const targetY = (viewportHeight - targetHeight) / 2

    const scaleX = sourceRect.width / targetWidth
    const scaleY = sourceRect.height / targetHeight
    const scale = Math.max(scaleX, scaleY)

    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2)
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2)

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 1,
    }
  }

  const getFinalStyles = (): React.CSSProperties => {
    return {
      transform: "translate(0, 0) scale(1)",
      opacity: 1,
    }
  }

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles()

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8")}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 bg-background/85 backdrop-blur-xl"
        style={{
          opacity: animationPhase === "initial" && !isClosing ? 0 : 1,
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleClose()
        }}
        aria-label="Tutup preview"
        className={cn(
          "absolute top-5 right-5 z-50",
          "w-10 h-10 flex items-center justify-center",
          "rounded-full bg-muted/70 backdrop-blur-md",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer",
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          navigatePrev()
        }}
        aria-label="Sebelumnya"
        disabled={!hasPrev || isSliding}
        className={cn(
          "absolute left-4 md:left-8 z-50",
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-muted/70 backdrop-blur-md",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer",
          "disabled:opacity-0 disabled:pointer-events-none",
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          navigateNext()
        }}
        aria-label="Selanjutnya"
        disabled={!hasNext || isSliding}
        className={cn(
          "absolute right-4 md:right-8 z-50",
          "w-12 h-12 flex items-center justify-center",
          "rounded-full bg-muted/70 backdrop-blur-md",
          "border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer",
          "disabled:opacity-0 disabled:pointer-events-none",
        )}
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 300ms ease-out 150ms, transform 300ms ease-out 150ms",
        }}
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.95)" : currentStyles.transform,
          transition:
            animationPhase === "initial" && !isClosing
              ? "none"
              : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
          transformOrigin: "center center",
        }}
      >
        <div
          className={cn("relative overflow-hidden", "rounded-2xl", "bg-card", "ring-1 ring-border", "shadow-2xl")}
          style={{
            borderRadius: animationPhase === "initial" && !isClosing ? "8px" : "16px",
            transition: "border-radius 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative overflow-hidden bg-black/40">
            <div
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding ? "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" : "none",
              }}
            >
              {projects.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0 flex items-center justify-center bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[70vh] object-contain select-none"
                    style={{ minWidth: "100%" }}
                  />
                </div>
              ))}
            </div>

            {/* Subtle vignette effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-card/30 via-transparent to-card/10" />
          </div>

          <div
            className={cn("px-6 py-5", "bg-card", "border-t border-border")}
            style={{
              opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
              transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground tracking-tight truncate">
                  {currentProject?.title}
                </h3>
                {currentProject?.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {currentProject.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded border border-border">
                      ←
                    </kbd>
                    <kbd className="px-1.5 py-0.5 mx-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded border border-border">
                      →
                    </kbd>{" "}
                    navigasi
                  </p>
                  <div className="flex items-center gap-1.5">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                          idx === internalIndex
                            ? "bg-foreground scale-125"
                            : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {targetHref ? (
                <Link
                  href={targetHref}
                  onClick={handleClose}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-4 py-2.5",
                    "text-sm font-medium text-primary-foreground",
                    "bg-primary hover:bg-primary/90 rounded-lg shadow-sm",
                    "transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  <span>Buka Halaman</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={handleClose}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2",
                    "text-sm font-medium text-muted-foreground",
                    "bg-muted/50 hover:bg-muted",
                    "rounded-lg border border-border",
                    "transition-all duration-200 ease-out hover:text-foreground",
                  )}
                >
                  <span>Tutup</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface ProjectCardProps {
  image: string
  title: string
  delay: number
  isVisible: boolean
  index: number
  onClick?: () => void
  isClickable?: boolean
  isSelected?: boolean
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, onClick, isClickable = true, isSelected = false }, ref) => {
    const rotations = [-12, 0, 12]
    const translations = [-55, 0, 55]

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 rounded-lg overflow-hidden shadow-xl",
          "bg-card border border-border",
          isClickable
            ? "cursor-pointer hover:ring-2 hover:ring-accent/70 hover:scale-105 pointer-events-auto"
            : "pointer-events-none select-none",
          "transition-all duration-300",
          isSelected && "opacity-0 pointer-events-none",
        )}
        style={{
          transform: isVisible
            ? `translateY(-90px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.5)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, opacity 400ms ease-out ${delay}ms`,
          zIndex: 10 - index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={
          isClickable && onClick
            ? (e) => {
                e.stopPropagation()
                onClick()
              }
            : undefined
        }
        title={isClickable ? `Klik untuk melihat ${title}` : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-medium text-white truncate text-center drop-shadow-sm">
          {title}
        </p>
      </div>
    )
  },
)

ProjectCard.displayName = "ProjectCard"
