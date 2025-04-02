import { EquipmentSlot } from "@minecraft/server";
import { equipmentData, abilityData } from "data/equipment"

export class analyzeEquipmentSystem {
    static equipmentCheck(player) {
        const equippable = player.getComponent("minecraft:equippable");
        const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!mainhand) { // 손이 비어있다면
            player.sendMessage("아이템을 들고 있지 않습니다.");
            return;
        }

        const equipmentInfo = equipmentData[mainhand.typeId];
        if (!equipmentInfo) { // 손에 든 아이템이 감정할 수 있는 장비가 아니라면
            player.sendMessage("이 아이템은 감정할 수 없습니다.");
            return;
        }

        const item = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        let lore = item.getLore();
        if (lore.some(line => line.includes("◎"))) { // 감정 기회가 남아있다면
            let index = lore.findIndex(line => line.includes("◎"));
            lore[index] = lore[index].replace("◎", "*"); // 감정 기회 1개 소모
            this.analyzeEquipment(lore, equipmentInfo, player, item);
        }
        else if (lore.some(line => line.includes("*"))) { // 감정 기회는 없는데 감정받은 적은 있다면
            player.sendMessage("이 아이템은 더 이상 감정할 수 없습니다.");
            return;
        }
        else { // 감정받은 적이 없다면
            lore = this.chanceRoll(lore);
            this.analyzeEquipment(lore, equipmentInfo, player, item);
        }
    }

    static chanceRoll(lore) { // 랜덤으로 1~5번의 감정 기회 부여
        let chanceRoll = Math.random();
        let upgradeChances;
        if (chanceRoll < 0.1) upgradeChances = 1;
        else if (chanceRoll < 0.3) upgradeChances = 2;
        else if (chanceRoll < 0.7) upgradeChances = 3;
        else if (chanceRoll < 0.9) upgradeChances = 4;
        else upgradeChances = 5;

        let upgradeLine = "◎ ".repeat(upgradeChances).trim();
        lore.unshift(upgradeLine);
        return lore;
    }

    static analyzeEquipment(lore, equipmentInfo, player, item) { // 랜덤으로 0~2번의 능력 부여
        let abilityRoll = Math.random();
        let abilityCount;
        if (abilityRoll < 0.2) abilityCount = 0;
        else if (abilityRoll < 0.7) abilityCount = 1;
        else abilityCount = 2;
        
        let abilities = [];
        equipmentInfo.categories.forEach(category => { // 장비에 부여가능한 모든 능력을 배열에 추가
            if (abilityData[category]) {
                abilities = abilities.concat(abilityData[category]);
            }
        });

        let chosenAbilities = {};
        for (let i = 0; i < abilityCount; i++) {
            let ability = abilities[Math.floor(Math.random() * abilities.length)];
        
            // 감정에서 같은 능력이 나오면 레벨 +1 증가
            if (chosenAbilities[ability]) {
                chosenAbilities[ability] += 1;
            } else {
                chosenAbilities[ability] = 1;
            }
        }

        for (let ability in chosenAbilities) {
            let existingIndex = lore.findIndex(line => line.startsWith(ability));
        
            if (existingIndex !== -1) { // 선택된 능력이 이미 장비에 있었다면 레벨 추가
                let parts = lore[existingIndex].split(" ");
                let lastPart = parts[parts.length - 1];
                
                let level = parseInt(lastPart);
                if (!isNaN(level)) {
                    level += chosenAbilities[ability];
                    lore[existingIndex] = `${parts.slice(0, -1).join(" ")} ${level}`;
                }
            } else { // 선택된 능력이 장비에 없었으면 새로 추가
                lore.push(`${ability} ${chosenAbilities[ability]}`);
            }
        }
        
        player.sendMessage(`${abilityCount}개의 능력이 부여되었습니다.`);
        item.setLore(lore);
        return;
    }
}