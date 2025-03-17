import { world, EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { equipmentData, abilityData } from "data/equipment"

export class DebugSystem {
    static selectMenu(player) {
        const form = new ActionFormData()
        .title("Debug")
        .body("테스트용 기능")
        .button("무기 감정하기")
        .button("솥 전체 초기화");

        form.show(player).then(response => {
            if (response.selection == 0) this.analyzeEquipment(player);
            else if (response.selection == 1) this.clearPotProperty(player);
            else return;
        });
    }

    static analyzeEquipment(player) {
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
        if (lore.some(line => line.includes("O"))) { // 강화 기회가 남아있다면
            let index = lore.findIndex(line => line.includes("O"));
            lore[index] = lore[index].replace("O", "*"); // 강화 기회 1개 소모

            let abilityRoll = Math.random(); // 몇 개의 능력이 부여될지 랜덤으로 설정
            let abilityCount;
            if (abilityRoll < 0.2) abilityCount = 0;
            else if (abilityRoll < 0.7) abilityCount = 1;
            else abilityCount = 2;
            
            let abilities = [];
            let chosenAbilities = {};

            equipmentInfo.categories.forEach(category => {
                if (abilityData[category]) {
                    abilities = abilities.concat(abilityData[category]);
                }
            });
            
            // 🔹 랜덤으로 능력을 선택
            for (let i = 0; i < abilityCount; i++) {
                let ability = abilities[Math.floor(Math.random() * abilities.length)];
            
                // 이번 감정에서 같은 능력이 나왔으면 +1 증가
                if (chosenAbilities[ability]) {
                    chosenAbilities[ability] += 1;
                } else {
                    chosenAbilities[ability] = 1;
                }
            }
            
            // 🔹 기존 능력과 비교하여 최종적으로 추가 또는 레벨 증가
            for (let ability in chosenAbilities) {
                let existingIndex = lore.findIndex(line => line.startsWith(ability));
            
                if (existingIndex !== -1) {
                    // 기존 능력이 있다면 현재 부여된 만큼 추가
                    let parts = lore[existingIndex].split(" ");
                    let level = parseInt(parts[1]) + chosenAbilities[ability];
                    lore[existingIndex] = `${parts[0]} ${level}`;
                } else {
                    // 기존 능력이 없으면 새로 추가
                    lore.push(`${ability} ${chosenAbilities[ability]}`);
                }
            }
            
            player.sendMessage(`${abilityCount}개의 능력이 부여되었습니다.`);
            item.setLore(lore);
            return;
        }
        else if (lore.some(line => line.includes("*"))) {
            player.sendMessage("이 아이템은 더 이상 감정할 수 없습니다.");
            return;
        }
        else { //슬롯 1~5개 랜덤 부여 및 감정
            let chanceRoll = Math.random();
            let upgradeChances;
            if (chanceRoll < 0.1) upgradeChances = 1;
            else if (chanceRoll < 0.3) upgradeChances = 2;
            else if (chanceRoll < 0.7) upgradeChances = 3;
            else if (chanceRoll < 0.9) upgradeChances = 4;
            else upgradeChances = 5;

            let upgradeLine = "O ".repeat(upgradeChances).trim();
            lore.unshift(upgradeLine);

            let abilityRoll = Math.random(); // 몇 개의 능력이 부여될지 랜덤으로 설정
            let abilityCount;
            if (abilityRoll < 0.2) abilityCount = 0;
            else if (abilityRoll < 0.7) abilityCount = 1;
            else abilityCount = 2;
            
            let abilities = [];
            let chosenAbilities = {};

            equipmentInfo.categories.forEach(category => {
                if (abilityData[category]) {
                    abilities = abilities.concat(abilityData[category]);
                }
            });
            
            // 🔹 랜덤으로 능력을 선택
            for (let i = 0; i < abilityCount; i++) {
                let ability = abilities[Math.floor(Math.random() * abilities.length)];
            
                // 이번 감정에서 같은 능력이 나왔으면 +1 증가
                if (chosenAbilities[ability]) {
                    chosenAbilities[ability] += 1;
                } else {
                    chosenAbilities[ability] = 1;
                }
            }
            
            // 🔹 기존 능력과 비교하여 최종적으로 추가 또는 레벨 증가
            for (let ability in chosenAbilities) {
                let existingIndex = lore.findIndex(line => line.startsWith(ability));
            
                if (existingIndex !== -1) {
                    // 기존 능력이 있다면 현재 부여된 만큼 추가
                    let parts = lore[existingIndex].split(" ");
                    let level = parseInt(parts[1]) + chosenAbilities[ability];
                    lore[existingIndex] = `${parts[0]} ${level}`;
                } else {
                    // 기존 능력이 없으면 새로 추가
                    lore.push(`${ability} ${chosenAbilities[ability]}`);
                }
            }
            
            player.sendMessage(`${abilityCount}개의 능력이 부여되었습니다.`);
            item.setLore(lore);
            return;
        }
    }

    static clearPotProperty(player) {
        const form = new ActionFormData()
        .title("Debug")
        .body("월드에 있는 모든 솥의 내용물을 초기화하시겠습니까?\nstate는 초기화되지 않습니다.\n(오류 발생 시에만 사용)")
        .button("예")
        .button("아니요");

        form.show(player).then(response => {
            if (response.selection == 0) {
                world.setDynamicProperty("cookingPot", "");
                world.setDynamicProperty("completePot", "");
                player.sendMessage("초기화되었습니다.");
            }
            else if (response.selection == 1) this.selectMenu(player);
            else return;
        });
    }
}