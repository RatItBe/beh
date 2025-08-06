import { world } from '@minecraft/server';
import { EquipmentManager } from "class/equipment/equipmentManager"
import { PlayerDataManager } from "class/playerDataManager";
import { equipmentList } from "data/equipment";

export function playerSpawn(eventData) {
    const player = eventData.player;

    if (eventData.initialSpawn) { // 플레이어가 접속한 경우
        const playerData = world.getDynamicProperty(player.id) || "";
        if (playerData) { // 플레이어 데이터가 있으면
            // 출석 체크했는지 확인
            const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toLocaleDateString("ko-KR");
            const dailyReward = player.getDynamicProperty("dailyReward") || "";
            if (dailyReward === today) return;
            player.sendMessage("§e다시 오신 것을 환영합니다");
            player.sendMessage("§e!출석 을 입력하여 오늘의 출석 보상을 수령해주세요");

            // 인벤토리 내 장비들이 최신 상태인지 확인
            const inventoryComponent = player.getComponent("minecraft:inventory");
            const inventoryContainer = inventoryComponent.container; // 인벤토리 컨테이너 가져오기
            for (let i = 0; i < inventoryContainer.size; i++) { // 인벤토리 슬롯 수만큼 반복
                const inventoryItem = inventoryContainer.getItem(i); // 인벤토리 슬롯의 아이템 가져오기
                if (!inventoryItem) continue; // 비어있는 슬롯이면 패스
                if (!equipmentList.includes(inventoryItem.typeId)) continue; // 장비가 아니면 패스
                EquipmentManager.playerEquipmentCheck(player, inventoryItem, i); // 최신 상태인지 체크
                //갑옷 부분도 확인해줘야 함
            }
        }
        else { // 플레이어 데이터가 없으면
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