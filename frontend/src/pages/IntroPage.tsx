import { Link } from '@tanstack/react-router';

const IntroPage = () => {
  return (
    <div>
      <h1>IntroPage — 다음 여행을 행복하게, 다행</h1>
      <nav>
        <Link to="/login">로그인</Link>
      </nav>
    </div>
  );
};

export default IntroPage;
