import bcrypt from "bcryptjs";
import { Resident } from "../../models/User.js";

export const initializeResidents = async (): Promise<void> => {
    try {
        const residentCount = await Resident.countDocuments();
        if (residentCount === 0) {
            const hashedPassword = bcrypt.hashSync("12345678", 10);

            const defaultResidents = [
                {
                    username: "Bilal Khan",
                    phoneNumber: "03343535796",
                    password: null,
                    deviceID: null,
                    houseNumber: "IH-702",
                    isFirstLogin: true,
                    isActive: true,
                    cnic: null,
                },
                {
                    username: "Nabeel Khan",
                    phoneNumber: "03242530094",
                    password: null,
                    deviceID: null,
                    houseNumber: "IH-702",
                    isFirstLogin: true,
                    isActive: true,
                    cnic: null,
                },
                {
                    username: "Muhammad Naeem",
                    phoneNumber: "03212122526",
                    password: null,
                    deviceID: null,
                    houseNumber: "IH-702",
                    isFirstLogin: true,
                    isActive: true,
                    cnic: null,
                },
                {
                    username: "sara_ahmed",
                    phoneNumber: "03009876546",
                    password: hashedPassword,
                    deviceID: "861234567890126",
                    houseNumber: "B-202",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-4",
                },
                {
                    username: "ali_hassan",
                    phoneNumber: "03009876547",
                    password: hashedPassword,
                    deviceID: "861234567890127",
                    houseNumber: "C-301",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-5",
                },
                {
                    username: "ayesha_khan",
                    phoneNumber: "03009876548",
                    password: hashedPassword,
                    deviceID: "861234567890128",
                    houseNumber: "C-302",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-6",
                },
                {
                    username: "usman_ali",
                    phoneNumber: "03009876549",
                    password: hashedPassword,
                    deviceID: "861234567890129",
                    houseNumber: "D-401",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-7",
                },
                {
                    username: "nadia_ahmed",
                    phoneNumber: "03009876550",
                    password: hashedPassword,
                    deviceID: "861234567890130",
                    houseNumber: "D-402",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-8",
                },
                {
                    username: "hamza_khan",
                    phoneNumber: "03009876551",
                    password: hashedPassword,
                    deviceID: "861234567890131",
                    houseNumber: "E-501",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-9",
                },
                {
                    username: "zara_ali",
                    phoneNumber: "03009876552",
                    password: hashedPassword,
                    deviceID: "861234567890132",
                    houseNumber: "E-502",
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-1234567-0",
                },
            ];

            await Resident.insertMany(defaultResidents);
            console.log("🏠 Default residents created");
            console.log("📱 Mobile app login credentials:");
            console.log("   Ahmed Khan: 03009876543 / 12345678 (A-101)");
            console.log("   Fatima Ali: 03009876544 / 12345678 (A-102)");
            console.log("   Muhammad Raza: 03009876545 / 12345678 (B-201)");
            console.log("   Sara Ahmed: 03009876546 / 12345678 (B-202)");
            console.log("   Ali Hassan: 03009876547 / 12345678 (C-301)");
            console.log("   Ayesha Khan: 03009876548 / 12345678 (C-302)");
            console.log("   Usman Ali: 03009876549 / 12345678 (D-401)");
            console.log("   Nadia Ahmed: 03009876550 / 12345678 (D-402)");
            console.log("   Hamza Khan: 03009876551 / 12345678 (E-501)");
            console.log("   Zara Ali: 03009876552 / 12345678 (E-502)");
        } else {
            console.log("🏠 Residents already exist, skipping initialization");
        }
    } catch (error) {
        console.error("❌ Error initializing residents:", error);
    }
};

import { CreateResidentData } from "../../models/interfaces/resident.interface.js";

export const createResident = async (residentData: CreateResidentData): Promise<void> => {
    try {
        const hashedPassword = bcrypt.hashSync(residentData.password, 10);

        const resident = new Resident({
            username: residentData.username,
            phoneNumber: residentData.phoneNumber,
            password: hashedPassword,
            deviceID: residentData.deviceID,
            houseNumber: residentData.houseNumber,
            isFirstLogin: false,
            isActive: true,
            cnic: residentData.cnic,
        });

        await resident.save();
        console.log(`✅ Resident ${residentData.username} created successfully`);
    } catch (error) {
        console.error(`❌ Error creating resident ${residentData.username}:`, error);
        throw error;
    }
};

export const updateResidentDevice = async (residentId: string, deviceID: string): Promise<void> => {
    try {
        await Resident.findByIdAndUpdate(residentId, { deviceID });
        console.log(`✅ Resident device updated successfully`);
    } catch (error) {
        console.error("❌ Error updating resident device:", error);
        throw error;
    }
};

export const deactivateResident = async (residentId: string): Promise<void> => {
    try {
        await Resident.findByIdAndUpdate(residentId, { isActive: false });
        console.log(`✅ Resident deactivated successfully`);
    } catch (error) {
        console.error("❌ Error deactivating resident:", error);
        throw error;
    }
};

export const getResidentsByBlock = async (block: string): Promise<any[]> => {
    try {
        const residents = await Resident.find({
            houseNumber: { $regex: `^${block}-`, $options: 'i' },
            isActive: true
        }).select('username phoneNumber houseNumber deviceID');

        return residents;
    } catch (error) {
        console.error("❌ Error getting residents by block:", error);
        throw error;
    }
};

export const getResidentByHouseNumber = async (houseNumber: string): Promise<any> => {
    try {
        const resident = await Resident.findOne({
            houseNumber: houseNumber,
            isActive: true
        });

        return resident;
    } catch (error) {
        console.error("❌ Error getting resident by house number:", error);
        throw error;
    }
}; 