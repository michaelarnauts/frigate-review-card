# Frigate Review Card

A simple Lovelace card for displaying recent Frigate **review items** (alerts & detections) in a horizontal gallery.

> This is a fork of [saihgupr/frigate-events-card](https://github.com/saihgupr/frigate-events-card) that shows Frigate **review items** instead of individual events. See [Reviews vs. Events](#reviews-vs-events) for why.

## Reviews vs. Events

Frigate has two related but distinct data models:

- **Events / tracked objects** (`/api/events`) — one entry per *individual tracked object*. A single alert can contain several of these (e.g. an object whose track is briefly lost and re-acquired, or multiple objects at once).
- **Review items** (`/api/review`) — *segments of activity* classified as **alerts** or **detections**, each grouping one or more tracked objects. This is what the Frigate UI's **Review** page shows.

The original card renders events, so one alert can appear as several tiles. This card renders review items, so **one alert shows as one tile**, matching the Frigate UI.

## Features

- **Fast & Lightweight**: Minified and optimized for quick loading.
- **Live Updates**: Instantly shows new review items via WebSocket.
- **Alerts & Detections**: Filter by review severity, defaulting to alerts to match the Frigate UI.
- **Responsive**: Auto-adjusting grid layout that works great on mobile.
- **Sections View Ready**: Fully compatible with Home Assistant's Sections view, rendering full-width and scaling properly.
- **Video Playback**: Natively stream the review's recording clip (MP4) directly in your browser.
- **Hover Previews**: Instantly play the clip when hovering over any review tile.
- **Scrollable Gallery**: Optional horizontal scroll mode — arrow buttons on desktop, swipe on touch devices — with a hidden scrollbar for a clean, native feel.
- **Customizable Layout**: Reverse the rendering order or offset the timeline to build the exact dashboard you want.
- **Daily Reset**: Optional automated clearing for a fresh daily view.
- **Interactive Popup**: Native Home Assistant dialog (a drag-to-dismiss bottom sheet on mobile) that plays the full clip, with the timestamp, a camera breadcrumb link, zones, and duration.
- **Configurable Popup Details**: Toggle the date, duration, camera name, and zones shown in the popup.
- **Visual Editor**: Configure the card from the dashboard UI — no YAML required.

## Installation

### HACS (Recommended)

This card can be easily installed via [HACS](https://hacs.xyz/) (Home Assistant Community Store) as a custom repository.

1. Open HACS in Home Assistant.
2. Click on the 3 dots in the top right corner and select **Custom repositories**.
3. Add the URL of this repository (`https://github.com/michaelarnauts/frigate-review-card`) and select **Dashboard** (or Lovelace) as the category.
4. Click **Add**, then close the modal.
5. You should now see "Frigate Review Card" in your HACS interface. Click on it and select **Download**.
6. When prompted, reload your browser cache.

### Manual Installation

1. Download `frigate-review-card.js` from the [latest release](https://github.com/michaelarnauts/frigate-review-card/releases)
2. Copy it to your Home Assistant `www/` folder
3. Add the resource in your Lovelace dashboard:
   ```yaml
   resources:
     - url: /local/frigate-review-card.js
       type: module
   ```
4. Add the card to your dashboard

## Usage

```yaml
type: custom:frigate-review-card
instance: frigate
items_visible: 5

# Optional: which review severity to show ("alert", "detection", or "all")
severity: alert

# Optional filters
cameras:
  - wyze_camera
labels:
  - person
  - car
zones:
  - front_a
  - front_b

# Optional: how many items to load — a maximum count and/or a maximum age
scrollable: true
items_limit: 40
# items_max_age_hours: 48

# Optional: skip the newest N and/or reverse the order
items_offset: 1
reverse_order: true

# Optional: video playback
popup_play_clip: true
autoplay_on_hover: true

# Optional: popup details (all shown by default)
popup_show_date: true
popup_show_duration: true
popup_show_camera: true
popup_show_zones: true

# Optional: reset the list daily at a specific time (24hr)
daily_reset_time: "04:00"

# Optional: debugging
debug: true
```

### Example: Scrollable Timeline

This example creates a horizontally scrollable gallery showing 6 thumbnails at a time, loading up to 40 total review items.

```yaml
type: custom:frigate-review-card
instance: frigate
items_visible: 6
scrollable: true
items_limit: 40
autoplay_on_hover: true
```

### Example: Alerts and Detections

By default only alerts are shown. Set `severity: all` to include detections too, or `severity: detection` for detections only.

```yaml
type: custom:frigate-review-card
instance: frigate
severity: all
```

### Example: Last 48 hours

Show **every** review item from the last 48 hours. `items_limit` and `items_max_age_hours` are independent maximums — set `items_max_age_hours` alone for a pure time window, or add `items_limit` to also cap the number.

```yaml
type: custom:frigate-review-card
instance: frigate
scrollable: true
items_visible: 5
items_max_age_hours: 48
```

## Configuration Options

### Basic Settings

The most common settings to get you started:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `instance` | string | `frigate` | Your Frigate integration instance ID. |
| `items_visible` | number | `5` | Number of items visible at once (thumbnails in the scroll viewport, or columns in the non-scroll grid). |
| `severity` | string | `alert` | Which review severity to show: `alert`, `detection`, or `all`. |
| `cameras` | list | all | Filter to specific cameras |
| `labels` | list | all | Filter to specific labels (person, car, etc.) |
| `zones` | list | all | Filter to specific Frigate zones |
| `popup_play_clip` | boolean | `true` | Play the review's recording clip instead of a still image in the popup. |
| `autoplay_on_hover` | boolean | `true` | Autoplay the review clip when hovering over a tile (desktop). |
| `scrollable` | boolean | `true` | Enable horizontal scrolling gallery. `items_visible` sets how many thumbnails are visible at once; you scroll through the rest. |

<details>
<summary><strong>Advanced Settings</strong> (Click to expand)</summary>

### Media & Playback

- **Tile / popup thumbnail**: taken from the review's primary detection via the integration's *notifications* proxy, which allows unauthenticated access — so images load in `<img>` without a token.
- **Clip playback** (`popup_play_clip: true`, and hover previews): the camera **recording** for the review's full time span, so a single alert plays as one clip covering all of its detections. The recording proxy requires authentication, so the card signs the URL on demand via Home Assistant's `auth/sign_path` (the same `?authSig=` mechanism used for camera thumbnails) and caches it per review.

> Because clips use the recording, **recordings must be retained** for the review's camera/time range. If you only keep snapshots, set `popup_play_clip: false` to show thumbnails only.

### Advanced Layout & Timeline Settings
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items_limit` | number | `20` | Maximum number of review items to load/show. Combine with `items_max_age_hours` (both are maximums). Omit the count cap by setting `items_max_age_hours` without `items_limit`. |
| `items_max_age_hours` | number | none | Maximum age of items to show, in hours (e.g. `48` = last 2 days). Combine with `items_limit`, or use alone for a pure time window. |
| `reverse_order` | boolean | `false` | Reverses the rendering order of the timeline (items populate right-to-left instead of left-to-right). |
| `items_offset` | number | `0` | Number of recent review items to skip/hide from the start of the list. Useful for excluding the newest item if it's already shown in another card. |
| `daily_reset_time` | string | none | Optional. Time to reset the display daily (24hr format, e.g., "04:00"). If set, items before this time are hidden and shown as grey placeholders. |

### Advanced Popup & Debug Settings

The detail popup uses Home Assistant's native adaptive dialog — a centered dialog on desktop and a drag-to-dismiss bottom sheet on mobile (HA 2026.3+; it falls back to a standard dialog on older versions). The header title is the review's date and time (in your Home Assistant 12/24-hour format); above it, the camera name appears as a breadcrumb link to the camera's more-info (when a matching `camera.<name>` entity exists). Below the clip it shows the zones and duration.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `popup_show_date` | boolean | `true` | Include the date in the dialog title (with the time). When `false`, only the time is shown. |
| `popup_show_duration` | boolean | `true` | Show the review duration (e.g., `9s` or `Ongoing`) below the clip. |
| `popup_show_camera` | boolean | `true` | Show the camera name as a breadcrumb above the title (links to the camera when available). |
| `popup_show_zones` | boolean | `true` | Show the physical zones (locations) below the clip. |
| `debug` | boolean | `false` | Enable debug mode to display the current card version number above the gallery. |

</details>

## Requirements

- Home Assistant with the [Frigate Integration](https://github.com/blakeblackshear/frigate-hass-integration) installed. Review support requires a reasonably recent integration (Frigate 0.14+), which exposes the `frigate/reviews/get` WebSocket command.
- Frigate NVR with cameras configured.
- For clip playback (`popup_play_clip: true`), recordings must be retained for the review's time range.

## Contributing

Contributions and issues are welcome — fork the repository, create a feature branch, and open a Pull Request.

## Support & Feedback

If you encounter any issues, bugs, or have feature requests, please [open an issue on GitHub](https://github.com/michaelarnauts/frigate-review-card/issues).
