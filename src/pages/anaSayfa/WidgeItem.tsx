import React from 'react';
import { Card } from 'primereact/card';
import { Widget } from '../Home';


interface WidgetItemProps {
    widget: Widget;
}

export const WidgetItem: React.FC<WidgetItemProps> = ({ widget }) => {
    return (
        <div className="p-col-12 p-md-4">
            <Card title={widget.title}>
             {widget.content}
            </Card>
        </div>
    );
};
