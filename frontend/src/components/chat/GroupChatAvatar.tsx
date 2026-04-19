import type { Participant } from '@/types/chat'
import React from 'react'
import UserAvatar from './userAvatar'
interface GroupChatAvatarProps {
    participants: Participant[]
    type: "chat" | "sidebar"

}
const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
    const avatars = []
    const limit = Math.min(participants.length, 4);
    for (let i = 0; i < limit; i++) {
        const mem = participants[i];
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={mem.displayName ?? ""}
                avatarUrl={mem.avatarUrl ?? undefined}
            />
        )
    }
    return (
        <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background &:data-[slot=avatar}:ring-2]"></div>
    )
}

export default GroupChatAvatar
