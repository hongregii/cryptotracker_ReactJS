import { useParams } from 'react-router';
import styled from 'styled-components';
import { Link, useMatch, Routes, useLocation, Route } from 'react-router-dom';
import Chart from './Chart';
import Price from './Price';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';


const Container = styled.div`
padding: 0px 20px;
max-width: 480px;
margin: 0 auto;
`;

const Header = styled.header`
height: 10vh;
display: flex;
align-items:center;
justify-content: space-between;
padding: 0 20px;
`;

const Loader = styled.span`
    text-align: center;
`;

const Title = styled.h1`
    color: ${props => props.theme.accentColor};
    font-size: 2em;
`;

interface RouteState {
    state: {
    name: string;
    };
    }

function Coin() {
    const {coinId} = useParams();
    const {state} = useLocation() as RouteState;

    const {isLoading: infoLoading, data: infoData} = useQuery<IInfoData>(['info',coinId], () => fetchCoinInfo(coinId), {refetchInterval: 5000});
    const {isLoading: tickersLoading, data: tickersData} = useQuery<IPriceData>(['tickers',coinId], () => fetchCoinTickers(coinId), {refetchInterval: 5000});


    interface IInfoData {
        id : string ;
        name : string ;
        symbol : string ;
        rank : number ;
        is_new :  boolean ;
        is_active :  boolean ;
        type : string ;
        description : string ;
        message : string ;
        open_source :  boolean ;
        started_at : string ;
        development_status : string ;
        hardware_wallet :  boolean ;
        proof_type : string ;
        org_structure : string ;
        hash_algorithm : string ;
        first_data_at : string ;
        last_data_at : string ;
    }

    

    interface IPriceData {
        id : string;
        name : string;
        symbol : string;
        rank : number;
        circulating_supply : number;
        total_supply : number;
        max_supply : number;
        beta_value : number;
        first_data_at : string;
        last_updated : string;
        quotes: {
            USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;            percent_change_1h: number;
            percent_change_1y: number;            
            percent_change_6h: number;         
            percent_change_7d: number;           
            percent_change_12h: number;
            percent_change_15m: number;          
            percent_change_24h: number;          
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;   
        }
    }}

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const Btn = styled.button`
  width: 40px;
  height: 30px;
  border-radius: 20%;
  background-color: ${(props) =>
   isDark ? props.theme.accentColor : props.theme.textColor};
  display: flex;
  justify-content : center;
  align-items: center;
  border : 0px;
  a {padding : 10px};
`; 



const priceMatch = useMatch("/:coinId/price");
const chartMatch = useMatch("/:coinId/chart");
const loading = infoLoading || tickersLoading;
const isDark = useRecoilValue(isDarkAtom);
const setDarkAtom = useSetRecoilState(isDarkAtom);
const toggleDarkAtom = () => setDarkAtom(prev => !prev);



   return (<Container>
     <HelmetProvider>
     <Helmet>
       <title>{state?.name ? state.name : loading ? "loading..." : infoData?.name}</title>
     </Helmet>
     </HelmetProvider>
    <Header>
        <Btn><Link to={'/'}>Back</Link></Btn>
        <Title>{state?.name ? state.name : loading ? "loading..." : infoData?.name}</Title>
        <Btn onClick={toggleDarkAtom}>{isDark? "Light Mode" : "Dark Mode"}</Btn>
    </Header>
    {
    loading ? <Loader>...Loading</Loader> : 
    (
        <>
        
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${tickersData?.quotes.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
        <Tabs>
            <Tab isActive={chartMatch !== null}>
        <Link to={`/${coinId}/chart`}>
        chart
        </Link></Tab>
        <Tab isActive={priceMatch !== null}>
        <Link to={`/${coinId}/price`}>
        price
        </Link></Tab>
        </Tabs>
          <Routes>
            <Route path="chart" element={<Chart coinId={coinId as string}/>}/>
            <Route path="price" element={<Price/>} />
          </Routes>
        </>
    )
    }
    </Container>
)
    }


export default Coin;