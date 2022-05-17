import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface ChartProps {
    coinId : string;
}

interface IOhclv {
    time_open: string;
    time_close: string;
    open:  number;
    high:  number;
    low: number;
    close: number;
    volume: number; 
    market_cap: number;
}

function Chart( { coinId }: ChartProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const {isLoading, data} = useQuery<IOhclv[]>(['ohlcv', coinId], () => fetchCoinHistory(coinId))
    return <div>
        {isLoading ? "Loading Chart..." :
        <ReactApexChart type="line"
        series={[
            {
                name: "close price",
                data: data?.map(price => price.close) as number[]
            }
        ]}
        options={{
           chart:{ height : 500,
            width : 500,
            toolbar : {
                show : false
            },
            background : "transparent"
        },
        theme: {
            mode: isDark ? 'dark' : 'light'
        },
        yaxis: {
            show : false
        },
        xaxis : {
            labels : {
                datetimeFormatter: {month: "mmm 'yy"} 
            },
            axisTicks : {
                show: false
            },
            categories: data?.map(price => price.time_close),
            type: 'datetime'
        },
        tooltip : {
            y : {
                formatter: (value) =>`$${value.toFixed(2)}`
            },
            theme: 'dark'
        },
        fill : {
            type: "gradient",
            gradient : {gradientToColors: ['#EC994B'], stops: [0, 100] },
            colors : ['red'],
            
        },
        dataLabels: {
            style: {
              colors: ['#73777B', '#EC994B', '#9C27B0']
            }
          },
          markers: {
            colors: ['#F44336', '#E91E63', '#9C27B0']
         },
        }}
        />}
    </div>

}

export default Chart