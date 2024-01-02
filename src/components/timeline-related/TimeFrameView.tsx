"use client";
import React, { useEffect, useState } from "react";
import { EditorElement } from "@/types";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import DragableView from "./DragableView";
import { useDrop } from "react-dnd";

export const TimeFrameView = observer((props: { element: EditorElement,elementIndex: number}) => {
  const store = React.useContext(StoreContext);
  const { element, elementIndex} = props;
  const disabled = element.type === "audio";
  const isSelected = store.selectedElement?.id === element.id;
  const bgColorOnSelected = isSelected ? "bg-slate-800" : "bg-slate-600";
  const disabledCursor = disabled ? "cursor-no-drop" : "cursor-ew-resize";
    const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: 'box',
      drop: () => ({
        name: `Timeline Item`,
        allowedDropEffect: 'copy',
        elementIndex,
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [elementIndex]
  );

  const isActive = canDrop && isOver;

  const totalWidth = ((element.timeFrame.end - element.timeFrame.start) /
  store.maxTime) *
100
  return (
    <>
  {isActive &&  <div style={{marginBottom: '4px', height: '2px', backgroundColor: 'green'}} />}
     <div
      onClick={() => {
        store.setSelectedElement(element);
      }}
      ref={drop}
      key={element.id}
      className={`relative h-[90px]  bg-gray-200 my-2 ${
        isSelected ? "border-2 border-indigo-600 bg-slate-200" : ""
      }`}
    >
      <DragableView
        className="z-10"
        value={element.timeFrame.start}
        total={store.maxTime}
        disabled={disabled}
        onChange={(value) => {
          store.updateEditorElementTimeFrame(element, {
            start: value,
          });
        }}
      >
        <div
          className={`bg-white border-2 border-blue-400 w-[10px] h-[10px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        ></div>
      </DragableView>

      <DragableView
        className={disabled ? "cursor-no-drop" : "cursor-col-resize"}
        value={element.timeFrame.start}
        disabled={disabled}
        style={{
          width: `${
            totalWidth
          }%`,
        }}
        total={store.maxTime}
        onChange={(value) => {
          const { start, end } = element.timeFrame;
          const newEnd = value + (end - start);
          store.updateEditorElementTimeFrame(element, {
            start: value,
            end: newEnd,
          });
        }}
      >
        <div
          className={`${bgColorOnSelected} h-full w-full text-white text-xs min-w-[0px] px-2 leading-[25px]`}
        >
          {element.name}
        </div>
      </DragableView>
      <DragableView
        className="z-10"
        disabled={disabled}
        value={element.timeFrame.end}
        total={store.maxTime}
        onChange={(value) => {
          store.updateEditorElementTimeFrame(element, {
            end: value,
          });
        }}
      >
        <div
          className={`bg-white border-2 border-blue-400 w-[10px] h-[10px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        ></div>
      </DragableView>
    </div>
    </>
  );
});
