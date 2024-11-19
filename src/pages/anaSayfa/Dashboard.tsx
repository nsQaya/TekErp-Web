
import GridLayout from 'react-grid-layout';
import { StackedBarWidget } from './Widgets/StackedBarDemo';
//import { Bar, Doughnut } from 'react-chartjs-2';


const Dashboard = () => {
    const layout = [
        { i: 'izinliPersonel', x: 0, y: 0, w: 20, h: 3 },
        { i: 'gununYemegi', x: 6, y: 0, w: 6, h: 4 },
        { i: 'satisGrafigi', x: 0, y: 2, w: 4, h: 4 },
        { i: 'personelGorevGrafigi', x: 4, y: 2, w: 4, h: 4 },
    ];
    

    return (
       <> 


        <GridLayout className="layout" layout={layout} cols={12} rowHeight={150} width={1200} 
        //onLayoutChange={onLayoutChange}
        >
            {/* <div key="izinliPersonel" className="widget">
            <YemekWidget />
            </div> */}
            <div key="gununYemegi" className="widget">
                <StackedBarWidget/>
            </div>
            <div key="satisGrafigi" className="widget">
                <h3>Satış Grafiği</h3>
                {/* <Bar
                    data={{
                        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs'],
                        datasets: [{
                            label: 'Satışlar',
                            backgroundColor: 'rgba(75,192,192,1)',
                            data: [65, 59, 80, 81, 56]
                        }]
                    }}
                    options={{ maintainAspectRatio: false }}
                /> */}
            </div>
            <div key="personelGorevGrafigi" className="widget">
                <h3>Personel Görev Grafiği</h3>
                {/* <Doughnut
                    data={{
                        labels: ['Tamamlanan Görevler', 'Devam Eden Görevler', 'Bekleyen Görevler'],
                        datasets: [{
                            data: [300, 50, 100],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }]
                    }}
                    options={{ maintainAspectRatio: false }}
                /> */}
            </div>
        </GridLayout>
        </>
    );
};

export default Dashboard;
