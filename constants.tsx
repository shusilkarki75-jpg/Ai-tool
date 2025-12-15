import { 
    Music, Book, FileText, MessageSquare, PenTool 
} from 'lucide-react';
import { ContentTypeData, ContentTypeKey } from './types';

export const contentTypesData: Record<ContentTypeKey, ContentTypeData> = {
    Music: {
        label: "संगीत (Music)",
        icon: Music,
        placeholder: "Flute Melody, Sentimental, Acoustic Guitar...",
        selectionList: [
            "Nepali Pop, Romantic Longing",
            "Lok Dohori, Joyful Celebration",
            "Ghazal, Sadness/Melancholy",
            "Fusion, Excitement/Hope",
            "Rap/Hip-Hop, Anger/Rebellion",
            "Rock/Metal, Intense Energy",
            "Acoustic Ballad, Nostalgia",
            "Bhakti Sangeet, Spiritual Peace",
            "Other..."
        ],
        defaultStyleSelection: "Nepali Pop, Romantic Longing",
        defaultStyleDetails: "Flute Melody, Sentimental, Acoustic Guitar",
        lyricsLabel: "गीतका शब्दहरू (Lyrics)",
        themeColor: "rose"
    },
    Story: {
        label: "कथा (Story)",
        icon: Book,
        placeholder: "First Person POV, Gothic Style, 10,000 words target...",
        selectionList: [
            "Fantasy/Epic",
            "Sci-Fi/Dystopian",
            "Romance/Drama",
            "Thriller/Mystery",
            "Historical Fiction",
            "Literary Fiction",
            "Other..."
        ],
        defaultStyleSelection: "Fantasy/Epic",
        defaultStyleDetails: "High Fantasy World, third-person perspective, focus on dialogue and character arc.",
        lyricsLabel: "कथाको सारांश/पहिलो ड्राफ्ट (Story Summary/Draft)",
        themeColor: "indigo"
    },
    News: {
        label: "समाचार लेख (News Article)",
        icon: FileText,
        placeholder: "Formal Tone, SEO Keywords (e.g., 'local election'), 800 words...",
        selectionList: [
            "Investigative Report",
            "Press Release",
            "Editorial/Opinion",
            "Feature Story",
            "Breaking News Update",
            "Analysis",
            "Other..."
        ],
        defaultStyleSelection: "Investigative Report",
        defaultStyleDetails: "Neutral and objective tone, 500 words target, focus on 'infrastructure' keywords.",
        lyricsLabel: "समाचारको विवरण/तथ्याङ्क (News Details/Facts)",
        themeColor: "blue"
    },
    Speech: {
        label: "भाषण (Speech)",
        icon: MessageSquare,
        placeholder: "Formal/Informal, Audience: College Graduates, 5 minutes length, Humorous...",
        selectionList: [
            "Inspirational/Motivational",
            "Political/Campaign",
            "Academic/Commencement",
            "Eulogy/Tribute",
            "Persuasive/Debate",
            "Toast",
            "Other..."
        ],
        defaultStyleSelection: "Inspirational/Motivational",
        defaultStyleDetails: "Informal, Audience: Entrepreneurs, 5 minutes (approx 750 words), use personal anecdotes.",
        lyricsLabel: "भाषणको विषयवस्तु (Speech Topic)",
        themeColor: "amber"
    },
    Essay: {
        label: "निबन्ध (Essay)",
        icon: PenTool,
        placeholder: "MLA Format, Academic Tone, Topic: Climate Change, Sources: 3...",
        selectionList: [
            "Argumentative",
            "Expository",
            "Comparative",
            "Narrative",
            "Research Paper Abstract",
            "Critical Analysis",
            "Other..."
        ],
        defaultStyleSelection: "Argumentative",
        defaultStyleDetails: "APA Format, Academic Tone, 1500 words, Topic: Future of AI in Education.",
        lyricsLabel: "निबन्धको विषयवस्तु (Essay Topic)",
        themeColor: "emerald"
    }
};

export const INITIAL_CONTENT = `[Verse 1]
कहिले यो नेटले धोका दिन्छ
कहिले तिमी आफै हराइदिन्छौ
यो मनमा हेर न कस्तो
पिरको कालो बादल छाउँछ
सधैं लाग्छ तिमी नहुँदा
यो संसारै पुरै रित्तिएको
एकैछिनको त्यो साथमा पनि
मनले तिमीलाई नै सम्झिएको`;