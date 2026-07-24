/**
 * Frigate review item types
 *
 * A "review item" (Frigate's /api/review) groups one or more tracked objects
 * (events) into a single segment classified by severity ("alert" | "detection").
 * This matches what the Frigate UI's Review page shows, unlike the lower-level
 * /api/events data which lists each tracked object separately.
 */

export interface FrigateReviewData {
    /** Event IDs of the tracked objects that make up this review item. */
    detections: string[];
    /** Object labels seen during the segment, e.g. ["person", "car"]. */
    objects: string[];
    /** Recognized sub-labels (e.g. license plates, face names). */
    sub_labels?: string[];
    /** Zones the activity occurred in. */
    zones: string[];
    /** Audio detection types. */
    audio: string[];
}

export interface FrigateReview {
    id: string;
    camera: string;
    start_time: number;
    end_time: number | null;
    /** "alert" | "detection" (older data may also carry "motion"). */
    severity: string;
    /** e.g. /media/frigate/clips/review/thumb-<camera>-<id>.webp */
    thumb_path: string;
    has_been_reviewed?: boolean;
    data: FrigateReviewData;
}

export interface FrigateReviewChange {
    type: 'new' | 'update' | 'end';
    before: FrigateReview;
    after: FrigateReview;
}

export interface NativeFrigateReviewQuery {
    instance_id?: string;
    cameras?: string[];
    labels?: string[];
    zones?: string[];
    severity?: string;
    after?: number;
    before?: number;
    limit?: number;
    reviewed?: boolean;
}
