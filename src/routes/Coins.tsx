import styled from "styled-components";
import { Link } from 'react-router-dom';
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";
import { isDarkAtom } from "../atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Container = styled.div`
padding: 0px 20px;
max-width: 480px;
margin: 0 auto;
`;

const Header = styled.header`
height: 10vh;
display: flex;
align-items:center;
justify-content: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
background-color: white;
color: black;
margin-bottom: 10px;

border-radius: 15px;
a {
    transition: color 0.1s linear;
    display: flex;
    padding: 20px;
    align-items: center;
    margin-right: 10px;
}
&:hover {
    a {
        color: ${props => props.theme.accentColor};
        font-weight: bold;
    }
}
`;

const Title = styled.h1`
    color: ${props => props.theme.accentColor};
    font-size: 2em;
`;

const Img = styled.img`
    width: 35px;
    height: 35px;
    margin: 0px 10px 0 0;
`;

const Btn = styled.button`
  width: 40px;
  height: 30px;
  border-radius: 20%;
  background-color: ${(props) =>
    props.theme.accentColor};
  display: flex;
  justify-content : center;
  align-items: center;
  border : 0px;
  a {padding : 10px};
  position: absolute;
  left: 100px;
`;

interface ICoin {
    "id": string,
    "name": string,
    "symbol": string,
    "rank": number,
    "is_new":boolean,
    "is_active":boolean,
    "type": string,
}

const Loader = styled.span`
    text-align: center;
`;


function Coins() {
    const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins);
    const isDark = useRecoilValue(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom(prev => !prev);

    return (
    <Container>
        <Helmet>
       <title>Crypto Tracker</title>
     </Helmet>
        <Header>
            <Title>Crypto Tracker</Title>
            <Btn onClick={toggleDarkAtom}>{isDark? "Light Mode" : "Dark Mode"}</Btn>
        </Header>
        {isLoading ? <Loader>...Loading</Loader> : <CoinsList>
            {data?.slice(0, 100).map((coin) => <Coin key= {coin.id}>
                <Link to={`/${coin.id}`} state={ {name : coin.name} }>
                    <Img src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`} />
                    {coin.name} &rarr;</Link>
                </Coin>)}
        </CoinsList>}
    </Container>
    )
};

export default Coins;