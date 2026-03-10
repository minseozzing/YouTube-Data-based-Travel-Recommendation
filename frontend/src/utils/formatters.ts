import dayjs from '@/utils/dayjs';

/**
 * 숫자를 한국 원화 형식으로 포맷
 * @example formatKRW(1500000) → "1,500,000원"
 */
export const formatKRW = (amount: number): string => {
  return `${amount.toLocaleString('ko-KR')}원`;
};

/**
 * 숫자를 통화 단위로 포맷
 * @example formatCurrency(1500, 'USD') → "$1,500"
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * 숫자에 천 단위 콤마 추가
 * @example formatNumber(1500000) → "1,500,000"
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

/**
 * 날짜 문자열을 한국어 형식으로 포맷
 * @example formatDate('2026-03-04') → "2026년 3월 4일"
 */
export const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format('YYYY년 M월 D일');
};

/**
 * 날짜 문자열을 짧은 형식으로 포맷
 * @example formatDateShort('2026-03-04') → "2026.03.04"
 */
export const formatDateShort = (dateStr: string): string => {
  return dayjs(dateStr).format('YYYY.MM.DD');
};

/**
 * 날짜를 상대적 시간으로 포맷 (dayjs relativeTime)
 * @example formatRelativeTime('2026-03-01') → "3일 전"
 */
export const formatRelativeTime = (dateStr: string): string => {
  return dayjs(dateStr).fromNow();
};

/**
 * 분(minute) 단위를 "X시간 Y분" 형식으로 포맷
 * @example formatMinutes(150) → "2시간 30분"
 */
export const formatMinutes = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

/**
 * 소수점 이하를 반올림하여 퍼센트 문자열로 포맷
 * @example formatPercent(82.5) → "83%"
 */
export const formatPercent = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};
