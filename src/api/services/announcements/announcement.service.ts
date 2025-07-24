import { Announcement } from "../../models/Announcement";
import { IAnnouncement } from "../../models/interfaces/announcement.interface";
import { FilterQuery } from "mongoose";

interface GetAnnouncementsParams {
    id?: string;
    isActive?: boolean;
    title?: string;
    content?: string;
    page?: number;
    limit?: number;
}

export async function getAnnouncements({
    id,
    isActive,
    title,
    content,
    page = 1,
    limit = 10,
}: GetAnnouncementsParams) {
    const filter: FilterQuery<IAnnouncement> = {};

    if (id) filter._id = id;
    if (typeof isActive === "boolean") filter.isActive = isActive;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (content) filter.content = { $regex: content, $options: "i" };

    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
        Announcement.find(filter)
            .populate('userId', 'name')
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit),
        Announcement.countDocuments(filter),
    ]);

    return {
        data: announcements,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
} 