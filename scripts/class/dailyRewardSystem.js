import { system } from "@minecraft/server";
import { PlayerDataManager } from "class/playerDataManager";

export class DailyRewardSystem {
    static rewardReceipt(player) {
        const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toLocaleDateString("ko-KR");
        const dailyReward = player.getDynamicProperty("dailyReward") || "";
        if (dailyReward !== today) {
            system.run(() => {
                player.runCommand("give @s diamond");
            });
            player.sendMessage("출석 보상을 수령했습니다.");
            player.setDynamicProperty("dailyReward", today);

            const playerId = player.id;
            const playerData = PlayerDataManager.getPlayerData(playerId);
            if (!playerData) return;
            PlayerDataManager.modifyPlayerData(playerId, "dailyRewardCount", playerData["dailyRewardCount"] + 1);
        }
        else {
            player.sendMessage("이미 출석 보상을 받았습니다.");
            return;
        }
    }
}