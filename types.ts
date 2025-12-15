import { LucideIcon } from 'lucide-react';

export type ContentTypeKey = 'Music' | 'Story' | 'News' | 'Speech' | 'Essay';

export interface ContentTypeData {
    label: string;
    icon: LucideIcon;
    placeholder: string;
    selectionList: string[];
    defaultStyleSelection: string;
    defaultStyleDetails: string;
    lyricsLabel: string;
    themeColor: string; // Tailwind color class prefix (e.g., 'rose', 'indigo')
}

export interface Song {
    id: number;
    title: string;
    style: string;
    date: string;
    duration: number; // in seconds
    coverColor: string; // Tailwind bg class
    lyrics: string;
}

export interface Note {
    id: number;
    title: string;
    type: ContentTypeKey;
    summary: string;
    fullContent: string;
    style: string;
    date: string;
}

export interface DictionaryResult {
    word: string;
    language: string;
    meaning: string;
}

export interface ImagePrompt {
    id: number;
    prompt: string;
    summary_ne: string;
    status: 'pending' | 'generated' | 'loading' | 'error';
    imageUrl?: string;
}

export type ViewState = 'CREATE' | 'GENERATED' | 'NOTES' | 'DICTIONARY' | 'ABOUT' | 'SETTINGS';