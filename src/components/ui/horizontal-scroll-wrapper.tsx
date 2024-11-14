import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface HorizontalScrollWrapperProps {
  children: ReactNode;
  scrollSpeed?: number;
  className?: string;
}

const HorizontalScrollWrapper: React.FC<HorizontalScrollWrapperProps> = ({ children, className, scrollSpeed = 1 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (scrollRef.current) {
        const scrollAmount = e.deltaY * scrollSpeed;
        const newScrollPosition = scrollPosition + scrollAmount;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        setScrollPosition(Math.max(0, Math.min(newScrollPosition, maxScroll)));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current!.offsetLeft);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const x = e.pageX - scrollRef.current!.offsetLeft;
      const dragDistance = (startX - x) * scrollSpeed;
      const newScrollPosition = scrollPosition + dragDistance;
      const maxScroll = scrollRef.current!.scrollWidth - scrollRef.current!.clientWidth;
      
      setScrollPosition(Math.max(0, Math.min(newScrollPosition, maxScroll)));
      setStartX(x);
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener('wheel', handleWheel, { passive: false });
      currentScrollRef.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('wheel', handleWheel);
        currentScrollRef.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollPosition, scrollSpeed, isDragging, startX]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div
      className={twMerge(`whitespace-nowrap w-full overflow-x-hidden cursor-grab`, isDragging ? 'cursor-grabbing' : '', className)}
      ref={scrollRef}
    >
      {children}
    </div>
  );
};

export default HorizontalScrollWrapper;