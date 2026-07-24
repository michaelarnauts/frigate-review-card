/**
 * Frigate Review Card - A simple Lovelace card for displaying recent Frigate review items
 *
 * Shows Frigate "review items" (alerts / detections) rather than individual tracked
 * objects, so a single alert appears once — matching the Frigate UI's Review page.
 */
import { LitElement, html, css, PropertyValues, TemplateResult, CSSResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig, LovelaceLayoutOptions } from './ha/types';
import { FrigateReview, FrigateReviewChange } from './frigate/types';
import { getReviews, getReviewSnapshotURL, getReviewClipURL, signPath, subscribeToReviews } from './frigate/api';

const CARD_VERSION = '3.0.0';

// How often to poll for new reviews as a fallback (in ms)
// This handles cases where WebSocket subscriptions silently die
const FALLBACK_POLL_INTERVAL = 10000; // 10 seconds

// How long a signed recording-clip URL stays valid (seconds).
const SIGN_CLIP_TTL_SECONDS = 12 * 60 * 60;

// Default maximum number of review items to load when neither items_limit nor
// items_max_age_hours is set.
const DEFAULT_ITEMS_COUNT = 20;

// mdi:close SVG path (avoids an @mdi/js dependency for the dialog close button).
const MDI_CLOSE = 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';

interface FrigateReviewCardConfig extends LovelaceCardConfig {
  instance?: string;
  severity?: string; // 'alert' | 'detection' | 'all'
  cameras?: string[];
  labels?: string[];
  zones?: string[];
  items_visible?: number;
  items_limit?: number;
  items_max_age_hours?: number;
  items_offset?: number;
  reverse_order?: boolean;
  scrollable?: boolean;
  autoplay_on_hover?: boolean;
  popup_play_clip?: boolean;
  popup_show_date?: boolean;
  popup_show_duration?: boolean;
  popup_show_camera?: boolean;
  popup_show_zones?: boolean;
  daily_reset_time?: string; // Format: "HH:MM" (24-hour), e.g., "04:00"
  debug?: boolean;
}

const DEFAULT_CONFIG: Partial<FrigateReviewCardConfig> = {
  instance: 'frigate',
  severity: 'alert',
  items_visible: 5,
  reverse_order: false,
  scrollable: true,
  autoplay_on_hover: true,
  popup_play_clip: true,
  popup_show_date: true,
  popup_show_duration: true,
  popup_show_camera: true,
  popup_show_zones: true,
  debug: false,
};

@customElement('frigate-review-card')
export class FrigateReviewCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: FrigateReviewCardConfig;
  @state() private _reviews: FrigateReview[] = [];
  @state() private _selectedReview?: FrigateReview;
  @state() private _loading = true;
  @state() private _error?: string;
  @state() private _hoveredReviewId?: string;

  private _unsubscribe?: () => void;
  private _pollInterval?: number;
  private _boundVisibilityHandler?: () => void;
  private _signedClips = new Map<string, { url: string; ts: number }>();

  /**
   * Calculate the daily reset timestamp based on the configured time.
   * If current time is before the reset time, use yesterday's reset time.
   */
  private _getDailyResetTimestamp(): number | null {
    if (!this._config?.daily_reset_time) return null;

    const [hours, minutes] = this._config.daily_reset_time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(hours, minutes, 0, 0);

    // If we haven't reached today's reset time yet, use yesterday's reset time
    if (now < resetTime) {
      resetTime.setDate(resetTime.getDate() - 1);
    }

    return resetTime.getTime() / 1000; // Return as Unix timestamp (seconds)
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('frigate-review-card-editor');
  }

  static getStubConfig(): object {
    return {
      instance: 'frigate',
      items_visible: 5,
      scrollable: true,
    };
  }

  public setConfig(config: FrigateReviewCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  public getCardSize(): number {
    return 3;
  }

  public getLayoutOptions(): LovelaceLayoutOptions {
    return {
      grid_columns: 4,
    };
  }

  protected async firstUpdated(): Promise<void> {
    await this._loadReviews();
    await this._subscribeToReviews();
    this._setupVisibilityHandler();
    this._setupPolling();
    // Re-render to adopt HA's adaptive (mobile bottom-sheet) dialog once it's defined.
    customElements.whenDefined('ha-adaptive-dialog').then(() => this.requestUpdate());
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has('hass') && this.hass && !this._unsubscribe) {
      this._subscribeToReviews();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanup();
  }

  private _cleanup(): void {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = undefined;
    }
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = undefined;
    }
    if (this._boundVisibilityHandler) {
      document.removeEventListener('visibilitychange', this._boundVisibilityHandler);
      this._boundVisibilityHandler = undefined;
    }
  }

  /**
   * Set up visibility change handler to refresh when page becomes visible.
   * This handles cases where TV browsers or mobile devices disconnect WebSockets
   * when the screen goes to sleep or the tab becomes inactive.
   */
  private _setupVisibilityHandler(): void {
    this._boundVisibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        console.debug('Frigate Review Card: Page became visible, refreshing...');
        this._loadReviews();
        // Re-subscribe in case the WebSocket was disconnected
        if (this._unsubscribe) {
          this._unsubscribe();
          this._unsubscribe = undefined;
        }
        this._subscribeToReviews();
      }
    };
    document.addEventListener('visibilitychange', this._boundVisibilityHandler);
  }

  /**
   * Set up periodic polling as a fallback for stale WebSocket connections.
   * This ensures the card stays updated even if the subscription silently dies.
   */
  private _setupPolling(): void {
    this._pollInterval = window.setInterval(() => {
      // Only poll if the page is visible
      if (document.visibilityState === 'visible') {
        this._loadReviews();
      }
    }, FALLBACK_POLL_INTERVAL);
  }

  private _getSeverityFilter(): string | undefined {
    const severity = this._config?.severity;
    return severity && severity !== 'all' ? severity : undefined;
  }

  /** Configured max age of items to show, in hours (undefined = no age limit). */
  private _getItemsHours(): number | undefined {
    const hours = this._config?.items_max_age_hours;
    return typeof hours === 'number' && hours > 0 ? hours : undefined;
  }

  /**
   * Max number of review items to load/show: items_limit if set, else a default.
   * Returns undefined (no count cap) when items_max_age_hours is set without items_limit.
   */
  private _getMaxItems(): number | undefined {
    const count = this._config?.items_limit;
    if (typeof count === 'number' && count > 0) return count;
    return this._getItemsHours() !== undefined ? undefined : DEFAULT_ITEMS_COUNT;
  }

  /** Oldest timestamp to fetch: the items_max_age_hours window, else all time. */
  private _getAfter(): number {
    const hours = this._getItemsHours();
    // Frigate's /api/review defaults to the last 24h when `after` is absent (and
    // treats 0 as falsy), so use a truthy epoch when there's no age limit.
    return hours !== undefined ? Math.floor(Date.now() / 1000) - Math.round(hours * 3600) : 1;
  }

  private async _loadReviews(): Promise<void> {
    if (!this.hass || !this._config) return;

    this._error = undefined;

    try {
      const offset = this._config.items_offset || 0;
      const max = this._getMaxItems();

      const reviews = await getReviews(this.hass, {
        instance_id: this._config.instance,
        cameras: this._config.cameras,
        labels: this._config.labels,
        zones: this._config.zones,
        severity: this._getSeverityFilter(),
        // items_limit (or a default); omitted when only items_max_age_hours bounds the
        // set. items_max_age_hours itself is applied via `after`.
        limit: max !== undefined ? max + offset : undefined,
        after: this._getAfter(),
      });

      this._reviews = reviews.sort((a, b) => (b.start_time || 0) - (a.start_time || 0));
    } catch (e) {
      console.error('Failed to load Frigate reviews:', e);
      this._error = 'Failed to load reviews';
    } finally {
      this._loading = false;
    }
  }

  private async _subscribeToReviews(): Promise<void> {
    if (!this.hass || !this._config || this._unsubscribe) return;

    try {
      this._unsubscribe = await subscribeToReviews(
        this.hass,
        this._config.instance || 'frigate',
        (change: FrigateReviewChange) => {
          // Check if this review matches our filters
          if (!this._matchesFilters(change)) return;

          // Reload reviews when a segment is created or finalized
          if (change.type === 'new' || change.type === 'end') {
            this._loadReviews();
          }
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to Frigate reviews:', e);
    }
  }

  private _matchesFilters(change: FrigateReviewChange): boolean {
    const config = this._config;
    if (!config) return true;

    const after = change.after;
    if (!after) return false;

    // Check severity filter
    const severity = this._getSeverityFilter();
    if (severity && after.severity !== severity) {
      return false;
    }

    // Check camera filter
    if (config.cameras?.length && !config.cameras.includes(after.camera)) {
      return false;
    }

    // Check label filter (review objects)
    if (config.labels?.length) {
      const objects = after.data?.objects || [];
      if (!config.labels.some(label => objects.includes(label))) {
        return false;
      }
    }

    // Check zone filter
    if (config.zones?.length) {
      const zones = after.data?.zones || [];
      if (!config.zones.some(z => zones.includes(z))) return false;
    }

    return true;
  }

  private _handleReviewClick(review: FrigateReview): void {
    this._selectedReview = review;
    if (this._config?.popup_play_clip) {
      // Sign asynchronously; the dialog re-renders with the clip once ready.
      this._ensureSignedClip(review);
    }
  }

  private _onReviewHover(review: FrigateReview, event?: PointerEvent): void {
    // Only start hover playback for a real mouse pointer. On touch, a tap fires
    // a synthetic pointerenter too, which would start the tile video alongside
    // the popup — we want the tap to only open the popup.
    if (event && event.pointerType !== 'mouse') return;
    if (!this._config?.autoplay_on_hover) return;
    this._hoveredReviewId = review.id;
    this._ensureSignedClip(review);
  }

  private _handleModalClose(): void {
    this._selectedReview = undefined;
  }

  /** Open the Home Assistant more-info dialog for a camera entity. */
  private _openCamera(entityId: string): void {
    this._handleModalClose();
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Pick a representative detection event ID for a review item. The thumbnail is
   * served from this event via the unauthenticated notifications proxy. Alerts
   * always carry at least one detection.
   */
  private _getReviewEventId(review: FrigateReview): string | undefined {
    return review.data?.detections?.find(Boolean);
  }

  /** Recording time range [start, end] covering the whole review segment. */
  private _getClipRange(review: FrigateReview): { start: number; end: number } {
    const start = Math.max(0, review.start_time);
    const end = review.end_time ?? Date.now() / 1000;
    return { start, end };
  }

  /**
   * Ensure we have a valid signed URL for a review's full recording clip.
   * The recording proxy requires auth, so a <video> tag can't load it directly —
   * we sign the path (adding an ?authSig= token), cache it per review, and
   * re-sign before it expires.
   */
  private async _ensureSignedClip(review: FrigateReview): Promise<string | undefined> {
    const nowSec = Date.now() / 1000;
    const cached = this._signedClips.get(review.id);
    if (cached && nowSec - cached.ts < SIGN_CLIP_TTL_SECONDS - 120) {
      return cached.url;
    }
    if (!this.hass) return cached?.url;

    const clientId = this._config?.instance || 'frigate';
    const { start, end } = this._getClipRange(review);
    const path = getReviewClipURL(clientId, review.camera, start, end);

    try {
      const url = await signPath(this.hass, path, SIGN_CLIP_TTL_SECONDS);
      this._signedClips.set(review.id, { url, ts: nowSec });
      this.requestUpdate();
      return url;
    } catch (e) {
      console.warn('Failed to sign Frigate review clip URL:', e);
      return cached?.url;
    }
  }

  /**
   * Whether to use AM/PM, following the user's Home Assistant time-format
   * preference (hass.locale.time_format). Returns undefined to let the locale
   * decide. Mirrors HA's own useAmPm() logic.
   */
  private _useAmPm(): boolean | undefined {
    const locale = this.hass?.locale;
    if (!locale?.time_format) return undefined;

    const timeFormat = locale.time_format;
    if (timeFormat === '12') return true;
    if (timeFormat === '24') return false;

    // 'language' / 'system': detect from a formatted sample.
    const testLanguage = timeFormat === 'language' ? locale.language : undefined;
    const sample = new Date().toLocaleString(testLanguage);
    return sample.includes('AM') || sample.includes('PM');
  }

  /** Time-of-day using the user's HA time format (12/24-hour). */
  private _formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const language = this.hass?.locale?.language || undefined;
    return date.toLocaleTimeString(language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: this._useAmPm(),
    });
  }

  /** Full date + time using the user's HA language and 12/24-hour preference. */
  private _formatDateTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const language = this.hass?.locale?.language || undefined;
    return date.toLocaleString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: this._useAmPm(),
    });
  }

  private _formatDuration(startTime: number, endTime: number | null): string {
    if (!endTime) return 'Ongoing';
    const durationSeconds = Math.round(endTime - startTime);
    if (durationSeconds < 60) {
      return `${durationSeconds}s`;
    }
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }

  private _formatZones(zones: string[]): string {
    if (!zones || zones.length === 0) return '';
    return zones.map(zone =>
      zone.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    ).join(', ');
  }

  /** Build a human-readable label from a review's detected objects. */
  private _formatObjects(review: FrigateReview): string {
    const objects = review.data?.objects || [];
    if (objects.length === 0) {
      return this._capitalize(review.severity || 'Review');
    }
    return objects.map(object => this._capitalize(object)).join(', ');
  }

  protected render(): TemplateResult {
    if (!this._config) {
      return html`<ha-card>No configuration</ha-card>`;
    }

    const isScroll = !!this._config.scrollable;
    // Arrows are rendered in scroll mode but only shown on devices with a fine
    // pointer (desktop); touch devices scroll by swiping instead (see CSS).
    const showScrollArrows = isScroll;
    const itemsVisible = this._config.items_visible || 5;
    const maxItems = this._getMaxItems();

    // Filter reviews based on daily clear time
    let visibleReviews = this._reviews;
    const resetTimestamp = this._getDailyResetTimestamp();
    if (resetTimestamp !== null) {
      visibleReviews = this._reviews.filter(r => (r.start_time || 0) > resetTimestamp);
    }

    // Show up to maxItems (items_limit), or all in the items_max_age_hours window when
    // there's no count cap; pad to a full row.
    const offset = this._config.items_offset || 0;
    const reviewsToShow = maxItems !== undefined
      ? visibleReviews.slice(offset, offset + maxItems)
      : visibleReviews.slice(offset);
    const placeholderCount = Math.max(0, itemsVisible - reviewsToShow.length);

    let renderedReviews = reviewsToShow.map(review => this._renderReview(review));
    let renderedPlaceholders = Array(placeholderCount).fill(0).map(() => html`<div class="placeholder"></div>`);

    let allItems = [...renderedReviews, ...renderedPlaceholders];
    if (this._config.reverse_order) {
      allItems.reverse();
    }

    return html`
      <ha-card>
        <div class="content">
          ${this._config.debug ? html`<div class="debug-version">v${CARD_VERSION}</div>` : ''}
          ${this._loading
        ? html`<div class="loading"></div>`
        : this._error
          ? html``
          : html`
              <div class="events-container">
                ${showScrollArrows ? html`
                  <button class="scroll-btn prev" @click=${() => this._scroll('left')}>◀</button>
                  <button class="scroll-btn next" @click=${() => this._scroll('right')}>▶</button>
                ` : ''}
                <div class="events ${isScroll ? 'scrollable' : ''}" style="--visible-count: ${itemsVisible};">
                  ${allItems}
                </div>
              </div>
            `}
        </div>
      </ha-card>
      ${this._renderDialog()}
    `;
  }

  private _renderReview(review: FrigateReview): TemplateResult {
    const clientId = this._config?.instance || 'frigate';
    const eventId = this._getReviewEventId(review);
    const thumbnailUrl = eventId ? getReviewSnapshotURL(clientId, eventId, review.end_time || undefined) : '';
    const label = this._formatObjects(review);

    const isHovered = this._hoveredReviewId === review.id;
    const playVideoOnHover = !!this._config?.autoplay_on_hover;
    const signedClip = this._signedClips.get(review.id)?.url;

    return html`
      <div class="event"
        @click=${() => this._handleReviewClick(review)}
        @pointerenter=${(e: PointerEvent) => this._onReviewHover(review, e)}
        @pointerleave=${() => { this._hoveredReviewId = undefined; }}
        style="position: relative;"
      >
        ${thumbnailUrl
          ? html`<img src="${thumbnailUrl}" alt="${label}" loading="lazy" />`
          : html`<div class="event-fallback">${label}</div>`
        }
        ${playVideoOnHover && isHovered && signedClip
          ? html`<video
                   autoplay
                   muted
                   .muted=${true}
                   loop
                   playsinline
                   style="position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; pointer-events: none;"
                 >
                   <source src="${signedClip}" type="video/mp4">
                 </video>`
          : ''
        }
      </div>
    `;
  }

  /**
   * Render the detail popup using Home Assistant's native <ha-dialog>, so it
   * matches the look and behavior of built-in dialogs (theming, ESC/scrim to
   * close, mobile full-screen).
   */
  private _renderDialog(): TemplateResult {
    const review = this._selectedReview;
    if (!review) return html``;

    const clientId = this._config?.instance || 'frigate';
    const eventId = this._getReviewEventId(review);
    const thumbnailUrl = eventId ? getReviewSnapshotURL(clientId, eventId, review.end_time || undefined) : '';
    const signedClip = this._signedClips.get(review.id)?.url;
    const showVideo = !!this._config?.popup_play_clip && !!signedClip;

    const label = this._formatObjects(review);
    const showDate = this._config?.popup_show_date !== false;
    const showDuration = this._config?.popup_show_duration !== false;
    const showCameraName = this._config?.popup_show_camera !== false;
    const showZones = this._config?.popup_show_zones !== false;
    // Title = full date + time (the objects label is intentionally not shown here).
    const titleText = showDate
      ? this._formatDateTime(review.start_time)
      : this._formatTime(review.start_time);
    const duration = this._formatDuration(review.start_time, review.end_time);
    const zones = this._formatZones(review.data?.zones || []);

    // Camera "breadcrumb" shown above the title, linking to the camera's
    // more-info (matching HA's own breadcrumb overline in other dialogs). The
    // Frigate integration exposes each camera as camera.<name>.
    const cameraEntityId = `camera.${review.camera}`;
    const hasCameraEntity = !!this.hass?.states?.[cameraEntityId];
    const cameraName = this._formatCameraName(review.camera);
    const cameraBreadcrumb = !showCameraName
      ? ''
      : hasCameraEntity
        ? html`<button class="breadcrumb" @click=${() => this._openCamera(cameraEntityId)}>${cameraName}</button>`
        : html`<span class="breadcrumb">${cameraName}</span>`;

    const media = showVideo
      ? html`<video autoplay muted controls playsinline>
               <source src="${signedClip}" type="video/mp4">
             </video>`
      : thumbnailUrl
        ? html`<img src="${thumbnailUrl}" alt="${label}" />`
        : html``;

    const hasMeta = (showZones && !!zones) || showDuration;
    const body = html`
      <div class="dialog-media">${media}</div>
      ${hasMeta
        ? html`<div class="dialog-meta">
            ${showZones && zones ? html`<div class="dialog-sub">${zones}</div>` : ''}
            ${showDuration ? html`<div class="dialog-sub">Duration: ${duration}</div>` : ''}
          </div>`
        : ''}
    `;

    // Reuse HA's own adaptive dialog: a centered dialog on desktop and a native
    // drag-to-dismiss bottom sheet on mobile (HA 2026.3+). The camera breadcrumb
    // sits above the title via the subtitle slot; fall back to a plain ha-dialog.
    if (customElements.get('ha-adaptive-dialog')) {
      return html`
        <ha-adaptive-dialog
          open
          width="medium"
          header-title=${titleText}
          header-subtitle-position="above"
          @closed=${() => this._handleModalClose()}
        >
          ${cameraBreadcrumb ? html`<span slot="headerSubtitle">${cameraBreadcrumb}</span>` : ''}
          ${body}
        </ha-adaptive-dialog>
      `;
    }

    return html`
      <ha-dialog open hideActions @closed=${() => this._handleModalClose()}>
        <ha-dialog-header slot="heading">
          <ha-icon-button
            slot="navigationIcon"
            dialogAction="cancel"
            label="Close"
            .path=${MDI_CLOSE}
          ></ha-icon-button>
          <span slot="title">
            ${cameraBreadcrumb ? html`<div class="dialog-overline">${cameraBreadcrumb}</div>` : ''}
            <div>${titleText}</div>
          </span>
        </ha-dialog-header>
        ${body}
      </ha-dialog>
    `;
  }

  private _scroll(direction: 'left' | 'right'): void {
    const container = this.renderRoot.querySelector('.events');
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  private _capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private _formatCameraName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      ha-card {
        overflow: hidden;
        background: transparent;
        box-shadow: none;
        width: 100%;
      }

      .content {
        padding: 0;
      }

      .loading {
        min-height: 80px;
      }

      .events-container {
        position: relative;
        width: 100%;
      }

      .scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, background-color 0.2s, transform 0.2s;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        /* Hidden by default; only shown on desktop (fine pointer) below. */
        display: none;
      }

      /* Show the scroll arrows only where there's a mouse; touch devices swipe. */
      @media (hover: hover) and (pointer: fine) {
        .scroll-btn {
          display: flex;
        }
      }

      .scroll-btn.prev {
        left: 8px;
      }

      .scroll-btn.next {
        right: 8px;
      }

      .events-container:hover .scroll-btn {
        opacity: 1;
      }

      .scroll-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
      }

      .scroll-btn:active {
        transform: translateY(-50%) scale(0.95);
      }

      .events {
        display: grid;
        grid-template-columns: repeat(var(--visible-count, 5), 1fr);
        gap: 9px;
        align-items: start;
      }

      .events.scrollable {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        /* Claim horizontal drags for the carousel and keep the gesture from
           bubbling out to browser-back or a swipe-navigation add-on. */
        touch-action: pan-x;
        overscroll-behavior-x: contain;
        scroll-behavior: smooth;
        grid-template-columns: none;
        -ms-overflow-style: none;
        scrollbar-width: none;
        align-items: start;
      }

      .events.scrollable::-webkit-scrollbar {
        display: none;
      }

      .events.scrollable .event,
      .events.scrollable .placeholder {
        flex: 0 0 calc((100% - (var(--visible-count, 5) - 1) * 9px) / var(--visible-count, 5));
        scroll-snap-align: start;
        box-sizing: border-box;
      }

      .event {
        aspect-ratio: 1 / 1;
        cursor: pointer;
        border-radius: 12px;
        overflow: hidden;
        background: var(--secondary-background-color);
        transition: transform 0.2s, opacity 0.2s;
      }

      .event:hover {
        transform: scale(1.02);
        opacity: 0.9;
      }

      .event:active {
        transform: scale(0.98);
      }

      .placeholder {
        aspect-ratio: 1 / 1;
        border-radius: 12px;
        background: #1c1c1c;
      }

      .event img,
      .event video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .event-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 4px;
        box-sizing: border-box;
        color: var(--secondary-text-color, #aaa);
        font-size: 12px;
        text-align: center;
      }

      .debug-version {
        font-size: 10px;
        color: var(--secondary-text-color, #aaa);
        padding: 2px 8px;
        text-align: right;
        font-family: monospace;
        opacity: 0.7;
      }

      /* Native HA dialog for the detail popup */
      ha-dialog {
        --mdc-dialog-min-width: min(90vw, 520px);
        --mdc-dialog-max-width: min(95vw, 720px);
        --dialog-content-padding: 0;
      }

      ha-adaptive-dialog {
        --dialog-content-padding: 0;
      }

      .dialog-media {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
      }

      .dialog-media img,
      .dialog-media video {
        width: 100%;
        max-height: 70vh;
        object-fit: contain;
        display: block;
      }

      .dialog-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px 16px;
      }

      /* Mirrors Home Assistant's own more-info breadcrumb overline. */
      .breadcrumb {
        color: var(--secondary-text-color);
        font-size: var(--ha-font-size-m, 14px);
        font-family: var(--ha-font-family-heading, inherit);
        line-height: 16px;
        padding: var(--ha-space-1, 4px);
        margin: calc(var(--ha-space-1, 4px) * -1);
        background: none;
        border: none;
        outline: none;
        display: inline;
        border-radius: var(--ha-border-radius-md, 8px);
        transition: background-color 180ms ease-in-out;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
      }

      button.breadcrumb {
        cursor: pointer;
      }

      button.breadcrumb:focus-visible,
      button.breadcrumb:hover {
        background-color: rgba(var(--rgb-secondary-text-color, 114, 114, 114), 0.08);
      }

      .dialog-overline {
        margin-bottom: 2px;
      }

      .dialog-sub {
        font-size: 13px;
        color: var(--secondary-text-color);
        line-height: 1.3;
      }
    `;
  }
}

// --- Visual editor -------------------------------------------------------

const SEVERITY_OPTIONS = [
  { value: 'alert', label: 'Alerts only' },
  { value: 'detection', label: 'Detections only' },
  { value: 'all', label: 'Alerts & detections' },
];

const EDITOR_LABELS: Record<string, string> = {
  instance: 'Frigate instance',
  severity: 'Severity',
  cameras: 'Cameras (comma-separated)',
  labels: 'Labels (comma-separated)',
  zones: 'Zones (comma-separated)',
  items_visible: 'Items visible at once',
  items_limit: 'Max items (count)',
  items_max_age_hours: 'Max age (hours)',
  items_offset: 'Offset (skip newest N)',
  reverse_order: 'Reverse order',
  scrollable: 'Scrollable gallery',
  popup_play_clip: 'Play clip in popup',
  autoplay_on_hover: 'Autoplay clip on hover',
  popup_show_date: 'Show date',
  popup_show_duration: 'Show duration',
  popup_show_camera: 'Show camera name',
  popup_show_zones: 'Show zones',
  daily_reset_time: 'Daily reset time (HH:MM)',
  debug: 'Debug',
};

// Config fields the editor stores as comma-separated text but the card wants as arrays.
const EDITOR_LIST_FIELDS = ['cameras', 'labels', 'zones'];
// Numeric fields that should be omitted from the config when left blank.
const EDITOR_NUMBER_FIELDS = ['items_visible', 'items_limit', 'items_max_age_hours', 'items_offset'];

@customElement('frigate-review-card-editor')
export class FrigateReviewCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config: FrigateReviewCardConfig = { type: 'custom:frigate-review-card' };

  public setConfig(config: FrigateReviewCardConfig): void {
    this._config = config;
  }

  // Collapsible sections; every group uses flatten:true so the config stays flat.
  private get _schema(): unknown[] {
    return [
      {
        name: 'section_source', type: 'expandable', flatten: true, expanded: true,
        title: 'Frigate & filters',
        schema: [
          { name: 'instance', selector: { text: {} } },
          { name: 'severity', selector: { select: { mode: 'dropdown', options: SEVERITY_OPTIONS } } },
          { name: 'cameras', selector: { text: {} } },
          { name: 'labels', selector: { text: {} } },
          { name: 'zones', selector: { text: {} } },
        ],
      },
      {
        name: 'section_items', type: 'expandable', flatten: true, expanded: true,
        title: 'Items shown',
        schema: [
          {
            name: 'items_grid', type: 'grid', flatten: true,
            schema: [
              { name: 'items_visible', selector: { number: { min: 1, mode: 'box' } } },
              { name: 'items_limit', selector: { number: { min: 1, mode: 'box' } } },
              { name: 'items_max_age_hours', selector: { number: { min: 1, mode: 'box' } } },
              { name: 'items_offset', selector: { number: { min: 0, mode: 'box' } } },
            ],
          },
          { name: 'scrollable', selector: { boolean: {} } },
          { name: 'reverse_order', selector: { boolean: {} } },
        ],
      },
      {
        name: 'section_playback', type: 'expandable', flatten: true,
        title: 'Playback',
        schema: [
          { name: 'popup_play_clip', selector: { boolean: {} } },
          { name: 'autoplay_on_hover', selector: { boolean: {} } },
        ],
      },
      {
        name: 'section_popup', type: 'expandable', flatten: true,
        title: 'Popup details',
        schema: [
          {
            name: 'popup_grid', type: 'grid', flatten: true,
            schema: [
              { name: 'popup_show_date', selector: { boolean: {} } },
              { name: 'popup_show_duration', selector: { boolean: {} } },
              { name: 'popup_show_camera', selector: { boolean: {} } },
              { name: 'popup_show_zones', selector: { boolean: {} } },
            ],
          },
        ],
      },
      {
        name: 'section_advanced', type: 'expandable', flatten: true,
        title: 'Advanced',
        schema: [
          { name: 'daily_reset_time', selector: { text: {} } },
          { name: 'debug', selector: { boolean: {} } },
        ],
      },
    ];
  }

  // Merge defaults so toggles reflect the effective behavior; arrays -> text.
  private get _data(): Record<string, unknown> {
    const merged: Record<string, unknown> = { ...DEFAULT_CONFIG, ...this._config };
    for (const field of EDITOR_LIST_FIELDS) {
      const value = merged[field];
      merged[field] = Array.isArray(value) ? value.join(', ') : (value || '');
    }
    return merged;
  }

  private _computeLabel = (schema: { name: string }): string => {
    return EDITOR_LABELS[schema.name] ?? schema.name;
  };

  protected render(): TemplateResult {
    if (!this.hass) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._data}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value: Record<string, unknown> = { ...ev.detail.value };

    // Comma-separated text -> string arrays (drop when empty).
    for (const field of EDITOR_LIST_FIELDS) {
      const raw = value[field];
      if (typeof raw === 'string') {
        const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
        if (items.length) value[field] = items;
        else delete value[field];
      }
    }

    // Drop blank numeric fields so the card's defaults apply.
    for (const field of EDITOR_NUMBER_FIELDS) {
      const raw = value[field];
      if (raw === '' || raw === undefined || raw === null) delete value[field];
    }

    // Keep the YAML minimal: drop values equal to the card default.
    const defaults = DEFAULT_CONFIG as Record<string, unknown>;
    for (const key of Object.keys(value)) {
      if (key === 'type') continue;
      if (defaults[key] !== undefined && value[key] === defaults[key]) delete value[key];
    }

    this._config = value as FrigateReviewCardConfig;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true })
    );
  }

  static get styles(): CSSResult {
    return css`
      ha-form {
        display: block;
      }
    `;
  }
}

// Register the card with Home Assistant
declare global {
  interface HTMLElementTagNameMap {
    'frigate-review-card': FrigateReviewCard;
    'frigate-review-card-editor': FrigateReviewCardEditor;
  }
}

// Card registration for HA
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'frigate-review-card',
  name: 'Frigate Review Card',
  description: 'A simple card for displaying recent Frigate review items (alerts & detections)',
  preview: true,
});

console.info(
  `%c FRIGATE-REVIEW-CARD v${CARD_VERSION} %c Loaded `,
  'color: white; background: #3b82f6; font-weight: bold;',
  'color: #3b82f6; background: white;'
);
