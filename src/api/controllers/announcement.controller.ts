import { Request, Response, NextFunction } from "express";
import { getAnnouncements } from "../services/announcements/announcement.service";
import { Announcement } from "../models/Announcement";

export const getAnnouncementsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, isActive, title, content, page, limit } = req.query;
        const result = await getAnnouncements({
            id: id as string,
            isActive: typeof isActive !== "undefined" ? isActive === "true" : undefined,
            title: title as string,
            content: content as string,
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const createAnnouncementController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId, title, content, images, isActive, date } = req.body;
        const announcement = new Announcement({
            userId,
            title,
            content,
            images,
            isActive,
            date,
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncementController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { title, content, images } = req.body;
        const updated = await Announcement.findByIdAndUpdate(
            id,
            { title, content, images },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Announcement not found" });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncementStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const updated = await Announcement.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Announcement not found" });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncementController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleted = await Announcement.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Announcement not found" });
        res.json({ message: "Announcement deleted" });
    } catch (error) {
        next(error);
    }
};

