export enum EventType {
    Announcement = "Announcement",
    Poll = "Poll",
    Match = "Match",
}

export enum EventResponse {
    Unknown = "Unknown",
    Accepted = "Accepted",
    Declined = "Declined",
}

export interface EventParticipant {
    userId: string;
    response: EventResponse;
}

export interface TeamEvent {
    id: string;
    teamId: string;
    creatorId?: string;
    title: string;
    description?: string;
    type: EventType | string;
    eventDate?: string;
    location?: string;
    createdAt?: string;
    myResponse: EventResponse | string;
    acceptedCount?: number;
    declinedCount?: number;
}

export interface CreateEventRequest {
    teamId: string;
    title: string;
    description?: string;
    type: EventType;
    eventDate?: string;
    location?: string;
    invitedUserIds: string[];
}

export interface RespondToEventRequest {
    response: EventResponse;
}