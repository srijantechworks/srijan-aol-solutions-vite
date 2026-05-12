import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    PutCommand
} from '@aws-sdk/lib-dynamodb';

// Placeholder for your metrics service - adjust path if necessary
// import { trackMetric } from './metrics';
const trackMetric = (name: string, data: any) => console.log(`Metric: ${name}`, data);

// 1. Initialize the Client
// In Node.js/Express, we use process.env.
// The "!" tells TypeScript these will be provided by your .env file.
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const docClient = DynamoDBDocumentClient.from(client);

// 2. Table Constants
const STORE_TABLE = process.env.DYNAMODB_EVENTS_TABLE || 'aol_event_message_store';
const MEMORY_TABLE = process.env.DYNAMODB_MEMORY_TABLE || 'aol_message_engagement_memory';
const CONTEXT_CACHE_TABLE = process.env.DYNAMODB_CONTEXT_CACHE_TABLE || "aol_context_cache";
const DYNAMODB_KNOWLEDGE_TABLE = process.env.DYNAMODB_KNOWLEDGE_TABLE || 'aol-knowledge-sheet-intss';
const DYNAMODB_DOC_ID = process.env.DYNAMODB_DOC_ID || 'ainttss';

// ==========================================
// NEW: Knowledge Sheet Function
// ==========================================

/**
 * Fetches a specific styled page from the Knowledge Sheet table
 */
export async function fetchKnowledgePage(pageNumber: number) {
    try {
        const command = new GetCommand({
            TableName: DYNAMODB_KNOWLEDGE_TABLE,
            Key: {
                "document_id": DYNAMODB_DOC_ID,
                "page_number": pageNumber
            }
        });

        const response = await docClient.send(command);
        return response.Item;
    } catch (error) {
        console.error("❌ DynamoDB Knowledge Fetch Error:", error);
        throw error;
    }
}

// ==========================================
// REUSED: Your Existing Logic
// ==========================================

export const buildCourseMemoryPK = (courseLabel: string) => {
    return `EVENTTYPE#${courseLabel
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w()]/g, '')}`;
};

export async function getEventMessageCount(eventId: string): Promise<number> {
    try {
        const command = new GetCommand({
            TableName: STORE_TABLE,
            Key: { PK: `EVENT#${eventId}` }
        });
        const response = await docClient.send(command);
        return response.Item?.message_count || 0;
    } catch (error) {
        console.error("DynamoDB Get Count Error:", error);
        return 0;
    }
}

export async function saveGeneratedBatch(eventId: string, courseName: string, newMessages: any[]) {
    try {
        const command = new UpdateCommand({
            TableName: STORE_TABLE,
            Key: { PK: `EVENT#${eventId}` },
            UpdateExpression: `
                SET event_id = :eventId, 
                    course_event_type_label = :courseName,
                    engaged_messages = list_append(if_not_exists(engaged_messages, :emptyList), :newMessages),
                    message_count = if_not_exists(message_count, :zero) + :inc
            `,
            ExpressionAttributeValues: {
                ":eventId": eventId,
                ":courseName": courseName,
                ":emptyList": [],
                ":newMessages": newMessages,
                ":zero": 0,
                ":inc": newMessages.length
            }
        });
        await docClient.send(command);
    } catch (error) {
        console.error("DynamoDB Save Batch Error:", error);
    }
}

export async function getTopMessagesByCourseType(courseLabel: string) {
    try {
        const memoryPK = buildCourseMemoryPK(courseLabel);
        const command = new GetCommand({
            TableName: MEMORY_TABLE,
            Key: { PK: memoryPK }
        });

        const response = await docClient.send(command);
        if (!response.Item) return [];

        const messages = response.Item.messages || [];
        return messages
            .sort((a: any, b: any) => (b.engagement_score || 0) - (a.engagement_score || 0))
            .slice(0, 5);
    } catch (error) {
        console.error("❌ DynamoDB Memory Fetch Error:", error);
        return [];
    }
}

export async function getCachedContext(eventId: string) {
    try {
        const response = await docClient.send(new GetCommand({
            TableName: CONTEXT_CACHE_TABLE,
            Key: { PK: `EVENT#${eventId}` }
        }));

        if (!response.Item) return null;
        const item = response.Item;
        const now = Math.floor(Date.now() / 1000);

        if (item.expires_at && item.expires_at < now) return null;
        return item.context;
    } catch (error) {
        console.error("❌ Context cache fetch failed:", error);
        return null;
    }
}

export async function saveContextCache({ eventId, context }: { eventId: string; context: any; }) {
    try {
        const now = Math.floor(Date.now() / 1000);
        await docClient.send(new PutCommand({
            TableName: CONTEXT_CACHE_TABLE,
            Item: {
                PK: `EVENT#${eventId}`,
                context,
                created_at: new Date().toISOString(),
                expires_at: now + 60
            }
        }));
    } catch (error) {
        trackMetric("context_cache_save_failure", { error: String(error) });
        console.error("❌ Failed saving context cache:", error);
    }
}

export async function recordEngagement(
    eventId: string,
    courseLabel: string,
    messageData: any,
    action: 'copy' | 'like' | 'share'
) {
    try {
        const memoryPK = buildCourseMemoryPK(courseLabel || 'DEFAULT');
        const getMem = await docClient.send(new GetCommand({
            TableName: MEMORY_TABLE,
            Key: { PK: memoryPK }
        }));

        let memItem = getMem.Item || { PK: memoryPK, course_event_type_label: courseLabel, messages: [] };
        let memMessages = memItem.messages || [];
        const msgIdx = memMessages.findIndex((m: any) => m.message_id === messageData.message_id);

        if (msgIdx !== -1) {
            if (action === 'copy') memMessages[msgIdx].copy_count = (memMessages[msgIdx].copy_count || 0) + 1;
            if (action === 'like') memMessages[msgIdx].like_count = (memMessages[msgIdx].like_count || 0) + 1;
            if (action === 'share') memMessages[msgIdx].share_count = (memMessages[msgIdx].share_count || 0) + 1;
            memMessages[msgIdx].engagement_score = (memMessages[msgIdx].like_count || 0) + (memMessages[msgIdx].share_count || 0) + (memMessages[msgIdx].copy_count || 0);
        } else {
            memMessages.push({
                message_id: messageData.message_id,
                message_text: messageData.message_text,
                copy_count: action === 'copy' ? 1 : 0,
                like_count: action === 'like' ? 1 : 0,
                share_count: action === 'share' ? 1 : 0,
                engagement_score: 1,
                source_event_id: eventId,
                created_at: new Date().toISOString()
            });
        }

        await docClient.send(new PutCommand({
            TableName: MEMORY_TABLE,
            Item: { ...memItem, messages: memMessages }
        }));

        // Table 1 Update Logic...
        const getResponse = await docClient.send(new GetCommand({
            TableName: STORE_TABLE,
            Key: { PK: `EVENT#${eventId}` }
        }));

        const item = getResponse.Item;
        if (item && item.engaged_messages) {
            const messagesArray = item.engaged_messages;
            const storeMsgIdx = messagesArray.findIndex((m: any) => m.message_id === messageData.message_id);

            if (storeMsgIdx !== -1) {
                if (action === 'copy') messagesArray[storeMsgIdx].copy_count = (messagesArray[storeMsgIdx].copy_count || 0) + 1;
                if (action === 'like') messagesArray[storeMsgIdx].like_count = (messagesArray[storeMsgIdx].like_count || 0) + 1;
                if (action === 'share') messagesArray[storeMsgIdx].share_count = (messagesArray[storeMsgIdx].share_count || 0) + 1;

                await docClient.send(new UpdateCommand({
                    TableName: STORE_TABLE,
                    Key: { PK: `EVENT#${eventId}` },
                    UpdateExpression: `SET engaged_messages = :updatedMessages`,
                    ExpressionAttributeValues: { ":updatedMessages": messagesArray }
                }));
            }
        }
        return true;
    } catch (error) {
        console.error(`💥 Engagement Error:`, error);
        return false;
    }
}