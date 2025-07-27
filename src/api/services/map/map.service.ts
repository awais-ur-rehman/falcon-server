import { Map } from "../../models/Map.js";
import { IMap } from "../../models/interfaces/map.interface.js";
import { APIError } from "../../utils/apiError.js";

export const createMap = async (
  mapData: Partial<IMap>
): Promise<IMap> => {
  if (!mapData.name) {
    throw new APIError("Name is required", 400);
  }
  
  if (!mapData.lat) {
    throw new APIError("Latitude is required", 400);
  }

  if (!mapData.long) {
    throw new APIError("Longitude is required", 400);
  }

  if (!mapData.tag) {
    throw new APIError("Tag is required", 400);
  }

  if (mapData.lat < -90 || mapData.lat > 90) {
    throw new APIError("Latitude must be between -90 and 90", 400);
  }

  if (mapData.long < -180 || mapData.long > 180) {
    throw new APIError("Longitude must be between -180 and 180", 400);
  }

  const map = new Map(mapData);
  const savedMap = await map.save();
  
  return savedMap;
};

export const updateMap = async (
  mapId: string,
  updateData: Partial<IMap>
): Promise<IMap> => {
  if (!mapId) {
    throw new APIError("Map ID is required", 400);
  }

  if (updateData.lat !== undefined && (updateData.lat < -90 || updateData.lat > 90)) {
    throw new APIError("Latitude must be between -90 and 90", 400);
  }

  if (updateData.long !== undefined && (updateData.long < -180 || updateData.long > 180)) {
    throw new APIError("Longitude must be between -180 and 180", 400);
  }

  const updatedMap = await Map.findByIdAndUpdate(
    mapId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedMap) {
    throw new APIError("Map not found", 404);
  }

  return updatedMap;
};

export const deleteMap = async (
  mapId: string
): Promise<void> => {
  if (!mapId) {
    throw new APIError("Map ID is required", 400);
  }

  const deletedMap = await Map.findByIdAndDelete(mapId);

  if (!deletedMap) {
    throw new APIError("Map not found", 404);
  }
};

export const getMaps = async (): Promise<IMap[]> => {
  const maps = await Map.find().sort({ createdAt: -1 });
  return maps;
};