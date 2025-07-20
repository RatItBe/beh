// 1초에 한 번 실행될 코드
import { world } from "@minecraft/server";
import { PlayerDataManager } from "class/playerDataManager";

export function runInterval20(player) {
    let playerData = PlayerDataManager.getPlayerData(player.id);
    if (!playerData) return;
    playerData["playTime"]++;
    world.setDynamicProperty(player.id, JSON.stringify(playerData));

    const playerFire = player.getComponent("minecraft:onfire"); // 불 붙은 플레이어 확인
    const burns = player.getDynamicProperty("burns"); // 화상 값 확인
    if (!playerFire && burns > 0) player.setDynamicProperty("burns", burns - 1); //불이 안붙어있으면 화상값 감소

    const reviveCooldown = player.getDynamicProperty("reviveCooldown") || 0;
    if (reviveCooldown > 0) player.setDynamicProperty("reviveCooldown", reviveCooldown - 1);
}
