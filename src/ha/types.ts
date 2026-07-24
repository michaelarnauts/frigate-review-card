/**
 * Simplified Home Assistant types for the Frigate Events Card
 */
import { MessageBase } from 'home-assistant-js-websocket';

export interface HomeAssistant {
    connection: {
        subscribeMessage<T>(
            callback: (message: T) => void,
            subscribeMessage: MessageBase
        ): Promise<() => void>;
    };
    config: {
        time_zone: string;
    };
    locale?: {
        language: string;
        // 'language' / 'system' = auto-detect; '12' = AM/PM; '24' = 24-hour
        time_format: 'language' | 'system' | '12' | '24';
    };
    states: Record<string, { state: string; last_changed?: string; attributes?: Record<string, unknown> }>;
    callWS: <T>(msg: MessageBase) => Promise<T>;
    hassUrl: (path?: string) => string;
}

export interface LovelaceCardConfig {
    type: string;
    [key: string]: unknown;
}

export interface LovelaceLayoutOptions {
    grid_rows?: number;
    grid_columns?: number;
    grid_min_rows?: number;
    grid_max_rows?: number;
    grid_min_columns?: number;
    grid_max_columns?: number;
}

export interface LovelaceCard extends HTMLElement {
    hass?: HomeAssistant;
    getCardSize(): number | Promise<number>;
    setConfig(config: LovelaceCardConfig): void;
    getLayoutOptions?(): LovelaceLayoutOptions;
}
