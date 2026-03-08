# YouTube Latest-State Sync Update

Add the following rules to `desc.md`.

---

## Sync Data Strategy

The current sync implementation must **not keep accumulating old data** on every sync request.

The database should represent the **latest synchronized state** of the user's YouTube data.

This means the sync process must use **UPSERT + REPLACE** strategies instead of append-only inserts.

Use the following exact rules:

### 1. `youtube_video`

* Strategy: **UPSERT**
* Key: `youtube_video_id`
* Behavior:

    * if the video already exists, update `title`, `channel_title`, `category_id`
    * if it does not exist, insert it

### 2. `youtube_playlist`

* Strategy: **UPSERT**
* Key: `youtube_playlist_id`
* Behavior:

    * if the playlist already exists, update metadata
    * if it does not exist, insert it

### 3. `youtube_playlist_video`

* Strategy: **REPLACE per playlist**
* Behavior:

    * before inserting the latest playlist-video mappings, delete all existing mappings for that playlist
    * then insert the latest mappings again
* Important:

    * this table must not keep old playlist-video mappings from previous syncs

### 4. `youtube_liked_video`

* Strategy: **REPLACE per account**
* Behavior:

    * before inserting the latest liked videos, delete all existing liked-video rows for that account
    * then insert the latest liked-video mappings again
* Important:

    * if the user unliked a video, it must disappear from DB after the next sync

### 5. `youtube_subscription`

* Strategy: **REPLACE per account**
* Behavior:

    * before inserting the latest subscriptions, delete all existing subscription rows for that account
    * then insert the latest subscriptions again

### 6. `youtube_video_tag`

* Strategy: **REPLACE per video**
* Behavior:

    * before inserting the latest tags for a video, delete all existing tags of that video
    * then insert the latest tags again
* Important:

    * old tags must not remain after sync

### 7. `youtube_sync_snapshot`

* Strategy: **do not allow infinite growth**
* Behavior:

    * either skip snapshot storage for now
    * or keep only the latest snapshot per `account_id + snapshot_type`
* Important:

    * this table must not grow indefinitely on every sync request

---

## Required Repository Methods

To support latest-state sync, repositories should provide delete methods for replacement.

Examples:

* `YouTubePlaylistVideoRepository`

    * `deleteByPlaylistId(Long playlistId)`

* `YouTubeLikedVideoRepository`

    * `deleteByAccountId(Long accountId)`

* `YouTubeSubscriptionRepository`

    * `deleteByAccountId(Long accountId)`

* `YouTubeVideoTagRepository`

    * `deleteByVideoId(Long videoId)`

* `YouTubeSyncSnapshotRepository`

    * `deleteByAccountIdAndSnapshotType(Long accountId, SnapshotType snapshotType)`

---

## Required SaveService Changes

The current issue is that methods named like `insertPlaylistVideo`, `insertLikedVideo`, and `insertVideoTags` can lead to append-only behavior.

`YouTubeSaveService` must be changed so that it uses replacement logic.

Recommended method responsibilities:

* `upsertVideo(...)`
* `upsertPlaylist(...)`
* `replacePlaylistVideos(...)`
* `replaceLikedVideos(...)`
* `replaceSubscriptions(...)`
* `replaceVideoTags(...)`
* `replaceSnapshot(...)` or snapshot skip
* `updateSyncStatus(...)`

---

## Required SyncService Rule

`YouTubeSyncService` must orchestrate sync using latest-state logic.

Expected flow:

1. find member
2. find or create youtube_account
3. fetch playlists
4. fetch playlist items
5. fetch subscriptions
6. fetch liked videos
7. fetch video details if needed
8. save/update videos
9. save/update playlists
10. replace playlist-video mappings
11. replace liked-video mappings
12. replace subscriptions
13. replace video tags
14. save or replace snapshot
15. update sync status and last synced time

---

## Important Rule

The sync process must keep the database as the **latest state**, not as an append-only history.

This is required to prevent:

* stale playlist-video mappings
* stale liked videos
* stale subscriptions
* stale tags
* uncontrolled snapshot growth
