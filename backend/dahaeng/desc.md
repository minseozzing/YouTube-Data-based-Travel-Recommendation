———

# API Design

모든 API는 Bearer JWT 인증이 필요합니다.
Authorization: Bearer <accessToken>

———

## POST /api/youtube/sync

유튜브 데이터 동기화 실행 (YouTube API 호출 → DB 저장 → snapshot 저장)

Request

- Body 없음

Response

{
"message": "youtube sync completed"
}

Errors

- 401: 로그인 필요
- 500: 동기화 실패

———

## GET /api/youtube/sync-status

동기화 상태 조회

Response

{
"connected": true,
"syncStatus": "SYNCED",
"lastSyncedAt": "2026-03-08T15:30:00"
}

설명

- connected: 연동 계정 존재 여부
- syncStatus: PENDING | SYNCED | FAILED
- lastSyncedAt: 마지막 동기화 시각 (없으면 null)

———

## GET /api/youtube/playlists

DB에서 재생목록 조회

Response

{
"playlists": [
{
"id": "PLxxxx",
"title": "재생목록 제목",
"videos": [
{
"id": "videoId",
"title": "영상 제목",
"channelTitle": "채널명",
"categoryId": "10",
"tags": ["tag1", "tag2"]
}
]
}
]
}

———

## GET /api/youtube/subscriptions

DB에서 구독 채널 조회

Response

{
"subscriptions": [
{
"id": "UCxxxx",
"title": "채널명"
}
]
}

———

## GET /api/youtube/liked-videos

DB에서 좋아요 영상 조회

Response

{
"likedVideos": [
{
"id": "videoId",
"title": "영상 제목",
"channelTitle": "채널명",
"categoryId": "10",
"tags": ["tag1", "tag2"]
}
]
}

———