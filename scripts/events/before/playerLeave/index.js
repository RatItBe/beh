import { world } from "@minecraft/server";
import { PlayerDataManager } from "class/playerDataManager";

export function playerLeave(eventData) {
    const playerId = eventData.player.id;

    const playerData = world.getDynamicProperty(playerId) || "";
    if (!playerData) return;
    const lastSeen = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toLocaleString("ko-KR");
    PlayerDataManager.modifyPlayerData(playerId, "lastSeen", lastSeen);
}
