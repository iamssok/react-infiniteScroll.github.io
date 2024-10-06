import { useState, useEffect, useRef } from 'react';
import { MOCK_DATA, MockData } from './mockData';

function App() {
  const [data, setData] = useState<MockData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreData) {
          loadMoreData();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMoreData]);

  // 초기 데이터 로드
  useEffect(() => {
    const initialData = MOCK_DATA.slice(0, 10);
    setData(initialData);
    calculateTotalPrice(initialData);
  }, []);

  // 추가 데이터 로드
  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = MOCK_DATA.slice(page * 10, nextPage * 10);

    if (nextData.length === 0) {
      setHasMoreData(false);
      return;
    }

    setData((prevData) => {
      const updatedData = [...prevData, ...nextData];
      calculateTotalPrice(updatedData);
      return updatedData;
    });

    setPage(nextPage);
  };

  // 가격 총합 계산 함수
  const calculateTotalPrice = (items: MockData[]) => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(sum);
  };

  return (
    <>
      <h1>Infinite Scroll</h1>
      <h2 style={{ position:'fixed', top:0, right:20 }}>Total Price: {totalPrice.toLocaleString()} USD</h2>
      <ul>
        {data.map((item) => (
          <li key={item.productId}>
            <p>{item.productName}</p>
            <p>Price: {item.price}</p>
            <p>Bought Date: {new Date(item.boughtDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      <div ref={observerTarget} style={{ height: '100px', backgroundColor: 'lightgrey' }}>
        {hasMoreData ? 'Loading...' : 'No more data to load.'}
      </div>
    </>
  );
}

export default App;
