import React, { useState, useEffect, useCallback } from "react";

import GridLayout, { WidthProvider, Layout } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "../assets/css/HomePage.css";
import { YemekWidget } from "./anaSayfa/Widgets/yemekWidget";
import { IzinliPersonelWidget } from "./anaSayfa/Widgets/izinliPersonelWidget";
import Dashboard from "./anaSayfa/Dashboard";
import { StackedBarWidget } from "./anaSayfa/Widgets/StackedBarDemo";
import { Button } from "primereact/button";
import { WidgetItem } from "./anaSayfa/WidgeItem";
import { Dialog } from "primereact/dialog";
import { WidgetMarket } from "./anaSayfa/WidgetMarket";

const ReactGridLayout = WidthProvider(GridLayout);

interface LayoutItem extends Layout {
  static: boolean;
}

export interface Widget {
  id: number;
  title: string;
  content: React.ReactNode;
  w: number;
  h: number;
  type:string;
}

const widgetTypes: { [key: string]: (widget: Widget) => React.ReactNode } = {
  "YemekWidget": () => <YemekWidget />,
  "IzinliPersonelWidget": () => <IzinliPersonelWidget />,
  "StackedBarWidget": () => <StackedBarWidget />,
  // Diğer widget türleri burada tanımlanabilir
};

const saveLayout = (layout: LayoutItem[], widgets: Widget[]) => {
  debugger;
  const simplifiedLayout = layout.map(({ i, x, y, w, h }) => ({
    i, 
    x: x !== null && x !== Infinity ? x : 0,  // Ensure x defaults to 0 if null
    y: y !== null && y !== Infinity ? y : 0,  // Ensure y defaults to 0 if null
    w, 
    h,
  }));

  localStorage.setItem("savedLayout", JSON.stringify(simplifiedLayout));

  const simplifiedWidgets = widgets.map(({ id, title, w, h, type }) => ({
    id, 
    title, 
    w, 
    h, 
    type,  // Ensure type is saved
  }));
  localStorage.setItem("savedWidgets", JSON.stringify(simplifiedWidgets));
};

const loadLayout = (): LayoutItem[] => {
  const savedLayout = localStorage.getItem("savedLayout");
  return savedLayout ? JSON.parse(savedLayout) : [];
};

const loadWidgets = (): Widget[] => {
  const savedWidgets = localStorage.getItem("savedWidgets");
  if (savedWidgets) {
    const parsedWidgets = JSON.parse(savedWidgets);
    return parsedWidgets.map((widget: Widget) => {
      const widgetComponent = widgetTypes[widget.type];
      if (!widgetComponent) {
        console.error(`Widget type ${widget.type} not found in widgetTypes.`);
        return {
          ...widget,
          content: <div>Error: Widget type {widget.type} not found</div>,
        };
      }

      return {
        ...widget,
        content: widgetComponent(widget),
      };
    });
  }
  return [];
};

const HomePage: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showMarket, setShowMarket] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>([]);

  useEffect(() => {
    const savedLayout = loadLayout();
    const savedWidgets = loadWidgets();

    if (savedLayout.length > 0 && savedWidgets.length > 0) {
      setLayout(savedLayout);
      setWidgets(savedWidgets);
    }
  }, []);

  const addWidget = (widget: Widget) => {
    const newWidgetLayout: LayoutItem = {
      i: widget.id.toString(),
      x: (layout.length * 2) % 12,
      y: Infinity,
      w: widget.w,
      h: widget.h,
      static: false,
    };

    const updatedLayout = [...layout, newWidgetLayout];
    const updatedWidgets = [...widgets, widget];

    setLayout(updatedLayout);
    setWidgets(updatedWidgets);
    setShowMarket(false);
    saveLayout(updatedLayout, updatedWidgets);
  };

  const removeWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter((widget) => widget.id.toString() !== widgetId);
    const updatedLayout = layout.filter((item) => item.i !== widgetId);
    setWidgets(updatedWidgets);
    setLayout(updatedLayout);
    saveLayout(updatedLayout, updatedWidgets);
  };

  const onLayoutChange = useCallback((currentLayout: LayoutItem[]) => {
    setLayout(currentLayout);
    saveLayout(currentLayout, widgets);
  }, [widgets]);

  return (

    <>
    
    <Dashboard />
    <div className="p-grid">
      <div className="p-col-12">
        <Button
          label="Widget Market"
          icon="pi pi-plus"
          onClick={() => setShowMarket(true)} />
      </div>

      <ReactGridLayout
        className="layout"
        layout={layout}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={100}
        isResizable={false}
        isDraggable={true}
        autoSize={true}
        compactType={null}
        preventCollision={true}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            data-grid={layout.find((l) => l.i === widget.id.toString()) || {}}
            className="widget-container"
          >
            <WidgetItem widget={widget} />
            <Button
              onClick={() => removeWidget(widget.id.toString())}
              // className="widget-close-button"
            >
              X
            </Button>
          </div>
        ))}
      </ReactGridLayout>

      <Dialog
        header="Widget Market"
        visible={showMarket}
        style={{ width: "50vw" }}
        onHide={() => setShowMarket(false)}
        
      >
        <WidgetMarket addWidget={addWidget} />
      </Dialog>
    </div>
    </>
  );
};

export default HomePage;
