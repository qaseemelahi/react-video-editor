"use client";
import React, { useEffect, useRef, useState } from "react";
import { SeekPlayer } from "./timeline-related/SeekPlayer";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import { TimeFrameView } from "./timeline-related/TimeFrameView";
import { useDrop } from "react-dnd";

export const TimeLine = observer(() => {
  const store = React.useContext(StoreContext);
  const percentOfCurrentTime = (store.currentTimeInMs / store.maxTime) * 100;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop: () => ({
        name: `Timeline`,
        allowedDropEffect: 'copy',
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const isActive = canDrop && isOver;
  const parentTimelineRef = useRef(null);
  const timelineRef = useRef(null);
  const getWidth = () => {
    if (timelineRef.current) {
      return timelineRef.current?.offsetWidth;
    }
    return 0; // Default width if ref is not attached
  };

  const getParentWidth = () => {
    if (parentTimelineRef.current) {
      return parentTimelineRef.current?.offsetWidth;
    }
    return 0; // Default width if ref is not attached
  };
  const [width, setWidth] = useState()
  useEffect(() => {
    setWidth(getWidth())
  }, [])
  

  return (
    <>
      <SeekPlayer />
      <div >

        <div className="relative height-auto">
          <div
            className="w-[2px] bg-red-400 absolute top-0 bottom-0 z-20"
            style={{
              left: `${percentOfCurrentTime}%`,
            }}
          ></div>

          <div ref={parentTimelineRef}  style={{ overflowX: 'auto', }}>
            <div ref={timelineRef} style={{ width: `${width}px` }}>
              {store.editorElements.map((element, index) => {
                return <TimeFrameView getParentWidth={getParentWidth}  setWidth={setWidth} getWidth={getWidth} elementIndex={index} key={element.id} element={element} />;
              })
              }
              <div ref={drop} style={{
                height: '300px', backgroundColor: isActive ? '#eee' : undefined, ...(isActive && store.editorElements.length !== 0 ? {
                  borderTop: '2px Solid green'
                } : {})
              }} />

            </div>
          </div>
        </div>
      </div >

    </>

  );
});
