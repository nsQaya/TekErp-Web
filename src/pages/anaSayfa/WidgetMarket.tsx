// import React from 'react';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { YemekWidget, YemekWidgetConfig } from './Widgets/yemekWidget';
// import { IzinliPersonelWidget, IzinliPersonelWidgetConfig } from './Widgets/izinliPersonelWidget';
// import { Widget } from '../Home';
// import { StackedBarWidget, StackedBarWidgetConfig } from './Widgets/StackedBarDemo';


// interface WidgetMarketProps {
//     addWidget: (widget: Widget) => void;
// }

// export const WidgetMarket: React.FC<WidgetMarketProps> = ({ addWidget }) => {
//     const availableWidgets: Widget[] = [
//         {
//             id: 1,
//             title: 'Yemek Widget',
//             content: <YemekWidget />,
//             w: YemekWidgetConfig.w,
//             h: YemekWidgetConfig.h,
//             type: 'YemekWidget', // Widget türü eklendi
//         },
//         {
//             id: 2,
//             title: 'İzin Widget',
//             content: <IzinliPersonelWidget />,
//             w: IzinliPersonelWidgetConfig.w,
//             h: IzinliPersonelWidgetConfig.h,
//             type: 'IzinliPersonelWidget', // Widget türü eklendi
//         },
//         {
//             id: 3,
//             title: 'StackedBarWidget Widget',
//             content: <StackedBarWidget />,
//             w: StackedBarWidgetConfig.w,
//             h: StackedBarWidgetConfig.h,
//             type: 'StackedBarWidget', // Widget türü eklendi
//         },
//     ];

//     return (
//         <div className="p-grid">
//             {availableWidgets.map((widget) => (
//                 <div key={widget.id} className="p-col-12 p-md-4">
//                     <Card title={widget.title}>
//                         <Button label="Add" onClick={() => addWidget(widget)} />
//                     </Card>
//                 </div>
//             ))}
//         </div>
//     );
// };
