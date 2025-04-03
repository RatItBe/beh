import { world } from "@minecraft/server";

export function playerJoin(eventData) {
    const playerName = eventData.playerName;
    
    let joinedPlayers = world.getDynamicProperty("joinedPlayers") || ""; // 플레이어 명단 불러오기
    let playerList = joinedPlayers ? joinedPlayers.split(",") : [];

    if (!playerList.includes(playerName)) { // 서버 최초 방문자일 시
        playerList.push(playerName); // 명단에 플레이어 새로 추가
        world.setDynamicProperty("joinedPlayers", playerList.join(","));
    }
}