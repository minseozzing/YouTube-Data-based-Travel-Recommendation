import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

// 한국어 locale 설정
dayjs.locale('ko');

// 플러그인 등록
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default dayjs;
