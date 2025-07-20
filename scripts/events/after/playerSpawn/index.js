import { world } from '@minecraft/server';
import { PlayerDataManager } from "class/playerDataManager";

export function playerSpawn(eventData) {
    const player = eventData.player;

    if (eventData.initialSpawn) { // 플레이어가 접속한 경우
        const playerData = world.getDynamicProperty(player.id) || "";
        if (playerData) {
            const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toLocaleDateString("ko-KR");
            const dailyReward = player.getDynamicProperty("dailyReward") || "";
            if (dailyReward === today) return;
            player.sendMessage("§e다시 오신 것을 환영합니다");
            player.sendMessage("§e!출석 을 입력하여 오늘의 출석 보상을 수령해주세요");
        }
        else {
            const playerListString = world.getDynamicProperty("playerList") || "";
            let playerList = playerListString ? playerListString.split(",") : [];
            playerList.push(player.id);
            world.setDynamicProperty("playerList", playerList.join(","));

            world.sendMessage(`§e${player.name}님, 서버에 처음 오신 것을 환영합니다!`);
            player.runCommand("give @s iron_pickaxe");
            //player.getComponent("minecraft:inventory").container.addItem(starterPack);
            //첫 접속 시에는 출석보상도 자동수령되도록 할 예정

            PlayerDataManager.registerPlayerData(player);
        }
    }
    else if (!eventData.initialSpawn) { // 플레이어가 죽고 부활한 경우
        player.setDynamicProperty("burns", 0); // 화상 초기화
        player.setDynamicProperty("reviveCooldown", 0); // 소생쿨 초기화
    }    
}