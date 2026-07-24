/**
 * Frigate API client for Home Assistant (review items)
 */
import { HomeAssistant } from '../ha/types';
import { FrigateReview, FrigateReviewChange, NativeFrigateReviewQuery } from './types';

/**
 * Get review items from Frigate via Home Assistant WebSocket.
 * Maps to Frigate's /api/review endpoint.
 */
export async function getReviews(
    hass: HomeAssistant,
    params?: NativeFrigateReviewQuery
): Promise<FrigateReview[]> {
    const response = await hass.callWS<string>({
        type: 'frigate/reviews/get',
        ...params,
    });

    // The integration returns the raw API body as a JSON string (decode_json=False).
    return JSON.parse(response) as FrigateReview[];
}

/**
 * Thumbnail for a review item: served from one of its detection events
 * (review.data.detections) via the integration's "notifications" proxy, which
 * allows unauthenticated access, so it loads in an <img> without an auth token.
 */
export function getReviewSnapshotURL(
    clientId: string,
    eventId: string,
    cacheBust?: string | number
): string {
    const query = cacheBust ? `?h=${encodeURIComponent(String(cacheBust))}` : '';
    return `/api/frigate/${encodeURIComponent(clientId)}/notifications/${encodeURIComponent(eventId)}/snapshot.jpg${query}`;
}

/**
 * Full review clip: the camera recording for the review's [start, end] span,
 * via the integration's "recording" proxy (returns an mp4). This proxy REQUIRES
 * authentication, so the URL must be signed with signPath() before it can be
 * used in a <video> tag. Requires recordings to be retained for the range.
 */
export function getReviewClipURL(
    clientId: string,
    camera: string,
    start: number,
    end: number
): string {
    return `/api/frigate/${encodeURIComponent(clientId)}/recording/${encodeURIComponent(camera)}/start/${start}/end/${end}`;
}

/**
 * Sign a Home Assistant path so it can be requested without an auth header
 * (needed for the authenticated "recording" proxy). Returns a relative URL with
 * an `?authSig=...` token valid for `expires` seconds.
 */
export async function signPath(
    hass: HomeAssistant,
    path: string,
    expires = 12 * 60 * 60
): Promise<string> {
    const result = await hass.callWS<{ path: string }>({
        type: 'auth/sign_path',
        path,
        expires,
    });
    return result.path;
}

/**
 * Subscribe to real-time Frigate review updates.
 */
export async function subscribeToReviews(
    hass: HomeAssistant,
    instanceId: string,
    callback: (change: FrigateReviewChange) => void
): Promise<() => void> {
    const unsubscribe = await hass.connection.subscribeMessage<string>(
        (data) => {
            try {
                const parsed = (typeof data === 'string' ? JSON.parse(data) : data) as FrigateReviewChange;
                callback(parsed);
            } catch (e) {
                console.warn('Failed to parse Frigate review:', e);
            }
        },
        { type: 'frigate/reviews/subscribe', instance_id: instanceId }
    );

    return unsubscribe;
}
